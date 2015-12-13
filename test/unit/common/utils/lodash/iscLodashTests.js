(function () {
  'use strict';
  //console.log( 'iscRadio Tests' );

  describe('iscLodash', function () {

    describe('_.isPresent()', function () {
      it('should return false if value == null or undefined', function () {
        expect(_.isPresent(null)).toBe(false);
        expect(_.isPresent(undefined)).toBe(false);
      });

      it('should return true if value is not null and undefined', function () {
        expect(_.isPresent(0)).toBe(true);
        expect(_.isPresent(1)).toBe(true);
        expect(_.isPresent("0")).toBe(true);
        expect(_.isPresent("1")).toBe(true);
        expect(_.isPresent(false)).toBe(true);
        expect(_.isPresent(true)).toBe(true);
        expect(_.isPresent({})).toBe(true);
        expect(_.isPresent([])).toBe(true);
        expect(_.isPresent(NaN)).toBe(true);
      });
    });
    describe('_.isNotPresent()', function () {
      it('should return true if value == null or undefined', function () {
        expect(_.isNotPresent(null)).toBe(true);
        expect(_.isNotPresent(undefined)).toBe(true);
      });

      it('should return false if value is not null and undefined', function () {
        expect(_.isNotPresent(0)).toBe(false);
        expect(_.isNotPresent(1)).toBe(false);
        expect(_.isNotPresent("0")).toBe(false);
        expect(_.isNotPresent("1")).toBe(false);
        expect(_.isNotPresent(true)).toBe(false);
        expect(_.isNotPresent(false)).toBe(false);
        expect(_.isNotPresent({})).toBe(false);
        expect(_.isNotPresent([])).toBe(false);
        expect(_.isNotPresent(NaN)).toBe(false);
      });
    });

    describe("_.getAge()", function () {
      it('should return 0 if today', function () {
        var today = moment().toString();
        expect(_.getAge(today)).toBe(0);
      });

      it('should return 1 if today', function () {
        var lastYear = moment().subtract(1, 'year').toString();
        expect(_.getAge(lastYear)).toBe(1);
      });

      it('should return NaN for non-supported format', function () {
        var format = 'YYYY.MM.DD';
        var date   = moment().format(format);

        expect(_.getAge(date)).toEqual(NaN);
      });

      it('should accept date format', function () {
        var format = 'YYYY.MM.DD';
        var date   = moment().format(format);

        expect(_.getAge(date, format)).toEqual(0);
      });
    });

    describe('_.areSameDate()', function () {
      var oneAm = new Date('2012/1/1 01:01:01AM');
      var tenAm = new Date('2012/1/1 10:01:01AM');
      it('should not treat date1 and date2 the same', function () {
        expect(oneAm).not.toEqual(tenAm);
      });

      it('should return true for same dates', function () {
        expect(_.areSameDate(oneAm, tenAm)).toBe(true);
      });

      it('should return true when comparing milliseconds and date object', function () {
        var msOneAm = +oneAm;
        expect(_.areSameDate(msOneAm, tenAm)).toBe(true);
      });

      it('should return false for different dates', function () {
        expect(_.areSameDate(oneAm, new Date('2011/1/1/ 01:01:01AM'))).toBe(false);
      });

      it('should return false for non-dates', function () {
        expect(_.areSameDate("i'm a string", oneAm)).toBe(false);
        expect(_.areSameDate("i'm a string", null)).toBe(false);
        expect(_.areSameDate(12345, oneAm)).toBe(false);
        expect(_.areSameDate(false, oneAm)).toBe(false);
        expect(_.areSameDate({}, oneAm)).toBe(false);
        expect(_.areSameDate([], oneAm)).toBe(false);
        expect(_.areSameDate(NaN, oneAm)).toBe(false);
      });
    });

    describe('_.isTypeOf()', function () {

      it('should return true: null = "null"', function () {
        //phantomjs returns the wrong value when testing against null.
        // this is the real value:
        //Object.prototype.toString.call(null)
        //"[object Null]"
      });

      it('should return true: {} = "object"', function () {
        expect(_.isTypeOf({}, "object")).toBe(true);
      });

      it('should return true: [] = "array"', function () {
        expect(_.isTypeOf([], "array")).toBe(true);
      });

      it('should return true: function(){} = "function"', function () {
        var func = function () {
        };
        expect(_.isTypeOf(func, "function")).toBe(true);
      });

      it('should return true: DocFrag = "DocumentFragment"', function () {
        var documentFrag = document.createDocumentFragment('div');
        expect(_.isTypeOf(documentFrag, "DocumentFragment")).toBe(true);
      });
    });

    describe('_.nullifyObj()', function () {

      it('should nullify existing properties', function () {
        var foo = { age: 5 };
        _.nullifyObj(foo);
        expect(foo.age).toBe(null);
      });

      it('should modify the origina object', function () {
        var foo = { age: 5 };
        _.nullifyObj(foo);
        expect(foo.age).toBe(null);
      });

      it('should not nullify prototype properties', function () {
        var proto = { age: 5 };
        var foo   = Object.create(proto);
        foo.name  = "isOwn";

        _.nullifyObj(foo);
        expect(foo.name).toBe(null);
        expect(foo.age).toBe(5);
      });

      it('should not modify non-objects', function () {
        var arr  = [];
        arr.name = 'array';
        expect(arr.name).toBe('array');
        _.nullifyObj(arr);
        expect(arr.name).toBe('array');
      });

    });

    describe('_.get() advanced', function () {
      var patient = { addresses: [{ code: 0, address: "111" }, { code: "1", address: "222" }], name: { first: "John", last: "doe" } };

      it('should behaves the same as original implementation', function () {
        var value = _.get(patient, "name.first");
        expect(value).toBe("John");

        value = _.get(patient, "addresses[0].address");
        expect(value).toBe("111");

        value = _.get(patient, "addresses[1].address");
        expect(value).toBe("222");
      });

      it('should able to filter arrays', function () {
        var address = _.get(patient, "addresses[{code:0}].address");
        expect(address).toBe("111");
      });

      it('should able to filter arrays by string', function () {
        var address = _.get(patient, "addresses[{code:\"1\"}].address");
        expect(address).toBe("222");
      });

      it('should does not filtering by single quote', function () {
        var hasError = false;
        try {
          _.get(patient, "addresses[{code:'1'}].address");
        } catch ( exp ) {
          hasError = true;
        }

        expect(hasError).toBe(true);
      });

    });
  });
})();

