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

.controller('BandexCtrl', function($scope){

  
  
})

.controller('NoticiasCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('EventosCtrl', function($scope) {
 $scope.options = {
    defaultDate: new Date([2015, 06, 25]),
    minDate: new Date([2015, 06, 12]),
    maxDate: new Date([2015, 12, 31]),
    disabledDates: [
      new Date([2015, 06, 30]),
      new Date([2015, 07, 25]),
      new Date([2015, 08, 13]),
    ],
    dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    eventClick: function(date) {
      console.log(date);
    },
    dateClick: function(date) {
      console.log(date);
    },
    changeMonth: function(month) {
      console.log(month);
    },
  };

  $scope.events = [
    {foo: 'bar', date: new Date([2015, 12, 31])},
    {foo: 'bar', date: new Date([2015, 6, 4])},
    {foo: 'bar', date: new Date([2015, 6, 14])},
    {foo: 'bar', date: new Date([2015, 6, 25])},
    {foo: 'bar', date: new Date([2015, 6, 19])},
    {foo: 'bar', date: new Date([2015, 6, 20])}
  ];
})

.controller('NoticiaCtrl', function($scope, $stateParams) {
})

.controller('EventoDetailCtrl', function($scope, $stateParams, $ionicPlatform) {

    // Temos que esperar para carregar
    $ionicPlatform.ready(function() {
        try {
            var mapOptions = {
                zoom: 17,
                center: new google.maps.LatLng(-23.5588402,-46.7291343),
                disableDefaultUI: true
            }

            var mapa = new google.maps.Map(document.getElementById('map_canvas_z'), mapOptions);

            var marker = new google.maps.Marker({
                map: mapa,
                position: mapOptions.center,
                title: "Rua tal."
            });
        } catch (err) {
            console.log(err);
        }
      });


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
