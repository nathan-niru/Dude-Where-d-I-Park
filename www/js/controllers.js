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
      var parkingIDInput = document.getElementById("parking-id");
      var selectButton = document.getElementById("select-button");
      var cancelButton = document.getElementById("cancel-button");

      var currentParking = undefined;

      map.addListener('mousedown', function() {
        infoDiv.style.width = 0;
        infoDiv.style.display = "none";
        mapDiv.style.width = "100%";
      });

      selectButton.addEventListener('mousedown', function() {
        window.localStorage.setItem("savedParking", JSON.stringify(currentParking));
        selectButton.style.display = "none";
        cancelButton.style.display = "inline-block";
      });

      cancelButton.addEventListener('mousedown', function() {
        window.localStorage.clear();
        cancelButton.style.display = "none";
        selectButton.style.display = "inline-block";
      });

      var clickListener = function(data) {
        mapDiv.style.width = "76%";

        //TODO: parse description to display meaningful text
        infoText.innerHTML = data.description;
        var savedParkingString = window.localStorage.getItem("savedParking");
        if (savedParkingString) {
          var savedParking = JSON.parse(savedParkingString);
          if (data.id === savedParking.id) {
            selectButton.style.display = "none";
            cancelButton.style.display = "inline-block";
          } else {
            cancelButton.style.display = "none";
            selectButton.style.display = "inline-block";
          }
        }

        infoDiv.style.width = "24%";
        infoDiv.style.display = "block";
        currentParking = data;
      }

      //console.log(response.data);
      var markers = response.data.map(function(data) {
        var latLng = data.Point.coordinates.split(",");
        var marker = new google.maps.Marker({
          position: {lng: parseFloat(latLng[0]), lat: parseFloat(latLng[1])}
        });
        marker.addListener('mousedown', clickListener.bind(this, data));
        return marker;
      });

      var mcOptions = {gridSize: 50, maxZoom: 20};
      var mc = new MarkerClusterer(map, markers, mcOptions);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
})

.controller('ParkingCtrl', function($scope, $http, $ionicPopup) {
 var token = localStorage.getItem('token');
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'token',
     template: token
   });
   };
  //document.getElementById("testPush").addEventListener('click', function() {
  $scope.sendNotification = function() {
              // Define relevant info
              var privateKey = 'd014976ebdf7883669a59a20decfe5d1844c9216ab645212';
              var tokens = [localStorage.getItem('token')];
              var appId = '48f57fe4';

              // Encode your key
              var auth = btoa(privateKey + ':');

              // Build the request object
              var req = {
                method: 'POST',
                url: 'https://push.ionic.io/api/v1/push',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Ionic-Application-Id': appId,
                  'Authorization': 'basic ' + auth
                },
                android: {
                  "payload": {}
                },
                data: {
                  "tokens": tokens,
                  "notification": {
                    "alert":"Dude, your parking is gonna expire!"
                  }
                }
              };

              // Make the API call
              $http(req).success(function(resp){
                // Handle success
                console.log("Ionic Push: Push success! " + JSON.stringify(resp));
              }).catch(function(data, status, headers, config){
                // Handle error
                console.log("Ionic Push: Push error...");
              });

    };

})

.controller('SettingsCtrl', function($scope, $localstorage) {

  $scope.defaultRadius = Number($localstorage.get('defaultRadius'));
  if (isNaN($scope.defaultRadius)) {
    $scope.defaultRadius = 50;
  }
  $scope.updateRadius = function() {
    $localstorage.set('defaultRadius', $scope.defaultRadius);
  };

  $scope.defaultTime = Number($localstorage.get('defaultTime'));
    if (isNaN($scope.defaultTime)) {
    $scope.defaultTime = 15;
  }
  $scope.updateTime = function() {
    $localstorage.set('defaultTime', $scope.defaultTime);
  };

  $scope.vibrate = $localstorage.get('vibrate');
  if ($scope.vibrate == 'false') {
    $scope.vibrate = false;
  } else {
    $scope.vibrate = true;
  }
  $scope.updateVibrate = function() {
    $localstorage.set('vibrate', $scope.vibrate);
  };

  $scope.sound = $localstorage.get('sound');
  if ($scope.sound == 'false') {
    $scope.sound = false;
  } else {
    $scope.sound = true;
  }
  $scope.updateSound = function() {
    $localstorage.set('sound', $scope.sound);
  };
});
