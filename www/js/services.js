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

.factory('$appSettings', ['$localStorage', 'Constant', function($localStorage, Constant) {
  return {
    getSearchZoom: function() {
      return Number($localStorage.get('searchZoom')) || Constant.DEFAULT_SEARCH_ZOOM;
    }
  }
}])

.factory('$savedParkingService', ['$localStorage', function($localStorage) {
  var savedParkingServiceObject = {
    getSavedParking: function() {
      return $localStorage.getObject('savedParking');
    },
    setSavedParking: function(parkingObject) {
      $localStorage.setObject('savedParking', parkingObject);
    },
    clearSavedParking: function() {
      $localStorage.setObject('savedParking', undefined);
    },
    setExpiryDateTime: function(dateTime) {
      var savedParking = savedParkingServiceObject.getSavedParking();
      savedParking.expiryDateTime = dateTime;
      savedParkingServiceObject.setSavedParking(savedParking);
    },
    getExpiryDateTime: function() {
      return savedParkingServiceObject.getSavedParking().expiryDateTime;
    }
  };
  
  return savedParkingServiceObject;
}])

.factory('$parkingCalculationService', [function() {
  return {
    getParkingInMapBounds: function(map, allParkingData) {
      if (!map || !allParkingData || allParkingData.length === 0) {
        return;
      }

      var parkingInBounds = [];
      allParkingData.forEach(function(parkingData) {
        if (map.getBounds().contains(
          new google.maps.LatLng(parkingData.latLng.lat, parkingData.latLng.lng))
        ) {
          parkingInBounds.push(parkingData);
        }
      });

      return parkingInBounds;
    },
    sortByCheapestParking: function(parkingData, limit) {
      // For now just sort by the parking rate
      // May consider doing more complex calculations (like rate * time that 
      // meter is in effect) in the future
      parkingData.sort(function(parkingA, parkingB) {
        return parkingA.rate - parkingB.rate;
      })

      if (limit) {
        return parkingData.slice(0, limit);
      } else {
        return parkingData;
      }
    }
  }
}])

.factory('$parkingDataService', ['$http', function($http) {
  return {
    getParkingDataAsync: function() {
      return $http({
        method: 'GET',
        url: 'data.json',
        responseType: 'json'
      }).then(function successCallback(response) {
        if (!response || !response.data) {
          return;
        }

        return response.data.map(function(data) {
          var coordinates = data.Point.coordinates.split(",");
          var parkingFeatures = data.description.split("<br>");

          var timeLimit = undefined;
          var timeLimitPrefix = "Time Limit: ";

          var rate = undefined;
          var ratePrefix = "Rate: ";

          parkingFeatures.forEach(function(feature) {
            if (feature.slice(0, timeLimitPrefix.length) === timeLimitPrefix) {
              timeLimit = feature.slice(timeLimitPrefix.length);
            } else if (feature.slice(0, ratePrefix.length) === ratePrefix) {
              rate = Number(feature.slice(ratePrefix.length).replace(/[^0-9\.]+/g,""));
            }
          });

          return {
            id: data.id,
            name: data.name,
            latLng: {lng: parseFloat(coordinates[0]), lat: parseFloat(coordinates[1])},
            timeLimit: timeLimit,
            rate: rate,
            // TODO: Probably can remove this once we figure out what to display on the info panel
            description: data.description
          }
        });
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    }
  }
}]);

