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
    var searchInput = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(searchInput);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchInput.style.display = "block";
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
      var routeButton = document.getElementById("route-button");
      var directionsPanel = document.getElementById('directions-panel');
      var removeRouteButton = document.getElementById('remove-route-button');

      var savedParkingMarker = undefined;
      var selectedParking = undefined;
      var selectedParkingMeter = undefined;

      map.addListener('click', function() {
        infoDiv.style.display = "none";
        directionsPanel.style.display = "none";
        mapDiv.style.width = "100%";
      });

      // Change the marker icon to default and put marker into markerCluster
      function deindividualizeMarker (marker, markerClusterer) {
        marker.setMap(undefined);
        marker.setIcon(undefined);
        markerClusterer.addMarker(savedParkingMarker);
      }

      selectButton.addEventListener('click', function() {
        $localStorage.setObject('savedParking', selectedParking);

        // Make the saved marker stand out by changing the icon and
        // removing it from markerCluster so it will always show on
        // the map individually
        if (savedParkingMarker) {
          deindividualizeMarker(savedParkingMarker, $scope.markerClusterer);
        }
        savedParkingMarker = selectedParkingMarker;
        $scope.markerClusterer.removeMarker(savedParkingMarker);
        selectedParkingMarker.setIcon("resources/green-marker.png");
        selectedParkingMarker.setMap(map);

        selectButton.style.display = "none";
        cancelButton.style.display = "inline-block";

        // TODO: find a way to reuse updateParkingCard() in ParkingCtrl
        var parkingCard = document.getElementById("parking-card");
        if (parkingCard) {
          var savedParking = $localStorage.getObject('savedParking');
          if (savedParking) {
            parkingCard.innerHTML = savedParking.description;
          }
        }
      });

      cancelButton.addEventListener('click', function() {
        $localStorage.set('savedParking', undefined);

        deindividualizeMarker(savedParkingMarker, $scope.markerClusterer);
        savedParkingMarker = undefined;

        cancelButton.style.display = "none";
        selectButton.style.display = "inline-block";
      });

      removeRouteButton.addEventListener('click', function() {
        directionsDisplay.setMap(undefined);
        directionsPanel.style.display = "none";
        mapDiv.style.width = "100%";
      })

      var directionsDisplay = new google.maps.DirectionsRenderer({
        panel: directionsPanel
      });
      var directionsService = new google.maps.DirectionsService();
      
      routeButton.addEventListener('click', function() {
        directionsDisplay.setMap(map);
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          var request = {
            destination: selectedParking.latLng,
            origin: pos,
            travelMode: google.maps.TravelMode.DRIVING
          };

          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsPanel.style.display = "block";
              infoDiv.style.display = "none";
              // Display the route on the map.
              directionsDisplay.setDirections(response);
            } else {
              // TODO: Display error if we can't get response from directionService
            }
          });
        });
      });

      var clickListener = function(data, marker) {
        mapDiv.style.width = "65%";

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

        infoDiv.style.display = "block";
        selectedParking = data;
        selectedParkingMarker = marker;
      }

      //console.log(response.data);
      var markers = response.data.map(function(data) {
        var coordinates = data.Point.coordinates.split(",");
        data.latLng = {lng: parseFloat(coordinates[0]), lat: parseFloat(coordinates[1])}
        var marker = new google.maps.Marker({
          position: data.latLng
        });
        // TODO: does this work if we change 'mousedown' to 'click'?
        // If yes, we should change to 'click'.
        marker.addListener('mousedown', clickListener.bind(this, data, marker));

        // If the marker is the marker of the already selected parking, then
        // show the accentuated marker instead
        if ($localStorage.getObject('savedParking') &&
          data.id === $localStorage.getObject('savedParking').id) {
          savedParkingMarker = marker;
        }
        return marker;
      });

      if (savedParkingMarker) {
        markers.splice(markers.indexOf(savedParkingMarker), 1);
        savedParkingMarker.setIcon("resources/green-marker.png");
        savedParkingMarker.setMap(map);
      }
    
      var mcOptions = {gridSize: 50, maxZoom: 20};
      $scope.markerClusterer = new MarkerClusterer(map, markers, mcOptions);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
})

.controller('ParkingCtrl', function($localStorage) {
  updateParkingCard = function() {
    var parkingCard = document.getElementById("parking-card");
    var savedParking = $localStorage.getObject('savedParking');
    if (savedParking) {
      parkingCard.innerHTML = savedParking.description;
    }
  }

  updateParkingCard();
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
