/**
 * Created by Henry Zou 11/8/2015
 */

(function () {
  'use strict';

  angular.module('isc.core')
    .constant("statusCode", {
      OK                : 200,
      Created           : 201,
      NoContent         : 204,
      MovedPermanently  : 301,
      Found             : 302,
      SeeOther          : 303,
      NotModified       : 304,
      BadRequest        : 400,
      Unauthorized      : 401,
      Forbidden         : 403,
      NotFound          : 404,
      MethodNotAllowed  : 405,
      Conflict          : 409,
      NotImplemented    : 501,
      BadGateway        : 502,
      ServiceUnavailable: 504,
      GatewayTimeout    : 505
    })
    .constant("keyCode", {
      BACKSPACE: 8,
      COMMA    : 188,
      DELETE   : 46,
      DOWN     : 40,
      END      : 35,
      ENTER    : 13,
      ESCAPE   : 27,
      HOME     : 36,
      LEFT     : 37,
      PAGE_DOWN: 34,
      PAGE_UP  : 33,
      PERIOD   : 190,
      RIGHT    : 39,
      SPACE    : 32,
      TAB      : 9,
      UP       : 38
    });

})();

