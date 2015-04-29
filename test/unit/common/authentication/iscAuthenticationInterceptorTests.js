
(function(){
  'use strict';

  describe('iscAuthenticationInterceptor', function(){
    var rootScope,
      q,
      interceptor;


    beforeEach( module('iscHsCommunityAngular', 'isc.common') );

    // show $log statements
    beforeEach( module( 'iscHsCommunityAngular', 'isc.common', function( $provide ){
      $provide.value('$log', console);
    }));

    beforeEach( inject( function( $rootScope, $q, iscAuthenticationInterceptor ){
      rootScope = $rootScope; //NOTE when spying on $rootScope.$broadcast, you cant use $rootScope.$new()
      q = $q;
      interceptor = iscAuthenticationInterceptor;


    }));

    // -------------------------
    describe( 'responseError tests ', function(){

      it( 'should have a function responseError', function(){
        expect( angular.isFunction( interceptor.responseError )).toBe( true );
      });

      it( 'should do the right thing on responseError', function(){
        var response = {error: 'Oops'};

        spyOn( rootScope, '$broadcast' );
        spyOn( q, 'reject' );

        interceptor.responseError( response );

        expect( rootScope.$broadcast ).toHaveBeenCalled();
        expect( q.reject ).toHaveBeenCalledWith( response );
      });
    });

  });

})();

