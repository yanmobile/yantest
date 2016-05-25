/**
 * Created by douglasgoodman on 11/25/14.
 */

(function fixFoundationBug() {
  // error happens when foundation.css is not included (which is the case for unit tests)
  // TypeError: 'null' is not an object (evaluating 'mediaQueries[key].replace')
  var styleEl = document.createElement('style'),
      styleSheet;

  // Append style element to head
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;
  styleSheet.insertRule('meta.foundation-mq { font-family: "small=&medium=&large=&xlarge=&xxlarge="; }', 0);


  beforeEach(module('pascalprecht.translate', function ($translateProvider) {
    //adding sanitize strategy to get rid of the pesky warnings
    $translateProvider.useSanitizeValueStrategy(null);
  }));

}());

var mock$log = {
  log: _.noop,
  info: _.noop,
  warn: _.noop,
  error: _.noop,
  debug: _.noop,
  logFn: _.noop
};

function cleanup(testSuite) {
  _.forEach(testSuite, function (val, key) {
    _.result(val, "remove");
    _.result(val, "$destroy");
    delete testSuite[key];
  });
}

var customConfig = {
  'baseUrl'        : 'http://hscommdev.iscinternal.com/public/api/v1',
  'devlogWhitelist': [],
  'devlogBlacklist': [],
  'landingPages'   : {},
  'rolePermissions': {
    '*'    : ['index.login'],
    'user' : ['index.wellness.*', 'index.messages.*', 'index.library.*', 'index.calendar.*', 'index.myAccount.*'],
    'proxy': ['index.myAccount.*', 'index.messages', 'index.messages.inbox', 'index.messages.outbox', 'index.messages.refillPrescription']
  }
};

var mockLoginResponse = {
  'ApplicationRole': '*',
  'SessionTimeout' : 3600,
  'UserData'       : {
    'FirstName': 'Adam',
    'FullName' : 'Adam Everyman',
    'LastName' : 'Everyman',
    'userRole' : '*'
  },
  'sessionInfo'    : {
    expiresOn: moment().add(30, 'minutes').toString()
  }
};