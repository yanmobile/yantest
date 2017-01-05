(function() {
  'use strict';

  describe( 'iscMoment', function() {
    describe( 'moment().isDifferent', function() {
      it( 'should return true if two moments are different', function() {
        var date1 = moment( '1/1/2017', 'M/D/YYYY' ),
            date2 = moment( '1/1/2017', 'M/D/YYYY' ),
            date3 = moment( '1/2/2017', 'M/D/YYYY' );

        // date1 == date2
        expect( date1.isSame( date2 ) ).toBe( true );
        expect( date1.isDifferent( date2 ) ).toBe( false );

        // date1 != date3
        expect( date1.isSame( date3 ) ).toBe( false );
        expect( date1.isDifferent( date3 ) ).toBe( true );
      } );
    } );
  } );
})();