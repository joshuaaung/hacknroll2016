angular.module('starter.controllers', ['starter.services', 'ngOpenFB', 'ionic-datepicker'])

.controller('TabsCtrl', function ($rootScope, $scope, $interval, Items, CartItems) {
  $scope.data = {
    cartItemsCount : 0
  };
  /* $interval runs occasionally(in this case every 50ms) and execute the function inside.
  $interval(function updateCart() {
    $rootScope.$on('cart-updated', function(e) { //$on listens for an event with the name specified
      $scope.data.cartItemsCount = CartItems.length;
    });
  }, 50);
*/
  /*Updating the number shown in the badge on top of the Cart-tab*/
  $scope.$on('cart-updated', function(e) {
    $scope.data['cartItemsCount'] = CartItems.all().length;
  });
})

.controller('ListCtrl', function ($rootScope, $scope) {
  $scope.InsertNewKeyword = function (keyword) {
    ListItems.set(0, keyword);
    console.log('here');
  };

  $scope.$on('$ionicView.enter', function(e) {
    $scope.list = ListItems.all();
  });



})

.controller('DashCtrl', function ($rootScope, $scope, $interval, Items, CartItems, ngFB) {
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
    
    /*adding new item into the browse list*/
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
  };

  /*Displaying Cart Items*/
  $scope.$on('$ionicView.enter', function(e){
    $scope.items = CartItems.all();
  });
  /*
  $scope.$on('cart-updated', function(e) { //$on listens for an event with the name specified
    //$scope.cartItemsCount = CartItems.length;
    console.log("123");
  });
*/
  
})

.controller('ItemsCtrl', function ($rootScope, $scope, $http, $state, $ionicLoading, Items, ngFB) {
  
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
    //$scope.items = Items.all();
    /*
    $http({
      method: 'GET',
      url: 'http://experiment.thewhiteconcept.com/hackandroll/product/',
      crossDomain : true,
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    */
    /* GOT CROSS-SITE DOMAIN ERROR */
    //$http.get('http://experiment.thewhiteconcept.com/hackandroll/product/').then(function(resp) {
    //  console.log('Success', resp);
    //});
    var url = 'http://experiment.thewhiteconcept.com/hackandroll/product/';
    $http({ 
      method: 'GET', 
      url: url
    }).then(function successCallback(resp) {
      console.log(resp);
      var jsonString = resp.data.substring(1, resp.data.length-1); //remove the first '(' and last ')' from the JSONP string
      var jsonObject = JSON.parse(jsonString);
      console.log(jsonObject.products);
      $scope.items = jsonObject.products;

      var imgArray = [];
      for(var i=0; i<jsonObject.products.length; i++) {
        imgArray.push('http://experiment.thewhiteconcept.com/hackandroll/access/images/products/'+jsonObject.products[i].product._id+'.png');
      }
      $scope.imgArray = imgArray;
    }, function errorCallback(resp) {
      console.log('Fail', resp);
    });
  });

  $scope.$on('$ionicView.beforeEnter', function(e) {
    $ionicLoading.show({
      templateUrl: 'templates/welcome.html',//'Authenticating...'
      animation: 'fade-in',
      scope: $scope,
      duration: 2000
    });
  });
  /*
  $scope.$on('loggedin', function(e) {
    $ionicLoading.show({
      templateUrl: 'templates/welcome.html',
      animation: 'fade-in',
      scope: $scope,
      duration: 2000
    });
  });
  */
  $scope.remove = function(item) {
    Items.remove(item);
  };
})

.controller('ItemDetailCtrl', function ($rootScope, $scope, $http, $stateParams, $ionicModal, Items, CartItems) {
  var url = 'http://experiment.thewhiteconcept.com/hackandroll/product/'+$stateParams.itemId;
  $http({ 
    method: 'GET', 
    url: url
  }).then(function successCallback(resp) {
    console.log(resp);
    var jsonString = resp.data.substring(1, resp.data.length-1); //remove the first '(' and last ')' from the JSONP string
    var jsonObject = JSON.parse(jsonString);
    //console.log(jsonObject.products);
    $scope.item = jsonObject.products[0];
    //console.log($scope.item);
    $scope.itemImage = 'http://experiment.thewhiteconcept.com/hackandroll/access/images/products/'+jsonObject.products[0].product._id+'.png';
  }, function errorCallback(resp) {
    console.log('Fail', resp);
  });

  /*To fire-up an enlarged Image-modal*/
  $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.$on('modal.shown', function() {
    console.log('Modal is shown!');
  });

  $scope.imageSrc = '';

  $scope.showImage = function(itemId) {
    console.log(itemId);
    $scope.imageSrc = 'http://experiment.thewhiteconcept.com/hackandroll/access/images/products/'+itemId+'.png';

    $scope.openModal();
  }

  /*To Toggle the Quantity*/
  $scope.quantity = ""; //Initial (default)
  $scope.decreaseItem = function() {
    if($scope.quantity > 0) {
      $scope.quantity--;
    } else {
      $scope.quantity = ""; //To remove the digit from the input field
    }
  }; 

  $scope.increaseItem = function() {
    $scope.quantity++;
  };

  /*Item added to cart*/
  $scope.addToCart = function(item) {
    CartItems.add(item, $scope.quantity);
    $scope.quantity = ""; //Set back the quantity to empty
    //$rootScope.$emit('cart-updated', {});
    //$scope.$emit('cart-updated',{});  //$emit an event with the name specified
  };
  /*
  $scope.$on('cart-updated', function(e){ //$on listens for an event with the name specified
    console.log(CartItems.all());
  });
  */
})

.controller('AccountCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('AppCtrl', function ($rootScope, $scope, $state, $ionicLoading, $timeout, $ionicModal, $timeout, ngFB) {
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
              //$rootScope.$broadcast('loggedin');
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
