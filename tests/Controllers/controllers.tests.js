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

  // tests start here
  it('should have vibrate true', function(){
    expect($scope.vibrate).toEqual(true);
  });
});

