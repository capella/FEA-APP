// Ionic app_fea App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app_fea' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app_fea.controllers' is found in controllers.js
angular.module('app_fea', ['ionic', 'app_fea.controllers', 'app_fea.services', 'ngResource', 'pascalprecht.translate','flexcalendar', 'ngCordova'])

.run(function($ionicPlatform, $cordovaPush, User_server, $cordovaDevice, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    document.addEventListener("deviceready", function () {
      var push = PushNotification.init({
          "android": {
              "senderID": "950391589235"
          },
          "ios": {}, 
          "windows": {} 
      });

      push.on('registration', function(data) {
          var send_data = {uuid: $cordovaDevice.getUUID(), sendcode: data.registrationId, system: $cordovaDevice.getPlatform()};
          console.log(JSON.stringify(data));
      });

      push.on('notification', function(data) {
          console.log("notification event");
          console.log(JSON.stringify(data));
      });

      push.on('error', function(e) {
          console.log("push error");
      });
    });
   
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.styleLightContent();
    }

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
    url: '/evento/:id/:mes/:ano',
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
})

.config(function ($translateProvider) {
  $translateProvider.translations('pt', {
      JANUARY: 'Janeiro',
      FEBRUARY: 'Fevereiro',
      MARCH: 'Março',
      APRIL: 'Abril',
      MAI: 'Maio',
      JUNE: 'Junho',
      JULY: 'Julho',
      AUGUST: 'Agosto',
      SEPTEMBER: 'Setembro',
      OCTOBER: 'Outubro',
      NOVEMBER: 'Novembro',
      DECEMBER: 'Dezembro',

      SUNDAY: 'Domingo',
      MONDAY: 'Segunda',
      TUESDAY: 'Terça',
      WEDNESDAY: 'Quarta',
      THURSDAY: 'Quinta',
      FRIDAY: 'Sexta',
      SATURDAY: 'Sábado'
  });
  $translateProvider.preferredLanguage('pt');
  $translateProvider.useSanitizeValueStrategy('escape');
});
