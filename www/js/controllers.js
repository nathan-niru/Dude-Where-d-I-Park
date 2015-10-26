angular.module('starter.controllers', [])

.controller('MapCtrl', function(
  $scope, 
  $http, 
  $localStorage, 
  $appSettings, 
  $savedParkingService, 
  $parkingDataService, 
  $parkingCalculationService,
  $timeout,
  Constant
) {
  //TODO: Separate the functionalities below into different components
  var infoPanel = document.getElementById("info-panel");
  var directionsPanel = document.getElementById('directions-panel');
  var parkingListPanel = document.getElementById('parking-list-panel');
  var infoText = document.getElementById("info-text");
  var selectButton = document.getElementById("select-button");
  var cancelButton = document.getElementById("cancel-button");
  var routeButton = document.getElementById("route-button");
  var hideInfoPanelButton = document.getElementById("hide-info-panel-button");
  var clearRouteButton = document.getElementById('clear-route-button');
  var cheapestParkingButton = document.getElementById('cheapest-parking-button');

  var savedParkingMarker = undefined;
  var selectedParking = undefined;
  var selectedParkingMeter = undefined;
  $scope.parkingToDisplayInRows = [];

  var directionsDisplay = new google.maps.DirectionsRenderer({
    panel: directionsPanel
  });
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder();

  function showPanelAndShrinkMap (panel) {
    mapDiv.style.width = "65%";
    panel.style.display = "block";
    google.maps.event.trigger($scope.map, "resize");
  }

  function enlargeMapAndHidePanels () {
    infoPanel.style.display = "none";
    directionsPanel.style.display = "none";
    parkingListPanel.style.display = "none";
    mapDiv.style.width = "100%";
    google.maps.event.trigger($scope.map, "resize");
  }

  // Change the marker icon to default and put marker into markerCluster
  function deindividualizeMarker (marker, markerClusterer) {
    marker.setMap(undefined);
    marker.setIcon(undefined);
    markerClusterer.addMarker(savedParkingMarker);
  }

  selectButton.addEventListener('click', function() {
    $savedParkingService.setSavedParking(selectedParking);

    // Make the saved marker stand out by changing the icon and
    // removing it from markerCluster so it will always show on
    // the map individually
    if (savedParkingMarker) {
      deindividualizeMarker(savedParkingMarker, $scope.markerClusterer);
    }
    savedParkingMarker = selectedParkingMarker;
    $scope.markerClusterer.removeMarker(savedParkingMarker);
    selectedParkingMarker.setIcon("resources/green-marker.png");
    selectedParkingMarker.setMap($scope.map);

    selectButton.style.display = "none";
    cancelButton.style.display = "inline-block";

    // TODO: find a way to reuse updateParkingCard() in ParkingCtrl
    var parkingCard = document.getElementById("parking-card");
    if (parkingCard) {
      var savedParking = $savedParkingService.getSavedParking();
      if (savedParking) {
        parkingCard.innerHTML = savedParking.description;
      }
    }
  });

  cancelButton.addEventListener('click', function() {
    $savedParkingService.clearSavedParking();

    deindividualizeMarker(savedParkingMarker, $scope.markerClusterer);
    savedParkingMarker = undefined;

    cancelButton.style.display = "none";
    selectButton.style.display = "inline-block";
  });

  routeButton.addEventListener('click', function() {
    directionsDisplay.setMap($scope.map);
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
          infoPanel.style.display = "none";
          // Display the route on the map.
          directionsDisplay.setDirections(response);
        } else {
          // TODO: Display error if we can't get response from directionService
        }
      });
    });
  });

  clearRouteButton.addEventListener('click', function() {
    directionsDisplay.setMap(undefined);
    enlargeMapAndHidePanels();
  });

  hideInfoPanelButton.addEventListener('click', function() {
    enlargeMapAndHidePanels();
  });

  $scope.zoomToLatLng = function (latLng) {
    $scope.map.setCenter(latLng);
    $scope.map.setZoom(Constant.DEFAULT_PARKING_LIST_ZOOM);
  }

  cheapestParkingButton.addEventListener('click', function() {
    // First make the map width 100% to restore map bounds
    enlargeMapAndHidePanels();

    var parkingInMapBounds = $parkingCalculationService.getParkingInMapBounds(
      $scope.map, 
      $scope.parkingData
    );
    var sortedParking = $parkingCalculationService.sortByCheapestParking(
      parkingInMapBounds,
      Constant.MAXIMUM_CHEAPEST_PARKING
    );

    sortedParking.forEach(function(parking) {
      if (!parking.address) {
        // Google's reverse geocoder service will throw a quota exception if we
        // request more than five locations at once
        var getAddress = function() {
          geocoder.geocode({'location': parking.latLng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              parking.address = results[0].formatted_address;
              $scope.$apply();
            } else {
              // if the first time fails try one more time
              $timeout(function() {
                geocoder.geocode({'location': parking.latLng}, function(results, status) {
                  if (status === google.maps.GeocoderStatus.OK) {
                    parking.address = results[0].formatted_address;
                    $scope.$apply();
                  } else {
                    parking.address = Constant.ADDRESS_NOT_FOUND_ERROR;
                  }
                });
              }, 2000);
            }
          });
        }

        $timeout(getAddress, 2000);
      }
    });
  
    $scope.parkingToDisplayInRows = sortedParking;
    $scope.$apply();

    showPanelAndShrinkMap(parkingListPanel);
  });

  var latlng = new google.maps.LatLng(Constant.DEFAULT_LAT, Constant.DEFAULT_LNG);
  var mapOptions = {
      zoom: Constant.DEFAULT_MAP_ZOOM,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var mapDiv = document.getElementById("map-div");
  $scope.map = new google.maps.Map(mapDiv, mapOptions);
  if (!$savedParkingService.getSavedParking()) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.map.setCenter(pos);
    });
  }

  // Create the search box and link it to the UI element.
  var searchInput = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(searchInput);
  $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);

  // Bias the SearchBox results towards current map's viewport.
  $scope.map.addListener('bounds_changed', function() {
    searchInput.style.display = "block";
    searchBox.setBounds($scope.map.getBounds());
  });

  $scope.map.addListener('click', function() {
    enlargeMapAndHidePanels();
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
        map: $scope.map,
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
      $scope.map.setCenter(searchMarkers[0].position);
      $scope.map.setZoom($appSettings.getSearchZoom());
    } else {
      $scope.map.fitBounds(bounds);
    }
  });

  $parkingDataService.getParkingDataAsync().then(function successCallback(response) {
    $scope.parkingData = response;

    var clickListener = function(data, marker) {
      enlargeMapAndHidePanels();
      // If there's a <br> in the beginning of the description then get
      // get rid of it since its taking up space
      var descriptionHTML = data.description;
      var breakLineString = "<br>";
      if (data.description.slice(0, breakLineString.length) === breakLineString) {
        descriptionHTML = data.description.slice(breakLineString.length);
      }

      //TODO: parse description to display meaningful text
      infoText.innerHTML = descriptionHTML;
      var savedParking = $savedParkingService.getSavedParking();
      if (savedParking) {
        if (data.id === savedParking.id) {
          selectButton.style.display = "none";
          cancelButton.style.display = "inline-block";
        } else {
          cancelButton.style.display = "none";
          selectButton.style.display = "inline-block";
        }
      }

      showPanelAndShrinkMap(infoPanel);
      selectedParking = data;
      selectedParkingMarker = marker;
    }

    //console.log(response);
    var markers = response.map(function(data) {
      var marker = new google.maps.Marker({
        position: data.latLng
      });
      // TODO: does this work if we change 'mousedown' to 'click'?
      // If yes, we should change to 'click'.
      marker.addListener('click', clickListener.bind(this, data, marker));

      // If the marker is the marker of the already selected parking, then
      // show the accentuated marker instead
      if ($savedParkingService.getSavedParking() &&
        data.id === $savedParkingService.getSavedParking().id) {
        savedParkingMarker = marker;
      }
      return marker;
    });

    if (savedParkingMarker) {
      markers.splice(markers.indexOf(savedParkingMarker), 1);
      savedParkingMarker.setIcon("resources/green-marker.png");
      savedParkingMarker.setMap($scope.map);
      $scope.map.setCenter(savedParkingMarker.position);
      $scope.map.setZoom($appSettings.getSearchZoom());
    }
  
    var mcOptions = {gridSize: 50, maxZoom: 20};
    $scope.markerClusterer = new MarkerClusterer($scope.map, markers, mcOptions);
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
})

.controller('ParkingCtrl', function($localStorage, $savedParkingService) {
  updateParkingCard = function() {
    var parkingCard = document.getElementById("parking-card");
    var savedParking = $savedParkingService.getSavedParking();
    if (savedParking) {
      parkingCard.innerHTML = savedParking.description;
    }
  }

  updateParkingCard();
})

.controller('SettingsCtrl', function($scope, $localStorage, Constant) {
  $scope.updateSearchZoom = function() {
    $localStorage.set('searchZoom', $scope.searchZoom);
  };

  $scope.searchZoom = Number($localStorage.get('searchZoom'));
  if (isNaN($scope.searchZoom)) {
    $scope.searchZoom = Constant.DEFAULT_SEARCH_ZOOM;
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
