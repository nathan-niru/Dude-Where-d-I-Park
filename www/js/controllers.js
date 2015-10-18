angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $http) {
    var latlng = new google.maps.LatLng(49.261, -123.246);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-div"),
        myOptions);
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(pos);
    });

    $http({
      method: 'GET',
      url: 'data.json',
      responseType: 'json'
    }).then(function successCallback(response) {
      var markers = response.data.map(function(data) {
        var latLng = data.Point.coordinates.split(",");        
        return new google.maps.Marker({
          position: {lng: parseFloat(latLng[0]), lat: parseFloat(latLng[1])}
        });
      });

      var mc = new MarkerClusterer(map, markers);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
})

.controller('ParkingCtrl', function($scope) {

})

.controller('SettingsCtrl', function($scope, $localstorage) {
  console.log("lol")

  $scope.defaultRadius = Number($localstorage.get('defaultRadius'));
  if (isNaN($scope.defaultRadius)) {
    $scope.defaultRadius = 50;
  }

  $scope.defaultTime = 15;

  $scope.updateRadius = function() {
    $localstorage.set('defaultRadius', $scope.defaultRadius);
    console.log("Setting default radius to " + $localstorage.get('defaultRadius'));
  };

  console.log($localstorage.get('defaultRadius'));
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
