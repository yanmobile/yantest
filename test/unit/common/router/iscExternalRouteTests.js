(function () {
  'use strict';

  var iscExternalRouteApi;
  var iscExternalRouteProvider;

  // Factory/service
  describe('using iscExternalRouteApi to resume state after session timeout', function () {
    beforeEach(function () {
      // Mock $windowProvider
      module(function ($provide) {
        var mockWindowProvider = function () {
          this.$get = function () {
            return {
              'sessionStorage': window.sessionStorage
            };
          };
        };

        $provide.provider('$window', mockWindowProvider);
      });

      // Load module
      module('isc.router');

      // Inject factory API
      inject(function (_iscExternalRouteApi_) {
        iscExternalRouteApi = _iscExternalRouteApi_;
      });
    });

    // -------------------------
    var currentState       = {
      url        : '/dashboard',
      templateUrl: 'home/dashboard/cmcHomeDashboard.html',
      controller : 'cmcHomeDashboardController as hdCtrl',
      name       : 'index.home.dashboard'
    };
    var currentStateParams = {
      'testParam': '123'
    };

    it('should store the current state, then return that state when retrieved', function () {
      // Persist the current state in the api
      iscExternalRouteApi.persistCurrentState(currentState, currentStateParams, 15);

      var retrievedState = iscExternalRouteApi.getNextState();
      expect(retrievedState.nextState).toEqual('index.home.dashboard');
      expect(retrievedState.stateParams).toEqual({'testParam': '123'});
    });

    it('should store the current state, but undefined will return because the state will be expired on retrieval', function () {
      // Persist the current state in the api
      iscExternalRouteApi.persistCurrentState(currentState, currentStateParams, -15);

      var retrievedState = iscExternalRouteApi.getNextState();
      expect(retrievedState).toBeUndefined();
    });
  });


  // Provider
  describe('using iscExternalRouteProvider to configure query params, which are retrieved as a state after authentication', function () {
    var mockLocation = {
      'path': 'http://thisapplication.com/'
    };

    beforeEach(function () {
      // Mock $windowProvider
      module(function ($provide) {
        var mockWindowProvider = function () {
          this.$get = function () {
            return {
              'location'      : mockLocation,
              'sessionStorage': window.sessionStorage
            };
          };
        };

        $provide.provider('$window', mockWindowProvider);
      });

      // Load module
      module('isc.router');

      // Inject provider
      module(function (_iscExternalRouteProvider_) {
        iscExternalRouteProvider = _iscExternalRouteProvider_;
      });

      inject();
    });


    // Function used by the provider to route
    var queryParamFunction = function (queryParams) {
      var nextState = '', stateParams = {};

      if (queryParams.documentId) {
        nextState   = 'index.editDocument';
        stateParams = {
          'documentId': queryParams.documentId,
          'mode'      : queryParams.mode
        };
      }

      else if (queryParams.showContacts) {
        nextState = 'index.viewContacts';
      }

      return {
        'nextState'  : nextState,
        'stateParams': stateParams
      };
    };


    // -------------------------
    // Example of routing to a document with state params
    it('should redirect to index.editDocument with stateParams', function () {
      mockLocation.hash = '#?documentId=123&mode=edit';

      iscExternalRouteProvider.configure(queryParamFunction, 15);
      var retrievedState = iscExternalRouteApi.getNextState();

      expect(retrievedState.nextState).toEqual('index.editDocument');
      expect(retrievedState.stateParams).toEqual({
        'documentId': '123',
        'mode'      : 'edit'
      });
    });


    // Example of routing to a contact with no state params
    it('should redirect to index.viewContacts with no stateParams', function () {
      mockLocation.hash = '#?showContacts=true';

      iscExternalRouteProvider.configure(queryParamFunction, 15);
      var retrievedState = iscExternalRouteApi.getNextState();

      expect(retrievedState.nextState).toEqual('index.viewContacts');
      expect(retrievedState.stateParams).toEqual({});
    });


    // If route has expired, expect no initial state
    it('should go nowhere if the request has expired', function () {
      mockLocation.hash = '#?documentId=123&mode=edit';

      iscExternalRouteProvider.configure(queryParamFunction, -15);
      var retrievedState = iscExternalRouteApi.getNextState();
      expect(retrievedState).toBeUndefined();
    });

  });
})();
