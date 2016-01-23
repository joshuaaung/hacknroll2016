angular.module('starter.controllers', ['starter.services', 'ngOpenFB', 'ionic-datepicker'])

.controller('DashCtrl', function($scope, Items, ngFB) {
  ngFB.api({
    path: '/me',
    params: {fields: 'id,name'}
  }).then(
    function (user) {
      $scope.user = user;
    });

  //DatePicker
  var disabledDates = [
    new Date(1437719836326),
    new Date(),
    new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
    new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
    new Date("08-14-2015"), //Short format
    new Date(1439676000000) //UNIX format
  ];
  var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];
  var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var datePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      console.log(val);
      $scope.datepickerObject["inputDate"] = val;
      console.log('Selected date is : ', val);
    }
  };
  $scope.datepickerObject = {
    titleLabel: 'Title',  //Optional
    todayLabel: 'Today',  //Optional
    closeLabel: 'Close',  //Optional
    setLabel: 'Set',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    inputDate: new Date(),  //Optional
    mondayFirst: true,  //Optional
    disabledDates: disabledDates, //Optional
    weekDaysList: weekDaysList, //Optional
    monthList: monthList, //Optional
    templateType: 'modal', //popup (OR) modal //Optional 
    showTodayButton: 'true', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(), //Optional
    to: new Date(2018, 8, 25),  //Optional
    callback: function (val) {  //Mandatory
      datePickerCallback(val);
    },
    dateFormat: 'dd-MM-yyyy', //Optional
    closeOnSelect: false, //Optional
  };

  $scope.AddItem = function (data) {
    var bestBefore = $scope.datepickerObject["inputDate"].getDate() + "-" + ($scope.datepickerObject["inputDate"].getMonth() + 1) + "-" + $scope.datepickerObject["inputDate"].getFullYear();
    var item = {
      name : data.name,
      description: data.desc,
      price:data.price,
      image: data.imageUrl,
      expire: bestBefore,
      location: data.location
    }
    Items.set(0 , item);
  };

  $scope.reset = function () {
    Items.removeAll();
  }
})

.controller('ItemsCtrl', function($scope, $state, $ionicLoading, Items, ngFB) {
  ngFB.api({
    path: '/me',
    params: {fields: 'id,name'}
  }).then(
  function (user) {
    $scope.user = user;
  });

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  /*
    $ionicView.enter will listen to the state change event and update/render the value accordingly.
    $ionicView.beforeEnter' will load first before entering to the page
  */
  $scope.$on('$ionicView.enter', function(e) {
    $scope.items = Items.all();
  });
  $scope.$on('$ionicView.beforeEnter', function(e) {
    $ionicLoading.show({
      templateUrl: 'templates/welcome.html',//'Authenticating...'
      animation: 'fade-in',
      scope: $scope,
      duration: 2000
    });
  });

  $scope.remove = function(item) {
    Items.remove(item);
  };
})

.controller('ItemDetailCtrl', function($scope, $stateParams, Items) {
  $scope.item = Items.get($stateParams.itemId, {});
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('AppCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicModal, $timeout, ngFB) {
  $scope.fbLogin = function () {
    $ionicLoading.show({
      template: '<p>Logging In..</p><ion-spinner icon="spiral"></ion-spinner>',
    });

    ngFB.login({scope: 'email'/*,read_stream,publish_actions'*/}).then(

      function (response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          
          $ionicLoading.show({
            template: '<p>Authenticating..</p><ion-spinner icon="lines"></ion-spinner>',//'Authenticating...'
            animation: 'fade-in',
            duration: 2000
          });

          /*
          ngFB.api({
            path: '/me',
            params: {fields: 'id,name'}
          }).then(
            function (user) {
              $scope.user = user;
            });
          
          $ionicLoading.show({
            templateUrl: 'templates/welcome.html',//'Authenticating...'
            animation: 'fade-in',
            scope: $scope,
            duration: 2000
          });
          */
          setTimeout(function () {
            $scope.$apply(function () {
              $state.go('tab.items');    
            });
          }, 2000);
          
          //$ionicLoading.hide();
        } else {
            alert('Facebook login failed');
        }
      });
  };
});