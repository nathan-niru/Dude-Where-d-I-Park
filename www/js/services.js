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
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('$appSettings', ['$localStorage', 'Enum', function($localStorage, Enum) {
  return {
    getSearchZoom: function() {
      return Number($localStorage['searchZoom']) || Enum.DEFAULT_SEARCH_ZOOM;
    }
  }
}]);

