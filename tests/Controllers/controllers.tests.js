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
      appSettings = $appSettings
      
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

