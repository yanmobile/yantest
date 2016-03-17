(function () {
  'use strict';
  //console.log( 'iscGridFormItem Tests' );

  describe('iscTransclude', function () {
    var $rootScope,
        $parentScope,
        $scope,
        element,
        $compile,
        $templateCache,
        jqLabel,
        jqReadonly,
        jqControl;

    var labelTemplateSelector    = "[isc-transclude='label-template']";
    var controlTemplateSelector  = "[isc-transclude='control-template']";
    var readonlyTemplateSelector = "[isc-transclude='readonly-template']";
    var defaultConfig            = {};
    var defaultTemplate          = '<isc-transclude config="config"></isc-transclude>';

    beforeEach(module('isc.directives'));

    // this loads all the external templates used in directives etc
    // eg, everything in templates/**/*.html
    beforeEach(module('isc.templates'));

    // setup devlog
    beforeEach(module('isc.core', function (devlogProvider) {
      devlogProvider.loadConfig(customConfig);
    }));


    beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_) {
      $rootScope     = _$rootScope_;
      $compile       = _$compile_;
      $templateCache = _$templateCache_;
    }));

    function compileTemplate(config, template, scopeProps) {
      template            = template || defaultTemplate;
      config              = config || defaultConfig;
      $parentScope        = $rootScope.$new();
      $parentScope.config = config;
      _.extend($parentScope, scopeProps);
      element             = $compile(template)($parentScope);
      $scope              = element.scope();
      console.log($templateCache.get('src/components/foundation/base/modules/iscTransclude/iscGridFormRWItem.html'));
      $scope.$digest();

      jqLabel    = element.find(labelTemplateSelector);
      jqControl  = element.find(controlTemplateSelector);
      jqReadonly = element.find(readonlyTemplateSelector);
    }

    // -------------------------
    describe('setup tests ', function () {
      it("sanity check", function () {
        compileTemplate();
        expect($scope.iscTranscludeCtrl).toBeDefined();
        expect($scope.iscTranscludeCtrl.config).toEqual(defaultConfig);
        expect(jqLabel.length).toBe(1);
        expect(jqControl.length).toBe(1);
        expect(jqReadonly.length).toBe(0);
      });
    });

    describe('default values for label and control', function () {
      it('should have "" as label and control', function () {
        compileTemplate();
        expect(jqLabel.text().trim()).toBe("");
        expect(jqControl.text().trim()).toBe("");
      });
    });

    describe("updating label using config", function () {
      var config = { translationKey: 'myLabel' };
      it("should have 'myLabel' as value for label", function () {
        compileTemplate(config);
        expect(element.find("label").text()).toBe(config.translationKey);
      });
    });

    describe("transcluding label and control", function () {
      var template = '<isc-transclude config="config"><label-template>hello world</label-template><control-template><input id="input"></control-template></isc-transclude>';
      it("should have 'myLabel' as value for label", function () {
        compileTemplate(defaultConfig, template);
        expect(jqLabel.text()).toBe("hello world");
        expect(jqControl.find("#input").length).toBe(1);
      });
    });

    describe("specify configuration as html attributes", function () {
      var template = '<isc-transclude config-item-translation-key="attribute translation" config="config"></isc-transclude>';
      it("should have 'attribute translation' as value for label", function () {
        compileTemplate(defaultConfig, template);
        expect($scope.iscTranscludeCtrl).toBeDefined();
        expect($scope.iscTranscludeCtrl.config).toBeDefined();
        expect($scope.iscTranscludeCtrl.config.translationKey).toEqual('attribute translation');
        expect(jqLabel.text().trim()).toBe("attribute translation");
      });
    });

    describe("watches config updates", function () {
      var template = '<isc-transclude config="config"></isc-transclude>';
      var config = { translationKey: 'myLabel' };
      it("should have 'attribute translation' as value for label", function () {
        compileTemplate(config, template);
        expect($scope.iscTranscludeCtrl.config.translationKey).toEqual('myLabel');

        //updating translationKey
        config.translationKey = "yourLabel";
        $scope.$digest();
        expect($scope.iscTranscludeCtrl.config.translationKey).toEqual('yourLabel');
      });
    });

    describe("exercising parameter types", function () {
      var templateUrl = "configItemTypes.html";
      var iscTemplate = "<a ng-click='iscTranscludeCtrl.config.action($parent)'>{{iscTranscludeCtrl.config.action}}</a>";

      it('sanity check: should have ' + templateUrl + ' template file', function () {
        $templateCache.put(templateUrl, iscTemplate);

        var savedTemplateUrlContent = $templateCache.get(templateUrl);
        expect(savedTemplateUrlContent).toBe(iscTemplate);
      });

      it('should treat "@" types as string', function () {
        var consumerTemplate = "<isc-transclude template-url='" + templateUrl + "' config-item-action='@action'></isc-transclude>";

        $templateCache.put(templateUrl, iscTemplate);
        compileTemplate(defaultConfig, consumerTemplate);

        expect($scope.iscTranscludeCtrl).toBeDefined();
        expect($scope.iscTranscludeCtrl.config).toEqual({ action: 'action' });
        expect(element.text()).toBe("action");
      });

      it('should treat "=" types as expression', function () {
        var consumerTemplate = "<isc-transclude config='config' template-url='" + templateUrl + "' config-item-action='=action'></isc-transclude>";
        $templateCache.put(templateUrl, iscTemplate);
        compileTemplate(defaultConfig, consumerTemplate, { action: 10 });

        expect($scope.iscTranscludeCtrl).toBeDefined();
        expect(typeof $scope.iscTranscludeCtrl.config.action).toEqual('number');
        expect($scope.iscTranscludeCtrl.config).toEqual({ action: 10 });
        expect(element.text()).toBe("10");
      });

      it('should treat "&" types as function', function () {
        var consumerTemplate = "<isc-transclude config='config' template-url='" + templateUrl + "' config-item-action='&action()'></isc-transclude>";
        $templateCache.put(templateUrl, iscTemplate);
        var hasBeenCalled    = false;

        compileTemplate(defaultConfig, consumerTemplate, {
          action: function () {
            hasBeenCalled = true;
          }
        });

        expect($scope.iscTranscludeCtrl).toBeDefined();
        expect(typeof $scope.iscTranscludeCtrl.config.action).toEqual('function');

        spyOn($parentScope, 'action').and.callThrough();
        expect(hasBeenCalled).toBe(false);
        element.find("a").trigger('click');
        expect(hasBeenCalled).toBe(true);
        expect($parentScope.action).toHaveBeenCalled();
      });

    });

    describe("specify custom template", function () {
      var template = '<isc-transclude template-url="iscTransclude/iscGridFormRWItem.html" config="config"><label-template>hello world</label-template><control-template><input id="input"></control-template></isc-transclude>';
      it("should now have $readonly section", function () {
        compileTemplate(defaultConfig, template);
        expect($scope.iscTranscludeCtrl).toBeDefined();
        expect($scope.iscTranscludeCtrl.config).toEqual(defaultConfig);
        expect(jqLabel.length).toBe(1);
        expect(jqControl.length).toBe(1);
        expect(jqReadonly.length).toBe(1);
      });
    });

    describe("creating grid form input directive without transclude sections", function () {
      var templateUrl      = "fake/iscTemplate.html";
      var iscInputTemplate = "<div><label for='{{iscTranscludeCtrl.config.id}}'>{{iscTranscludeCtrl.config.translationKey}}</label><input type='{{iscTranscludeCtrl.config.inputType || 'text'}}' id='{{iscTranscludeCtrl.config.id}}' ng-model='iscTranscludeCtrl.config.model'></div>";
      var config           = { id: 'fake', translationKey: "fake label", inputType: 'text', model: 'fake value' };

      var consumerTemplate = "<isc-transclude template-url='" + templateUrl + "' config='config'></isc-transclude>";

      it('sanity check: should have ' + templateUrl + ' template file', function () {
        $templateCache.put(templateUrl, iscInputTemplate);

        var savedTemplateUrlContent = $templateCache.get(templateUrl);
        expect(savedTemplateUrlContent).toBe(iscInputTemplate);
      });

      it('should render a directive', function () {
        $templateCache.put(templateUrl, iscInputTemplate);
        compileTemplate(config, consumerTemplate);

        expect($scope.iscTranscludeCtrl).toBeDefined();
        expect($scope.iscTranscludeCtrl.config).toEqual(config);

        var htmlLabel = element.find("label")[0];
        var htmlInput = element.find("input")[0];

        expect(htmlLabel).toBeDefined();
        expect(htmlInput).toBeDefined();

        expect(htmlLabel.htmlFor).toBe(htmlInput.id);
        expect(htmlInput.value).toBe('fake value');
        expect(htmlInput.type).toBe('text');

      });

    });

  });
})();

