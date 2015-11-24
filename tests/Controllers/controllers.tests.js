// describe('MapController', function(){
//   var $scope,
//       localStorage,
//       appSettings,
//       savedParkingService,
//       parkingDataService,
//       parkingCalculationService,
//       notificationService,
//       timeout,
//       interval;

//   beforeEach(function() {
//     // load the controller's modules
//     module('starter.controllers');
//     module('starter.services');
//     module('Constants');

//     inject(function(
//       $rootScope,
//       $controller,
//       $localStorage,
//       $appSettings,
//       $savedParkingService,
//       $parkingDataService,
//       $parkingCalculationService,
//       $notificationService,
//       $timeout,
//       $interval
//     ) {
//       $scope = $rootScope;
//       localStorage = $localStorage;
//       appSettings = $appSettings;
//       savedParkingService = $savedParkingService;
//       parkingDataService = $parkingDataService;
//       parkingCalculationService = $parkingCalculationService;
//       notificationService = $notificationService;
//       timeout = $timeout;
//       interval = $interval;
      
//       // create controller
//       $controller('ParkingCtrl', {
//         $scope: $scope,
//         $localStorage: localStorage,
//         $appSettings: appSettings,
//         $savedParkingService: savedParkingService,
//         $parkingDataService: parkingDataService,
//         $parkingCalculationService: parkingCalculationService,
//         $notificationService: notificationService,
//         $timeout: timeout,
//         $interval: interval
//       });
//     });
//   });

//   // tests start here
//   it('should have vibrate true', function(){
//     expect(true).toEqual(true);
//   });
// });


// describe('ParkingController', function(){
//   var $scope,
//       localStorage,
//       savedParkingService,
//       notificationService,
//       timeout;

//   beforeEach(function() {
//     // load the controller's modules
//     module('starter.controllers');
//     module('starter.services');
//     module('Constants');

//     inject(function(
//       $rootScope,
//       $controller,
//       $localStorage,
//       $savedParkingService,
//       $notificationService,
//       $timeout
//     ) {
//       $scope = $rootScope;
//       localStorage = $localStorage;
//       savedParkingService = $savedParkingService;
//       notificationService = $notificationService;
//       timeout = $timeout;
      
//       // create controller
//       $controller('ParkingCtrl', {
//         $scope: $scope,
//         $localStorage: localStorage,
//         $savedParkingService: savedParkingService,
//         $notificationService: notificationService,
//         $timeout: timeout
//       });
//     });
//   });

//   // tests start here
//   it('should have vibrate true', function(){
//     expect(true).toEqual(true);
//   });
// });


describe('SettingsController', function(){
  var $scope,
      localStorage,
      appSettings;

  beforeEach(function() {
    // load the controller's modules
    module('starter.controllers');
    module('starter.services');
    module('Constants');

    inject(function(
      $rootScope,
      $controller,
      $localStorage,
      $appSettings
    ) {
      $scope = $rootScope;
      localStorage = $localStorage;
      appSettings = $appSettings;
      
      // create controller
      $controller('SettingsCtrl', {
        $scope: $scope,
        $localStorage: localStorage,
        $appSettings: appSettings
      });
    });
  });

    //TEST for Vibration settings
  // tests start here
  it('should have vibrate true', function(){
    expect($scope.vibrate).toEqual(true);
  });
    
    // tests start here
  it('should have vibrate change to false', function(){
    expect(localStorage.get('vibrate')) == true;
    $scope.vibrate = false;
    $scope.updateVibrate();
    expect(localStorage.get('vibrate')) == false;
  });
    
    //TEST for Sound settings
    // tests start here
  it('should have sound set to true', function(){
    expect($scope.sound).toEqual(true);
  });
    
     // tests start here
  it('should change the sound setting', function(){
    expect(localStorage.get('sound')) == true;
    $scope.sound = false;
    $scope.updateSound();
    expect(localStorage.get('sound')) == false;
  });
    
    // Test for Setting Notfication Feature
    // tests start here
  it('should have notification default time set to 15 minutes', function(){
    expect(appSettings.getNotificationReminderMinutes()).toEqual(15);
  });
    
    // tests start here
  it('should test the notification default time can change to 10 minutes', function(){
    expect(appSettings.getNotificationReminderMinutes()).toEqual(15);
    $scope.notificationReminderMinutes = 10;
    $scope.updateNotificationReminderTime();
     expect(appSettings.getNotificationReminderMinutes()).toEqual(10);
  });
    
    
      // tests start here
  it('should test the notification bounds at 1', function(){
    expect(appSettings.getNotificationReminderMinutes()).toEqual($scope.notificationReminderMinutes);
    $scope.notificationReminderMinutes = 1;
    $scope.updateNotificationReminderTime();
     expect(appSettings.getNotificationReminderMinutes()).toEqual(1);
  });
    
    
      // tests start here
  it('should test the notification bounds at 100', function(){
    expect(appSettings.getNotificationReminderMinutes()).toEqual($scope.notificationReminderMinutes);
    $scope.notificationReminderMinutes = 100;
    $scope.updateNotificationReminderTime();
     expect(appSettings.getNotificationReminderMinutes()).toEqual(100);
  });
    
    

    // Test for Zoom Feature
    // tests start here
  it('should have default zoom of 18', function(){
    expect(appSettings.getSearchZoom()).toEqual(18);
  });
    
    // tests start here
  it('should have change the default zoom to 15', function(){
    expect(appSettings.getSearchZoom()).toEqual(18);
    $scope.searchZoom = 15;
    $scope.updateSearchZoom();
    expect(appSettings.getSearchZoom()).toEqual(15);
  });
    
    // tests start here
  it('should test the bound of the default zoom at 1', function(){
    expect(appSettings.getSearchZoom()).toEqual($scope.searchZoom);
    $scope.searchZoom = 1;
    $scope.updateSearchZoom();
    expect(appSettings.getSearchZoom()).toEqual(1);
  }); 

    // tests start here
    it('should have change the default zoom to 0', function(){
    expect(appSettings.getSearchZoom()).toEqual($scope.searchZoom);
    $scope.searchZoom = 100;
    $scope.updateSearchZoom();
    expect(appSettings.getSearchZoom()).toEqual(100);
  });
    
});

