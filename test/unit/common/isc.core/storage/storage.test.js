(function () {
  'use strict';

  describe('storage', function () {
    var $window;
    var storage;
    var mockConfig;

    // show $log statements
    beforeEach(module(function ($provide) {
      $provide.value('$log', mock$log);
    }));

    beforeEach(module('isc.core', function () {
      mockConfig = angular.copy(customConfig);
    }));

    beforeEach(inject(function (_storage_, _$window_) {
      $window = _$window_;
      storage = _storage_;
      $window.localStorage.clear();
    }));

    describe('sanity', function () {
      it('sanity check', function () {
        expect(storage).toBeDefined();
        expect(storage.get).toBeDefined();
        expect(storage.set).toBeDefined();
        expect(storage.remove).toBeDefined();
      });
    });

    describe("storage.set method", function () {
      it('should save data to localStorage', function () {
        spyOn($window.localStorage, 'setItem');

        var data = {age: 5};
        storage.set("key", data);

        expect($window.localStorage.setItem).toHaveBeenCalled();
      });

      it('should accept params with key and value', function () {
        storage.set("key", {age: 5});

        var stored = $window.localStorage.getItem('key');
        expect(stored).toBe('{"age":5}');
      });

      it('should be able to save nested properties by accepting parameters with key, path, and value', function () {
        storage.set("key", "name", {first: 'angular'});

        var stored = $window.localStorage.getItem('key');
        expect(stored).toBe('{"name":{"first":"angular"}}');
      });
    });
    describe("storage.get method", function () {
      it('should get data from localStorage', function () {
        spyOn($window.localStorage, 'getItem');

        storage.get("key");

        expect($window.localStorage.getItem).toHaveBeenCalled();
      });

      it('should accept params with key', function () {
        $window.localStorage.setItem('key', '{"age":5}');

        var stored = storage.get("key");

        expect(stored).toEqual({"age": 5});
      });

      it('should be able nested properties by accepting 2 parameters: key and path', function () {
        $window.localStorage.setItem("key", '{"name":{"first":"angular"}}');

        var stored = storage.get('key', 'name');
        expect(stored).toEqual({first: 'angular'});
      });

      it('should return null if storage key is undefined', function () {
        var stored = storage.get('key');
        expect(stored).toBeUndefined();
      });

      it('should return null if storage nested key is undefined', function () {
        var stored = storage.get('key', 'name');
        expect(stored).toBeUndefined();
      });
    });

    describe("storage.remove method", function () {
      it('should get data from localStorage', function () {
        spyOn($window.localStorage, 'removeItem');

        storage.remove("key");

        expect($window.localStorage.removeItem).toHaveBeenCalled();
      });

      it('should accept params with key', function () {
        $window.localStorage.setItem('key', '{"age":5}');

        storage.remove("key");
        var stored = storage.get("key");
        expect(stored).toBeUndefined();
      });
    });


    describe("storage.clear method", function () {
      it('should invoke localstorage.clear method', function () {
        spyOn($window.localStorage, 'clear');

        storage.clear();

        expect($window.localStorage.clear).toHaveBeenCalled();
      });

      it('should clear entries', function () {
        $window.localStorage.setItem('key', '{"age":5}');
        $window.localStorage.setItem('key2', '{"age":5}');

        storage.clear();
        var stored = storage.get("key");
        var stored2 = storage.get("key2");

        expect(stored).toBeUndefined();
        expect(stored2).toBeUndefined();
      });
    });
  });
})();
