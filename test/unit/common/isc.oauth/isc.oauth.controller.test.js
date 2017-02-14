(function() {
  'use strict';

  var suite, controller, self, scope;

  var token = { "expiresIn" : 123};
  var user = { "user" : 123};


  describe( 'isc.oauth.controller', function() {


    // setup devlog
    beforeEach (module ('isc.core','isc.common','isc.oauth', function (devlogProvider, $provide) {
      devlogProvider.loadConfig ({});
      $provide.value('token', token );
      $provide.value('user', user );
    }));

    // Inject factory API

    beforeEach( inject( function( $rootScope,
      token,
      user,
      iscSessionModel,
      $state,
      $controller
    ) {

      suite =  {
        $rootScope     : $rootScope,
        token          : token,
        user           : user,
        iscSessionModel: iscSessionModel,
        $state         : $state,
        $controller    : $controller
      } ;

      scope = suite.$rootScope.$new();

    } ) );


      // -------------------------
      it( 'should redirect to login if token and user are empty', function() {
        spyOn(suite.$state, "go").and.callFake(_.noop);
        spyOn(window._, "defer").and.callFake(function(fn, val){ fn(val); });

        controller = suite.$controller( 'iscOauthController as oauthCtrl',
          {
            '$scope': scope,
            'token' : {},
            'user'  : {}
          } );

        expect(suite.$state.go).toHaveBeenCalledWith( "unauthenticated.login", { reload: true } );

      } );


      // -------------------------
      it( 'should redirect to home if token and user are available', function() {
        spyOn(suite.$state, "go").and.callFake(_.noop);
        spyOn(suite.iscSessionModel, "create").and.callFake(_.noop);
        spyOn(window._, "defer").and.callFake(function(fn, val){ fn(val); });

        var loginResponse = _.assignIn( {}, {
          "SessionTimeout" : _.get( suite.token , "expiresIn" , 300 )
        }, {
          "UserData": _.assignIn({}, suite.user , { userRole : 'provider' })
        } );

        controller = suite.$controller( 'iscOauthController as oauthCtrl',
          {
            '$scope': scope,
            'token' : suite.token,
            'user'  : suite.user
          } );

        expect(suite.$state.go).toHaveBeenCalledWith( "authenticated.home", { reload: true } );
        expect(suite.iscSessionModel.create).toHaveBeenCalledWith( loginResponse , true );

      } );



  } );
})
();
