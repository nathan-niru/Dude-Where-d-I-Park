angular.module('starter.controllers', [])

.controller('MapCtrl', function($scope, $http, $localStorage, $appSettings, Enum) {
    //TODO: Separate the functionalities below into different components
    var latlng = new google.maps.LatLng(Enum.DEFAULT_LAT, Enum.DEFAULT_LNG);
    var mapOptions = {
        zoom: Enum.DEFAULT_MAP_ZOOM,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map-div");
    var map = new google.maps.Map(mapDiv, mapOptions);
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(pos);
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var searchMarkers = [];
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      // Clear out the old markers.
      searchMarkers.forEach(function(searchMarker) {
        searchMarker.setMap(null);
      });
      searchMarkers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        searchMarkers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      // If there's only one location then don't use fitBounds.
      // Instead use setCenter and setZoom
      if (searchMarkers.length === 1) {
        map.setCenter(searchMarkers[0].position);
        map.setZoom($appSettings.getSearchZoom());
      } else {
        map.fitBounds(bounds);
      }
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
        $localStorage.setObject('savedParking', currentParking);
        selectButton.style.display = "none";
        cancelButton.style.display = "inline-block";
      });

      cancelButton.addEventListener('mousedown', function() {
        $localStorage.set('savedParking', undefined);
        cancelButton.style.display = "none";
        selectButton.style.display = "inline-block";
      });

      var clickListener = function(data) {
        mapDiv.style.width = "76%";

        //TODO: parse description to display meaningful text
        infoText.innerHTML = data.description;
        var savedParking = $localStorage.getObject('savedParking');
        if (savedParking) {
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

})

.controller('SettingsCtrl', function($scope, $localStorage, Enum) {
  $scope.updateSearchZoom = function() {
    $localStorage.set('searchZoom', $scope.searchZoom);
  };

  $scope.searchZoom = Number($localStorage.get('searchZoom'));
  if (isNaN($scope.searchZoom)) {
    $scope.searchZoom = Enum.DEFAULT_SEARCH_ZOOM;
    $scope.updateSearchZoom();
  }

  $scope.defaultTime = Number($localStorage.get('defaultTime'));
    if (isNaN($scope.defaultTime)) {
    $scope.defaultTime = 15;
  }
  $scope.updateTime = function() {
    $localStorage.set('defaultTime', $scope.defaultTime);
  };

  $scope.vibrate = $localStorage.get('vibrate');
  if ($scope.vibrate == 'false') {
    $scope.vibrate = false;
  } else {
    $scope.vibrate = true;
  }
  $scope.updateVibrate = function() {
    $localStorage.set('vibrate', $scope.vibrate);
  };

  $scope.sound = $localStorage.get('sound');
  if ($scope.sound == 'false') {
    $scope.sound = false;
  } else {
    $scope.sound = true;
  }
  $scope.updateSound = function() {
    $localStorage.set('sound', $scope.sound);
  };
});
