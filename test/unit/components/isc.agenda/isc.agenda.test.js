/**
 * Created by hzou on 5/6/16.
 */

(function () {
  'use strict';

  describe('agenda', function () {

    var suite;
    var html = '<agenda config="config" data="data"></agenda>';

    beforeEach(module('angular.filter', 'isc.directives'));

    // afterEach clean up
    afterEach(function () {
      if (suite.element) {
        suite.element.remove();
        suite = null;
      }
    });

    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach(module('isc.templates'));

    beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
      suite               = {
        $rootScope  : _$rootScope_,
        $scope      : _$rootScope_.$new(),
        $httpBackend: _$httpBackend_,
        $compile    : _$compile_
      };
      suite.$scope.config = getConfig();
      suite.$scope.data   = getData();
    }));

    function compile() {
      suite.element = suite.$compile(html)(suite.$scope);
      suite.$scope.$digest();
      suite.isolateScope = suite.element.isolateScope();
    }

    // -------------------------
    describe('setup tests ', function () {
      it('should have $scope', function () {
        compile();
        expect(suite.$scope.config).toBeDefined();
        expect(suite.$scope.data).toBeDefined();
        expect(suite.$scope).toBeDefined();
        expect(suite.isolateScope).toBeDefined();
        expect(suite.element).toBeDefined();
        expect(suite.element.html()).toBeDefined();
      });
    });

    describe('default template rendering', function () {
      it('should have config.title as the title text', function () {
        compile();
        var expected = suite.$scope.config.title;
        expect(suite.element.find('.agenda-header').html()).toBe(expected);
      });

      it('should have single group', function () {
        compile();
        expect(suite.element.find('.agenda-group').length).toBe(1);
      });

      it('should have date as the group header text', function () {
        compile();
        var expected   = suite.$scope.data[0].date;
        var headerText = suite.element.find('.agenda-group-header').text().trim();
        expect(headerText).toBe(expected);
      });

      it('should have two items in the group', function () {
        compile();
        var numbOfItems = suite.element.find('.agenda-group .agenda-group-item').length;
        expect(numbOfItems).toBe(2);
      });

    });

    describe('template overrides', function () {
      it('should be able to override itemTemplateUrl', function () {
        var templateUrl  = "myTemplateOverride.html";
        var templateText = "MY TEMPLATE";

        suite.$scope.config.itemTemplateUrl = templateUrl;
        suite.$httpBackend.expectGET(templateUrl).respond(templateText);
        compile();
        suite.$httpBackend.flush();
        var text = suite.element.find('.agenda-group-item:first-child').text().trim();
        expect(text).toEqual(templateText);
      });

      it('should be able to override headerTemplateUrl', function () {
        var templateUrl  = "myTemplateOverride.html";
        var templateText = "MY TEMPLATE";

        suite.$scope.config.headerTemplateUrl = templateUrl;
        suite.$httpBackend.expectGET(templateUrl).respond(templateText);
        compile();
        suite.$httpBackend.flush();
        var text = suite.element.find('.agenda-group-header:first-child').text().trim();
        expect(text).toEqual(templateText);
      });

    });
  });

  function getConfig() {
    return {
      timeKey: 'datetime',
      groupBy: 'date',
      title  : 'Agenda'
    };
  }

  function getData() {
    return [{
      "datetime"   : new Date("2016-04-28T03:07:59.000Z"),
      "date"       : "04/27/2016",
      "hour"       : "23",
      "CanGraph"   : 1,
      "Code"       : "3141-9",
      "Description": "Weight",
      "Graph"      : "Weight/BMI",
      "ShowScale"  : 1,
      "CodeSystem" : "LOINC",
      "Test"       : "Weight",
      "Time"       : "2016-04-27 23:07:59",
      "Units"      : "Pounds",
      "Value"      : "169.00"
    }, {
      "datetime"   : new Date("2016-04-28T00:07:59.000Z"),
      "date"       : "04/27/2016",
      "hour"       : "20",
      "CanGraph"   : 1,
      "Code"       : "39156-5",
      "Description": "BMI",
      "Graph"      : "Weight/BMI",
      "ShowScale"  : 1,
      "CodeSystem" : "LOINC",
      "Test"       : "BMI",
      "Time"       : "2016-04-27 20:07:59",
      "Units"      : "Kilogram per square meter",
      "Value"      : 24.2
    }];
  }
})();

