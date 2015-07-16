angular.module('fea_app.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('BandexCtrl', function($scope, $filter, datafetcher, loadingService){

    $scope.refreshPage = function(){
      $scope.bandex = 'central'; //bandex exibido default
      $scope.listabandex = {};
      $scope.listabandex.quimica = [];
      $scope.listabandex.central = []; //listas de cardapios do bandex da semana
      //ISSO VAI VIR DO SERVIDOR
      loadingService.startLoading($scope);
      datafetcher.fetch({}, "bandex", "app/bandejao.json").then(function(data){
        //agora vem a pedreiragem
        console.debug(data);
        for(var bandex in $scope.listabandex)
        {
          if(data.data[bandex]['SEGUNDA-FEIRA']) {
            data.data[bandex]['SEGUNDA-FEIRA'].day = 1;
            $scope.listabandex[bandex].push(data.data[bandex]['SEGUNDA-FEIRA']);
          }
          if(data.data[bandex]['TER&Ccedil;A-FEIRA']) {
            data.data[bandex]['TER&Ccedil;A-FEIRA'].day = 2;
            $scope.listabandex[bandex].push(data.data[bandex]['TER&Ccedil;A-FEIRA']);
          }
          if(data.data[bandex]['TERÇA-FEIRA']) {
            data.data[bandex]['TERÇA-FEIRA'].day = 2;
            $scope.listabandex[bandex].push(data.data[bandex]['TERÇA-FEIRA']);
          }
          if(data.data[bandex]['QUARTA-FEIRA']) {
            data.data[bandex]['QUARTA-FEIRA'].day = 3;
            $scope.listabandex[bandex].push(data.data[bandex]['QUARTA-FEIRA']);
          }
          if(data.data[bandex]['QUINTA-FEIRA']) {
            data.data[bandex]['QUINTA-FEIRA'].day = 4;
            $scope.listabandex[bandex].push(data.data[bandex]['QUINTA-FEIRA']);
          }
          if(data.data[bandex]['SEXTA-FEIRA']) {
            data.data[bandex]['SEXTA-FEIRA'].day = 5;
            $scope.listabandex[bandex].push(data.data[bandex]['SEXTA-FEIRA']);
          }
          if(data.data[bandex]['S&Aacute;BADO']) {
            data.data[bandex]['S&Aacute;BADO'].day = 6;
            $scope.listabandex[bandex].push(data.data[bandex]['S&Aacute;BADO']);
          }
          if(data.data[bandex]['DOMINGO']) {
            data.data[bandex]['DOMINGO'].day = 7;
            $scope.listabandex[bandex].push(data.data[bandex]['DOMINGO']);
          }
        }
        //fim pedreiragem
        console.debug($scope.listabandex);
        loadingService.finishWithSuccess($scope);
      }, function(error){
        loadingService.finishWithError($scope, error);
      });
      //FIM SERVIDOR

      $scope.hoje = moment().format('E'); //dia de hoje, 1 eh segunda - 7 eh domingo
    };


    $scope.refreshPage();

$scope.getDayName = function(day){
    return moment().isoWeekday(day).format("dddd");
}

})

.controller('NoticiasCtrl', function($scope, datafetcher, loadingService) {

  $scope.page = 0;
  $scope.returnedNothing = false;
  $scope.fetchMore = function(page){
    datafetcher.fetch({}, 'noticias_'+$scope.page, "app/"+($scope.page*10)+"/10/noticias.json").then(function(data){
      $scope.page++;
      angular.forEach(data.data, function(item){ //adicionamos os itens novos a lista e arrumamos a data
        var data = moment(item.time);
        item.time = data.format("DD/MM/YYYY");
        $scope.listanoticias.push(item);
      });
      $scope.$broadcast("scroll.infiniteScrollComplete");
      $scope.returnedNothing = data.data.length == 0; //verificamos se acabou pra desligar o infinite scroll
      loadingService.finishWithSuccess($scope);
    }, function(error){
      loadingService.finishWithError($scope, error);
    });
  }

  $scope.refreshPage = function(){
    $scope.listanoticias = [];
    loadingService.startLoading($scope);
  };


  $scope.refreshPage();

})

.controller('EventosCtrl', function($scope, $state, datafetcher, loadingService, persistor) {
 
  //mes e ano iniciais
  $scope.refreshPage = function(){
    $scope.month = moment().format("MM");
    $scope.year = moment().format("YYYY");
    $scope.fulldate = moment().format("DD [de] MMMM [de] YYYY");
    $scope.todayevents = [];
    $scope.getMonth();
  }

  $scope.getMonth = function(){
    loadingService.startLoading($scope);
    datafetcher.fetch({}, 'events_'+$scope.month+"_"+$scope.year, "app/"+$scope.month+"/"+$scope.year+"/eventos.json")
      .then(function(data){
        loadingService.finishWithSuccess($scope);
        $scope.events = [];
        angular.forEach(data.data, function(item){
          item.date = moment(item.data);
          $scope.events.push(item);
        });
        $scope.events = data.data;
    }, function(error){
      loadingService.finishWithError($scope, error);
    });
  }

  $scope.viewEvent = function(evento){
    persistor.set("evento", evento);
    var ev = persistor.get("evento");
    $state.go("app.evento");
  }

 $scope.options = {
    minDate: new Date([2015, 01, 01]),
    maxDate: new Date([2020, 12, 01]),
    eventClick: function(event) {
      $scope.fulldate = moment(event.date).format("DD [de] MMMM [de] YYYY");
      $scope.todayevents = [];
      //pesquisar todos os eventos e achar os desse dia (a merda da flex-calendar não suporta mais de um evento por dia)
      angular.forEach($scope.events, function(item){
        if(moment(item.date).isSame(moment(event.date), 'day'))
        {
          $scope.todayevents.push(item);
        }
      });
    },
    dateClick: function(date) {
      $scope.fulldate = moment(date.date).format("DD [de] MMMM [de] YYYY");
      $scope.todayevents = [];
    },
    changeMonth: function(month, year) {
      $scope.month = (month.index+1)%12; //por algum motivo janeiro é 12 (?)
      $scope.year = year;
      $scope.getMonth();
    }
  };

  $scope.refreshPage();

})

.controller('EventoDetailCtrl', function($scope, persistor) {
        $scope.evento = persistor.get("evento", {});
        //se não tiver setadas as coordenadas nem chama a API
        if($scope.evento.lat)
        {
          try {
              var mapOptions = {
                  zoom: 17,
                  center: new google.maps.LatLng($scope.evento.lat,$scope.evento.lon),
                  disableDefaultUI: true
              }

              var mapa = new google.maps.Map(document.getElementById('map_canvas_z'), mapOptions);

              var marker = new google.maps.Marker({
                  map: mapa,
                  position: mapOptions.center,
                  title: "Local"
              });
          } catch (err) {
              console.log(err);
          }
        }
})

.controller('BCtrl', function($scope, $stateParams, $ionicPlatform) {

    // Temos que esperar para carregar
    $ionicPlatform.ready(function() {
        try {
            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(-23.5588402,-46.7291343),
                disableDefaultUI: true
            }

            var mapa = new google.maps.Map(document.getElementById('map_canvas_a'), mapOptions);

            var marker = new google.maps.Marker({
                map: mapa,
                position: mapOptions.center,
                title: "FEA"
            });

            var marker = new google.maps.Marker({
                map: mapa,
                position: new google.maps.LatLng(-23.559339,-46.731497),
                title: "IME"
            });
        } catch (err) {
            console.log(err);
        }
      });


});
