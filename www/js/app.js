// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: '1542239316102873'});
  $ionicPlatform.ready(function() {
    /*
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 10);
*/
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  /*
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common["X-Requested-With"];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";  
  */
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: "templates/tabs.html"
    //controller: 'TabsCtrl'
  })

  // Each tab has its own nav history stack:
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.items', {
    url: '/items',
    views: {
      'tab-items': {
        templateUrl: 'templates/tab-items.html',
        controller: 'ItemsCtrl'
      }
    }
  })
  .state('tab.item-detail', {
    url: '/items/:itemId',
    views: {
      'tab-items': {
        templateUrl: 'templates/item-detail.html',
        controller: 'ItemDetailCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('list', {
    url: '/list',
    controller: 'ListCtrl',
    templateUrl: 'templates/tab-list.html'
    /*views: {
      'tab-list': {
        templateUrl: 'templates/tab-list.html',
        controller: 'ListCtrl'
      }
    }*/
  })

  .state('stores', {
    url: '/stores',
    controller: 'StoresCtrl',
    templateUrl: 'templates/tab-stores.html'
  });

  // if none of the above states are matched, use this as the fallback
  //This is also a way to set the first page when the app launches
  $urlRouterProvider.otherwise('/list'); 

});
