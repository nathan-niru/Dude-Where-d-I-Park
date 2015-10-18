angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $http) {
    var latlng = new google.maps.LatLng(49.261, -123.246);
    var myOptions = {
        zoom: 8,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map-div");
    var map = new google.maps.Map(mapDiv, myOptions);
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(pos);
    });

    $http({
      method: 'GET',
      url: 'data.json',
      responseType: 'json'
    }).then(function successCallback(response) {
      var infoDiv = document.getElementById("info-div");
      var infoText = document.getElementById("info-text");

      map.addListener('click', function() {
        infoDiv.style.width = 0;
        infoDiv.style.display = "none";
        mapDiv.style.width = "100%";
      });

      var clickListener = function(data) {
        mapDiv.style.width = "76%";
        infoText.innerHTML = data;
        infoDiv.style.width = "24%";
        infoDiv.style.display = "block";
      }

      //console.log(response.data);
      var markers = response.data.map(function(data) {
        var latLng = data.Point.coordinates.split(",");
        var marker = new google.maps.Marker({
          position: {lng: parseFloat(latLng[0]), lat: parseFloat(latLng[1])}
        });
        marker.addListener('click', clickListener.bind(this, data.description));
        return marker;
      });

      var mcOptions = {gridSize: 50, maxZoom: 20};
      var mc = new MarkerClusterer(map, markers, mcOptions);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
})

.controller('ParkingCtrl', function($scope) {

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
