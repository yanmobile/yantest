(function () {
  'use strict';
  //console.log( 'iscRadio Tests' );

  describe('iscLodash', function () {
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

      it('should return false when the comparison type is not string', function () {
        expect(_.isTypeOf({}, 1)).toBe(false);
        expect(_.isTypeOf({}, new Date())).toBe(false);
        expect(_.isTypeOf({}, /./)).toBe(false);  //regex
        expect(_.isTypeOf({}, false)).toBe(false);
        expect(_.isTypeOf({}, true)).toBe(false);
        expect(_.isTypeOf({}, NaN)).toBe(false);
        expect(_.isTypeOf({}, null)).toBe(false);
        expect(_.isTypeOf({}, _.noop)).toBe(false); //func
        expect(_.isTypeOf({}, {})).toBe(false);
      });

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

    describe('_.makeObj()', function () {
      it('should make a single property object when key/value is passed in', function () {
        var obj = _.makeObj('age', 20);
        expect(obj).toEqual({ age: 20 });
      });
    });

    describe('_.wrapText()', function () {
      it('should wrap value in quotes', function () {
        var text = _.wrapText(0);
        expect(text).toEqual('"0"');

        text = _.wrapText(null);
        expect(text).toEqual('"null"');

        text = _.wrapText(undefined);
        expect(text).toEqual('"undefined"');

        text = _.wrapText({});
        expect(text).toEqual('"[object Object]"');

        text = _.wrapText([1, 2, 3]);
        expect(text).toEqual('"1,2,3"');

      });

      it('should be able to wrap text values', function () {
        var text = _.wrapText("1");
        expect(text).toEqual('"1"');
      });

      it('should be able to use different wrap text', function () {
        var text = _.wrapText(2, "||");
        expect(text).toEqual('||2||');
      });

      it('should be able to use different wrap text', function () {
        var text = _.wrapText(2, "||");
        expect(text).toEqual('||2||');
      });

    });

    describe('_.interpolate()', function () {
      it('should interpolate accept an array', function () {
        var text = _.interpolate("I am {0}", [5]);
        expect(text).toBe("I am 5");
      });

      it('should interpolate accept object param', function () {
        var text = _.interpolate("I am {age}", { age: 5 });
        expect(text).toBe("I am 5");
      });

      it('should be able to interpolate multiple strings', function () {
        var text = _.interpolate("I am {0}, but I am like a {1} year old.", [85, 20]);
        expect(text).toBe("I am 85, but I am like a 20 year old.");
      });

      it('should interpolate accept object param', function () {
        var text = _.interpolate("I am {realAge}, but I am like a {feelLikeAge} year old.", { realAge: 85, feelLikeAge: 20 });
        expect(text).toBe("I am 85, but I am like a 20 year old.");
      });
    });

    describe("primitive and their Object types", function () {
      it('should treat 5 and Number(5) the same', function () {
        var primitive = _.isTypeOf(5, "Number");
        var object    = _.isTypeOf(Number(5), "Number");

        expect(primitive).toBe(object);
      });

      it('should treat "hello" and String("hello") the same', function () {
        var primitive = _.isTypeOf("Hello", "String");
        var object    = _.isTypeOf(String("Hello"), "String");

        expect(primitive).toBe(object);
      });

      it('should treat "[]" and Array() the same', function () {
        var primitive = _.isTypeOf([], "Array");
        var object    = _.isTypeOf(Array(), "Array");

        expect(primitive).toBe(object);
      });

    });

    describe( '_.findNested(collection, nestedProperty, findExpr)', function() {
      var findable1 = {
        "_class"     : "Local.Form.DataGram.FormReference",
        "_id"        : 5,
        "Application": "hscomm",
        "Description": "Blood Sugar Reading",
        "FormKey"    : "blood-sugar",
        "ParentId"   : "3",
        "Title"      : "Blood Sugar Reading"
      };

      var findable2 = {
        "_class"     : "Local.Form.DataGram.FormReference",
        "_id"        : 6,
        "Application": "hscomm",
        "Description": "Another Form",
        "FormKey"    : "another-form",
        "ParentId"   : "3",
        "Title"      : "Another Form, not a Blood Sugar Reading"
      };

      var mockCollectionWithoutFindables = {
        "_class"     : "Local.Form.DataGram.FolderRoot",
        "_id"        : 2,
        "Description": "",
        "Items"      : [
          {
            "_class"     : "Local.Form.DataGram.Folder",
            "_id"        : 3,
            "Description": "Vitals",
            // no forms
            "Items"      : [],
            "ParentId"   : "2",
            "Title"      : "Vitals"
          }
        ],
        "Key"        : "hspc-public-library-forms",
        "ParentId"   : "",
        "Title"      : "Public Forms Library"
      };

      var mockCollectionWithFindables = {
        "_class"  : "Local.Form.DataGram.FolderRoot",
        "_id"     : 2,
        "Items"   : [
          {
            "_class"     : "Local.Form.DataGram.Folder",
            "_id"        : 3,
            "Description": "Vitals",
            // coupla forms
            "Items"      : [
              findable1, findable2
            ],
            "ParentId"   : "2",
            "Title"      : "Vitals"
          }
        ],
        "Key"     : "hspc-public-library-forms",
        "ParentId": "",
        "Title"   : "Public Forms Library"
      };

      var result;

      it( 'should return falsy if nothing is found', function() {
        // By string
        result = _.findNested( mockCollectionWithoutFindables, 'Items', 'FormKey' );
        expect( result ).toBeFalsy();

        // By object
        result = _.findNested( mockCollectionWithoutFindables, 'Items', { FormKey: 'blood-sugar' } );
        expect( result ).toBeFalsy();

        // By function
        result = _.findNested( mockCollectionWithoutFindables, 'Items', function( item ) {
          return item.FormKey;
        } );
        expect( result ).toBeFalsy();
      } );

      it( 'should return the item if it finds one', function() {
        // By string
        // _.find returns the first match
        result = _.findNested( mockCollectionWithFindables, 'Items', 'FormKey' );
        expect( result ).toBe( findable1 );

        // By object
        result = _.findNested( mockCollectionWithFindables, 'Items', { FormKey: 'blood-sugar' } );
        expect( result ).toBe( findable1 );

        result = _.findNested( mockCollectionWithFindables, 'Items', { FormKey: 'another-form' } );
        expect( result ).toBe( findable2 );

        // By function
        result = _.findNested( mockCollectionWithFindables, 'Items', function( item ) {
          return item.FormKey === 'blood-sugar';
        } );
        expect( result ).toBe( findable1 );

        result = _.findNested( mockCollectionWithFindables, 'Items', function( item ) {
          return item.FormKey === 'another-form';
        } );
        expect( result ).toBe( findable2 );
      } );
    } );

  } );
})();

