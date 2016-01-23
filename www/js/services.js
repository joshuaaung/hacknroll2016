angular.module('starter.services', [])

.factory('Camera', ['$q', function($q) {
 
  return {
    getPicture: function(options) {
      var q = $q.defer();
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  }
}])

.factory('Items', function($window) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  /*
  var items = [{
    id: 0,
    name: 'Milk',
    description: 'Can drink',
    image: 'img/ben.png'
  }];*/
  /*{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }*/

  return {
    all: function() {
      var values = [],
        keys = Object.keys($window.localStorage),
        i = keys.length;
      while ( i-- ) {
        values.push( JSON.parse($window.localStorage[i]) );
      }
      console.log(keys);
      return values;
    },
    set: function(key, value) {
      keys = Object.keys($window.localStorage);
      if(keys.length != 0) {
        key = parseInt(keys[keys.length-1]) + 1;    
      } else {
        key = 0;
      }
      value["id"] = key;
      $window.localStorage[key] = JSON.stringify(value);
      console.log($window.localStorage);
    },
    get: function(key, defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    removeAll: function() {
      $window.localStorage.clear();
    }
    /*
    all: function() {
      return items;
    },
    remove: function(itemId) {
      items.splice(items.indexOf(itemId), 1);
    },
    get: function(itemId) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === parseInt(itemId)) {
          return items[i];
        }
      }
      return null;
    },
    insert: function(item) {
      var latestId;
      if(items.length!=0) {
        latestId = items[items.length - 1].id + 1;
      } else {
        latestId = 0;
      }
      item.id = latestId;
      items.push(item);
    }
    */
  };
})

.factory('CartItems', function($window, $rootScope) {
  var items = [];

  return {
    /*
    add: function(item) {
      key = JSON.parse(item).id + JSON.parse(item).name.charCodeAt(2);;
      $window.localStorage[key] = JSON.stringify(item);
      console.log($window.localStorage[key]);
    }
    */
    all: function() {
      return items;
    },
    add: function(item, quantity) {
      //console.log(item);
      /*
      for(var i=0; i<items.length; i++) {
        if()
      }*/
      item['qty'] = quantity;
      items.push(item);
      $rootScope.$broadcast('cart-updated'); //This broadcast an event named 'cart-updated'. Whichever controller listening to this event via child class of $rootScope which is $scope will Do Something upon this event
      console.log(items);
    }
  }
});
