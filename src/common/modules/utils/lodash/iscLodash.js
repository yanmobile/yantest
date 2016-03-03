/**
 * Created by Henry Zou on 10/3/15.
 *
 * Extending lodash functionalities for common
 *
 */

(function () {
  'use strict';

  var origGet = _.get;
  //from original lodash source code, used for parsing _.get() path
  var rePropName   = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(\\{.+\})|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
  var reEscapeChar = /\\(\\)?/g;
  //sanitizes object data by adding quotes
  var reFixJson = /(['"])?([a-zA-Z0-9_]+)(['"])?:/g;
  //save the original _.get

  _.mixin({
    isPresent   : isPresent,
    isNotPresent: isNotPresent,
    getAge      : getAge,
    areSameDate : areSameDate,
    nullifyObj  : nullifyObj,
    isTypeOf    : isTypeOf,
    makeObj     : makeObj,
    get         : advancedGet,
    wrapText    : wrapText,
    interpolate : interpolate
  });

  // Present is defined by not undefined and not null.
  function isPresent(obj) {
    return obj != null;
  }

  // Present is defined by not undefined and not null.
  function isNotPresent(obj) {
    return obj == null;
  }

  function getAge(dob, format) {
    return moment().diff(moment(dob, format), 'year');
  }

  var MS_IN_DAY = 86400000;

  function areSameDate(date1, date2) {
    return Math.abs(new Date(date1) - new Date(date2)) < MS_IN_DAY;
  }

  /**
   * Gets the object's real type
   *
   * Object.prototype.toString.call(obj) produces the following:
   * string:
   * ==> '[object String]'
   * number:
   * ==> '[object Number]'
   * object:
   * ==> '[object Object]'
   * null:
   * ==> '[object Null]'
   * undefined:
   * ==> '[object Undefined]'
   * date:
   * ==> '[object Date]'
   * function:
   * ==> '[object Function]'
   * Array:
   * ==> '[object Array]'
   * RegExp:
   * ==> '[object RegExp]'
   */
  function isTypeOf(obj, type) {
    if (typeof type !== 'string') {
      return false;
    }

    var typeStartIndex = 8;
    var typeOfString   = Object.prototype.toString.call(obj);
    var typeLength     = typeOfString.length - 9;
    var typeToken      = typeOfString.substr(typeStartIndex, typeLength);
    return typeToken.toLowerCase() === type.toLowerCase();
  }

  //set object's own internal properties to null
  function nullifyObj(obj) {
    //Confirm it's a real  object literal and not a 'fake' one like (array/function/date/etc)
    if (isTypeOf(obj, 'Object')) {
      _.forOwn(obj, function (value, key) {
        obj[key] = null;
      });
    }
  }

  /**
   * Limitations: the array filtering syntax only supports string path and not array paths
   *
   * Enhances the _.get functionality by adding the ability to supply a find clause to
   * search array items.

   ---- ORIG DOC ----
   _.get(object, path, [defaultValue])

   Gets the property value at path of object. If the resolved value is undefined the defaultValue is used in its place.

   Arguments
   object (Object): The object to query.
   path (Array|string): The path of the property to get.
   [defaultValue] (*): The value returned if the resolved value is undefined.
   Returns
   (*): Returns the resolved value.

   Example
   var object = { 'a': [{ 'b': { 'c': 3 }, {'code': 11, 'b': 'c' }] };

   _.get(object, 'a[0].b.c');
   // → 3

   _.get(object, ['a', '0', 'b', 'c']);
   // → 3

   _.get(object, 'a.b.c', 'default');
   // → 'default'

   --- Added Doc ---
   The new array filtering syntax also uses []. In additional to passing in the index,
   it can now also take an object literal used as the findWhere clause

   _.get(object, 'a[{code: 11}]', 'default');
   // → {'code': 11, 'b': 'c'}
  **/
  function advancedGet(obj, path, defaultValue) {
    var val = obj;

    if (isTypeOf(path, 'string') && _.includes(path, ':')) {
      toPath(path).forEach(function (part) {
        if (_.includes(part, ':')) {
          part     = part.replace(reFixJson, '"$2": ');
          var json = JSON.parse(part);
          val      = _.find(val, json);
        } else {
          val = origGet(val, part, defaultValue);
        }
      });
    } else {
      val = origGet(obj, path);
    }

    return isPresent(val) ? val : defaultValue;
  }

  function toPath(path) {

    var results = [];

    path.replace(rePropName, function (match, number, quote, string) {
      var parts = quote ? string.replace(reEscapeChar, '$1') : (number || match);
      results.push(parts);
    });
    return results;
  }

  function makeObj(key, value) {
    var obj  = {};
    obj[key] = value;
    return obj;
  }

  function wrapText(val, text) {
    text = text || '"';

    return text + val + text;
  }

  //from:http://stackoverflow.com/questions/1408289/how-can-i-do-string-interpolation-in-javascript
  //usage:
  // _.interpolate("I am {0}", {'0': 5})
  // => "I am 5
  // _.interpolate("I am {0}", [5])
  // => "I am 5
  function interpolate(template, scope) {
    return template.replace(/{([^{}]*)}/g,
      function (a, b) {
        var r = scope[b];
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  }

  //END CLASS
})();
