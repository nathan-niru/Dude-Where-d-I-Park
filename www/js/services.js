angular.module('starter.services', [])

.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      try { 
        return JSON.parse($window.localStorage[key]);
      } catch(e) { 
        return undefined;
      }
    }
  }
}])

.factory('$appSettings', ['$localStorage', 'Enum', function($localStorage, Enum) {
  return {
    getSearchZoom: function() {
      return Number($localStorage.get('searchZoom')) || Enum.DEFAULT_SEARCH_ZOOM;
    }
  }
}])

.factory('$savedParkingService', ['$localStorage', function($localStorage) {
  return {
    getSavedParking: function() {
      return $localStorage.getObject('savedParking');
    },
    setSavedParking: function(parkingObject) {
      $localStorage.setObject('savedParking', parkingObject);
    },
    clearSavedParking: function() {
      $localStorage.setObject('savedParking', undefined);
    }
  }
}]);

