/**
 * Created by probbins on 10/18/2016
 */

( function() {
  _.extend( moment.fn, {
    isDifferent: isDifferent
  } );

  // Implements an isDifferent function on moment objects,
  // which is simply the inverse logic of isSame.
  function isDifferent( input, units ) {
    return !( this.isSame( input, units ) );
  }
} )();
