// Ionic app_fea App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app_fea' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app_fea.controllers' is found in controllers.js
angular.module('app_fea', ['ionic', 'app_fea.controllers', 'app_fea.services', 'ngResource', 'flexcalendar', 'ngCordova'])

.run(function($ionicPlatform, $cordovaPush, User_server, $cordovaDevice, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    var iosConfig = {
      "badge": true,
      "sound": true,
      "alert": true,
    };

    var androidConfig = {
      "senderID": "950391589235",
    };

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.styleLightContent();
    }

    document.addEventListener("deviceready", function () {
      if($cordovaDevice.getPlatform()=="iOS"){
        $cordovaPush.register(iosConfig).then(function(deviceToken) {
          // Success -- send deviceToken to server, and store for future use
          var send_data = {uuid: $cordovaDevice.getUUID(), sendcode: deviceToken, system: $cordovaDevice.getPlatform()};
          User_server.save(send_data, function(data){
            console.log(data);
          },function(data){
            console.log(JSON.stringify(data));
          }); 
        }, function(err) {
          console.log("Registration error: " + err);
        });
      } else if($cordovaDevice.getPlatform()=="Android"){
        $cordovaPush.register(androidConfig).then(function(result) {
        }, function(err) {
          console.log("Registration error: " + err);
        });
        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
          switch(notification.event) {
            case 'registered':
              if (notification.regid.length > 0 ) {
                var send_data = {uuid: $cordovaDevice.getUUID(), sendcode: notification.regid, system: $cordovaDevice.getPlatform()};
                User_server.save(send_data, function(data){
                  console.log(data);
                },function(data){
                  console.log(JSON.stringify(data));
                });         
              }
              break;
          }
        });

      }
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.bandejao', {
    url: '/bandejao',
    views: {
      'menuContent': {
        templateUrl: 'templates/bandejao.html',
        controller: 'BandejaoCtrl'
      }
    }
  })

  .state('app.eventos', {
    url: '/eventos',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendario.html',
        controller: 'EventosCtrl'
      }
    }
  })

  .state('app.evento', {
    url: '/evento/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/evento_id.html',
        controller: 'EventoCtrl'
      }
    }
  }) 

  .state('app.noticias', {
    url: '/noticias',
    views: {
      'menuContent': {
        templateUrl: 'templates/noticias.html',
        controller: 'NoticiasCtrl'
      }
    }
  }) 

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/idiomas_login.html',
      }
    }
  })

  .state('app.rotas', {
    url: '/rotas',
    views: {
      'menuContent': {
        templateUrl: 'templates/rotas.html'
      }
    }
  })

  $urlRouterProvider.otherwise('/app/noticias');
});
