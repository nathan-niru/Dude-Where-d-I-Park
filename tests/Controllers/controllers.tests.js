describe('SettingsController', function(){
    var scope,
        localStorage;

    // load the controller's modules
    beforeEach(module('starter.controllers'));
    beforeEach(module('starter.services'));
    beforeEach(module('Constants'));

    beforeEach(inject(function($rootScope, $controller, $localStorage, $appSettings) {
        scope = $rootScope;
        $controller('SettingsCtrl', {$scope: scope});
    }));

    // tests start here
    it('should have vibrate true', function(){
        expect(scope.vibrate).toEqual(true);
    });
});

