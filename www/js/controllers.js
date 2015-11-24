angular.module('starter.controllers', [])

.controller('MapCtrl', function(
  $scope,
  $localStorage,
  $appSettings,
  $savedParkingService,
  $parkingDataService,
  $parkingCalculationService,
  $notificationService,
  $timeout,
  $interval,
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
  var hideShowMarkersButton = document.getElementById('hide-show-markers-button');

  var savedParkingMarker = undefined;
  var selectedParking = undefined;
  var selectedParkingMeter = undefined;
  var markers = undefined;
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
  });

  cancelButton.addEventListener('click', function() {
    $savedParkingService.clearSavedParking();
    $notificationService.cancelAllNotifications();

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
          enlargeMapAndHidePanels();
          showPanelAndShrinkMap(directionsPanel);
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

  $scope.$root.$on('routeBackToParking', function() {
    directionsDisplay.setMap($scope.map);
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var request = {
        destination: $savedParkingService.getSavedParking().latLng,
        origin: pos,
        travelMode: google.maps.TravelMode.WALKING
      };

      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          enlargeMapAndHidePanels();
          showPanelAndShrinkMap(directionsPanel);
          // Display the route on the map.
          directionsDisplay.setDirections(response);
        } else {
          // TODO: Display error if we can't get response from directionService
        }
      });
    });
  });

  $scope.zoomToLatLng = function (latLng) {
    $scope.map.setCenter(latLng);
    $scope.map.setZoom(Constant.DEFAULT_PARKING_LIST_ZOOM);
  }

  $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    // leave input field if google-address-entry is selected
    angular.element(container).on("click", function(){
        document.getElementById('pac-input').blur();
    });
  };

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

    // Google's reverse geocoder service will throw a quota exception if we
    // request more than five locations at once. To avoid this we queue
    // and add a delay between requests
    var parkingIndex = 0;
    var getAddress = function() {
      var parking = sortedParking[parkingIndex];
      parkingIndex++;
      if (parking.address) {
        return;
      }

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

    $interval(getAddress, 300, sortedParking.length);

    $scope.parkingToDisplayInRows = sortedParking;
    $scope.$apply();

    showPanelAndShrinkMap(parkingListPanel);
  });

  hideShowMarkersButton.addEventListener('click', function() {
    // Hide Markers causes all markers except the selected one (if one exists) to be cleared from map
    if(hideShowMarkersButton.innerHTML == 'Hide Markers') {
      $scope.markerClusterer.clearMarkers();
      if (savedParkingMarker) $scope.markerClusterer.addMarker(savedParkingMarker);
      hideShowMarkersButton.innerHTML = 'Show Markers';
    }
    // Show Markers adds all markers back to the map
    else {
      if (savedParkingMarker) {
        // add all markers
        $scope.markerClusterer.removeMarker(savedParkingMarker);
        $scope.markerClusterer.addMarkers(markers);
        // re-add saved marker so that it shows up outside of the cluster
        $scope.markerClusterer.removeMarker(savedParkingMarker);
        savedParkingMarker.setMap($scope.map);
      }
      else $scope.markerClusterer.addMarkers(markers);
      hideShowMarkersButton.innerHTML = 'Hide Markers';
    }
  });

  var latlng = new google.maps.LatLng(Constant.DEFAULT_LAT, Constant.DEFAULT_LNG);
  var mapOptions = {
      zoom: Constant.DEFAULT_MAP_ZOOM,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
  };
  var mapDiv = document.getElementById("map-div");
  $scope.map = new google.maps.Map(mapDiv, mapOptions);
  var GeoMarker = new GeolocationMarker($scope.map);
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
    document.getElementById('pac-input').blur();
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

    markers = response.map(function(data) {
      var marker = new google.maps.Marker({
        position: data.latLng
      });

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
  
  // resize map when switching to map tab to fix bug where map doesn't load completely` after changing settings
  $scope.$on('$ionicView.enter', function() {
     enlargeMapAndHidePanels();
  })
})

.controller('ParkingCtrl', function(
  $scope,
  $localStorage,
  $savedParkingService,
  $notificationService,
  $timeout,
  $location,
  Constant
) {
  var parkingTimer = new FlipClock($('#parking-timer'), {
    autoStart: false,
    countdown: true
  });

  var expiryInputTimer = undefined;
  updateTimer = function() {
    if (
      !$scope.savedParkingServiceObject.savedParkingObject ||
      !$scope.savedParkingServiceObject.parkingExpiryDateObject ||
      isNaN($scope.savedParkingServiceObject.parkingExpiryDateObject.getTime())
    ) {
      parkingTimer.stop();
      parkingTimer.setTime(0);

      $notificationService.cancelAllNotifications();
      return;
    }

    var timeLeft = ($scope.savedParkingServiceObject.parkingExpiryDateObject - Date.now()) / 1000;
    if (timeLeft <= 0) {
      parkingTimer.stop();
      parkingTimer.setTime(0);

      $notificationService.cancelAllNotifications();
    } else {
      parkingTimer.stop();
      parkingTimer.setTime(timeLeft);
      parkingTimer.start(function() {
        // FlipClock should stop when the countdown hits 0 but for some reason
        // it's not doing it, so just stop it manually
        if (parkingTimer.getTime().getTimeSeconds() < 0) {
          parkingTimer.stop();
          parkingTimer.setTime(0);
        };
      });

      // Call notificationServive once the user stops altering the timer
      if (expiryInputTimer) {
        $timeout.cancel(expiryInputTimer);
      }
      expiryInputTimer = $timeout(
        function() {
          $notificationService.scheduleNotification($scope.savedParkingServiceObject.parkingExpiryDateObject);
        },
        Constant.EXPIRY_INPUT_TIMEOUT
      );
    }
  }

  $scope.savedParkingServiceObject = $savedParkingService;
  $scope.$watch('savedParkingServiceObject.savedParkingObject', function() {
    var parkingCard = document.getElementById("parking-card");

    if (!$savedParkingService.getSavedParking()) {
      parkingCard.innerHTML = "";
      updateTimer();
      return;
    }

    parkingCard.innerHTML = $savedParkingService.getSavedParking().description;

    // If we have a parking space saved but no expiry time yet, then default
    // the expiry time to the current time
    if (!$savedParkingService.getExpiryDateTime()) {
      var currentDateTime = new Date();
      currentDateTime.setMilliseconds(0);
      $savedParkingService.setExpiryDateTime(currentDateTime);
    }

    updateTimer();
  });

  $scope.updateParkingExpiryTime = function() {
    // Restrict the maximum parking time to 99 hours 59 minutes 59 seconds
    // so the countdown UI doesn't break
    var currentTime = Date.now();
    var newInputDateTime = $scope.savedParkingServiceObject.parkingExpiryDateObject;
    if (!newInputDateTime) {
      return;
    }

    if (newInputDateTime - currentTime > Constant.MAXIMUM_TIMER_MILLISECONDS) {
      newInputDateTime = new Date(
        currentTime + Constant.MAXIMUM_TIMER_MILLISECONDS
      );
      newInputDateTime.setMilliseconds(0); // Remove milliseconds
    }

    $savedParkingService.setExpiryDateTime(newInputDateTime);
  }

  $scope.routeBackToParking = function() {
    $scope.$root.$emit('routeBackToParking');
    $location.path("");
  }
})

.controller('SettingsCtrl', function($scope, $localStorage, $appSettings, Constant) {
  $scope.updateSearchZoom = function() {
    $appSettings.setSearchZoom($scope.searchZoom);
    $scope.searchZoom = $appSettings.getSearchZoom();
  }

  $scope.searchZoom = $appSettings.getSearchZoom();
  $scope.updateSearchZoom();

  $scope.updateNotificationReminderTime = function() {
    $appSettings.setNotificationReminderMinutes($scope.notificationReminderMinutes);
    $scope.notificationReminderMinutes = $appSettings.getNotificationReminderMinutes();
  };
  $scope.notificationReminderMinutes = $appSettings.getNotificationReminderMinutes();
  $scope.updateNotificationReminderTime();

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
