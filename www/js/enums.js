angular.module('Enums', [])

.factory('Enum', [function () {
  var enumService = {
    DEFAULT_LAT: 49.261,
    DEFAULT_LNG: -123.246,
    DEFAULT_MAP_ZOOM: 12,
    DEFAULT_SEARCH_ZOOM: 18 
  };

  return enumService;
}]
  
);
