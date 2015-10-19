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

.controller('ParkingCtrl', function($scope) {

});
