angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope) {
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

    var markerClustererOptions = new MarkerClusterer(map);

    var kmlOptions = {
      suppressInfoWindows: false,
      preserveViewport: false,
      map: map
    };
    var kmlLayer = new google.maps.KmlLayer(
      "http://dudewheredipark.parseapp.com/parking_meter_rates_and_time_limits_small.kml",
      kmlOptions
    );
    console.log(kmlLayer);
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
