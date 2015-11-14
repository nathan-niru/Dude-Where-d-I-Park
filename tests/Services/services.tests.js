describe('localStorage Unit Tests', function(){
  var localStorage;

  beforeEach(function() {
    // load the controller's modules
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