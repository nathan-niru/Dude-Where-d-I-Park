describe('localStorage Unit Tests', function(){
  var localStorage;

  beforeEach(function() {
    module('starter.services');

    inject(function (
      _$localStorage_
    ) {
      localStorage = _$localStorage_;
    });
  });

//tests start here
  it('can get an instance of my factory', function() {
    expect(localStorage).toBeDefined();
  });

  it('should insert and retrieve strings', function(){
    localStorage.set("a", "ABC");
    expect(localStorage.get("a")).toEqual("ABC");
  });
});


describe('appSettings Unit Tests', function(){
  var appSettings;

  beforeEach(function() {
    module('starter.services');
    module('Constants');

    inject(function (
      _$appSettings_
    ) {
      appSettings = _$appSettings_;
    });
  });

//tests start here
  it('can get an instance of my factory', function() {
    expect(appSettings).toBeDefined();
  });
});


describe('savedParkingService Unit Tests', function(){
  var savedParkingService;

  beforeEach(function() {
    module('starter.services');

    inject(function (
      _$savedParkingService_
    ) {
      savedParkingService = _$savedParkingService_;
    });
  });

//tests start here
  it('can get an instance of my factory', function() {
    expect(savedParkingService).toBeDefined();
  });
});


describe('parkingCalculationService Unit Tests', function(){
  var parkingCalculationService;

  beforeEach(function() {
    module('starter.services');

    inject(function (
      _$parkingCalculationService_
    ) {
      parkingCalculationService = _$parkingCalculationService_;
    });
  });

//tests start here
  it('can get an instance of my factory', function() {
    expect(parkingCalculationService).toBeDefined();
  });
});


describe('parkingDataService Unit Tests', function(){
  var parkingDataService;

  beforeEach(function() {
    module('starter.services');

    inject(function (
      _$parkingDataService_
    ) {
      parkingDataService = _$parkingDataService_;
    });
  });

//tests start here
  it('can get an instance of my factory', function() {
    expect(parkingDataService).toBeDefined();
  });
});


// TODO: Get cordovaLocalNotification working in tests
// 
// describe('notificationService Unit Tests', function(){
//   var notificationService;

//   beforeEach(function() {
//     module('starter.services');

//     inject(function (
//       _$notificationService_
//     ) {
//       notificationService = _$notificationService_;
//     });
//   });

// //tests start here
//   it('can get an instance of my factory', function() {
//     expect(notificationService).toBeDefined();
//   });
// });