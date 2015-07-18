// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('fea_app', ['ionic', 'fea_app.controllers','fea_app.filters', 'fea_app.services' ,'flexcalendar', 'ngTextTruncate', 'LocalStorageModule', 'ion-sticky'])

.run(function($ionicPlatform, $timeout) {
  moment.locale("pt-br"); //seta o local pra brazil
  document.addEventListener("deviceready", function(){
    //hora de fechar a splashscreen
    if(navigator.splashscreen)
    {
        navigator.splashscreen.hide();    
    }
    if (window.StatusBar) {
      ionic.Platform.fullScreen(true, true);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.eventos', {
    url: "/eventos",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'EventosCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller: "BCtrl"
      }
    }
  })

  .state('app.bus', {
    url: "/bus",
    views: {
      'menuContent': {
        templateUrl: "templates/bus.html",
      }
    }
  })
  .state('app.notas', {
    url: "/notas",
    views: {
      'menuContent': {
        templateUrl: "templates/notas.html",
      }
    }
  })
  .state('app.bandex', {
    url: "/bandex",
    views: {
      'menuContent': {
        templateUrl: "templates/comida.html",
        controller: "BandexCtrl"
      }
    }
  })

  .state('app.cavc', {
    url: "/cavc",
    views: {
      'menuContent': {
        templateUrl: "templates/cavc.html"
      }
    }
  })


  .state('app.evento', {
    url: "/evento",
    views: {
      'menuContent': {
        templateUrl: "templates/evento.html",
        controller: 'EventoDetailCtrl'
      }
    }
  })

    .state('app.noticias', {
      url: "/noticias",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'NoticiasCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/noticias');
});
