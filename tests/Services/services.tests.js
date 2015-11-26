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

//localStorage tests start here
  it('can get an instance of my factory', function() {
    expect(localStorage).toBeDefined();
  });

  it('should insert and retrieve strings', function(){
    localStorage.set("a", "ABC");
    expect(localStorage.get("a")).toEqual("ABC");
  });
    
// localStorage test end here    

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

//appSettings tests start here
  it('can get an instance of my factory', function() {
    expect(appSettings).toBeDefined();
  });
    
  it('should set and get the Zoom integers', function() {
    appSettings.setSearchZoom(1);
    expect(appSettings.getSearchZoom()).toEqual(1);
  });
    
    it('should set and get the Zoom integers', function() {
    appSettings.setSearchZoom(1);
    expect(appSettings.getSearchZoom()).toEqual(1);
  });
    
    it('should throw an error for 0 input when setting Search Zoom', function() {
    appSettings.setNotificationReminderMinutes(0);
    expect(appSettings.getNotificationReminderMinutes()).toEqual(console.log("value must be great than 0"));
  });
    
      it('should throw an error for negative input when setting Search Zoom', function() {
    appSettings.setNotificationReminderMinutes(-1);
    expect(appSettings.getNotificationReminderMinutes()).toEqual(console.log("Search Zoom is a negative input"));
  });
    
    it('should set and get Notificaiton Reminder Integer', function() {
    appSettings.setNotificationReminderMinutes(5);
    expect(appSettings.getNotificationReminderMinutes()).toEqual(5);
  });
    
    it('should set and get Notificaiton Reminder Lower Bounds ', function() {
    appSettings.setNotificationReminderMinutes(1);
    expect(appSettings.getNotificationReminderMinutes()).toEqual(1);
  });
    
    it('should set and get Notificaiton Reminder Upper Bounds', function() {
    appSettings.setNotificationReminderMinutes(10);
    expect(appSettings.getNotificationReminderMinutes()).toEqual(10);
  });
    
     it('should throw an error for 0 input when setting Notfication Reminder', function() {
    appSettings.setNotificationReminderMinutes(0);
    expect(appSettings.getNotificationReminderMinutes()).toEqual(console.log("value must be great than 0"));
  });
    
      it('should throw an error for negative input when setting Notfication Reminder', function() {
    appSettings.setNotificationReminderMinutes(-1);
    expect(appSettings.getNotificationReminderMinutes()).toEqual(console.log("Notification Reminder is a negative input"));
  });
    
//appSettings tests end here
    
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

//SavedParkingServices tests start here
  it('can get an instance of my factory', function() {
    expect(savedParkingService).toBeDefined();
  });
    

    

 //SavedParkingServices tests end here
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
