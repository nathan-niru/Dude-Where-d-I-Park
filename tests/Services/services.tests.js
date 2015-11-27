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
    expect(appSettings.setSearchZoom()).toEqual(console.log("value must be great than 0"));
  });
    
      it('should throw an error for negative input when setting Search Zoom', function() {
    appSettings.setNotificationReminderMinutes(-1);
    expect(appSettings.setSearchZoom()).toEqual(console.log("Search Zoom is a negative input"));
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
     expect(appSettings.setNotificationReminderMinutes(0)).toEqual(console.log("value must be great than 0"));
  });
    
      it('should throw an error for negative input when setting Notfication Reminder', function() {
    expect(appSettings.setNotificationReminderMinutes(-1)).toEqual(console.log("Notification Reminder must be great than 0"));
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

  // create test parking object
  var testParkingObject = {"id":7707,"name":50961,"latLng":{"lng":-123.115853678942,"lat":49.2499808201747},"timeLimit":"2 Hr","rate":1,"description":"<br>Meter Head Type: Twin<br>Time Limit: 2 Hr<br>Rate: $1.00<br>Credit Card Enabled: CREDIT_CARD<br>Time in Effect: METER IN EFFECT: 9:00 AM TO 10:00 PM<br>Pay by Phone Number: 50961"};

  it('setSavedParking and getSavedParking test', function() {
    // initially there should be no saved parking
    expect(savedParkingService.getSavedParking()).not.toBeDefined;
    // create a test parking object and save it
    savedParkingService.setSavedParking(testParkingObject);
    expect(savedParkingService.getSavedParking()).toEqual(testParkingObject);
    // replace old saved parking with a new one
    var testParkingObject2 = {"id":2178,"name":66755,"latLng":{"lng":-123.119189551142,"lat":49.2791281700076},"timeLimit":"2 Hr","rate":2.5,"description":"<br>Meter Head Type: Single<br>Time Limit: 2 Hr<br>Rate: $2.50<br>Credit Card Enabled: CREDIT_CARD<br>Time in Effect: METER IN EFFECT: 9:00 AM TO 10:00 PM<br>Pay by Phone Number: 66755"};
    savedParkingService.setSavedParking(testParkingObject2);
    expect(savedParkingService.getSavedParking()).toEqual(testParkingObject2);
  });

  it('clearSavedParking test', function() {
    // save parking
    savedParkingService.setSavedParking(testParkingObject);
    expect(savedParkingService.getSavedParking()).toBeDefined();
    // clear saved parking and check that saved parking is now undefined
    savedParkingService.clearSavedParking();
    expect(savedParkingService.getSavedParking()).not.toBeDefined();
  });

  it('setExpiryDateTime and getExpiryDateTime test', function() {
    // no saved parking, expiry datetime should be undefined
    expect(savedParkingService.getExpiryDateTime()).not.toBeDefined();
    // save parking and then set expiry datetime
    savedParkingService.setSavedParking(testParkingObject);
    var date = new Date();
    savedParkingService.setExpiryDateTime(date);
    // check that expiry date has been set correctly
    expect(new Date(savedParkingService.getExpiryDateTime())).toEqual(date)
    // changing the saved parking should clear the expiry date
    savedParkingService.clearSavedParking();
    expect(savedParkingService.getExpiryDateTime()).not.toBeDefined();
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
//
//   beforeEach(function() {
//     module('starter.services');
//
//     inject(function (
//       _$notificationService_
//     ) {
//       notificationService = _$notificationService_;
//     });
//   });
//
// //tests start here
//   it('can get an instance of my factory', function() {
//     expect(notificationService).toBeDefined();
//   });
// });
