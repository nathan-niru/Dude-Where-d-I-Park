angular.module('Constants', [])

.factory('Constant', [function () {
  var constantsService = {
    DEFAULT_LAT: 49.261,
    DEFAULT_LNG: -123.246,
    DEFAULT_MAP_ZOOM: 12,
    DEFAULT_SEARCH_ZOOM: 18,
    DEFAULT_PARKING_LIST_ZOOM: 22,
    MAXIMUM_CHEAPEST_PARKING: 6,
    ADDRESS_NOT_FOUND: "Address not found"
  };

  return constantsService;
}]);