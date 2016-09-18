// NOTE:  order of the proxy items matter

// to use proxy server, be sure to update your src/app/modules/app.config.js to use relative path
// by removing "protocol", "hostname", and "port"
//
// proxy server configs are automatically used when running "gulp serve" and "gulp server"


// example proxy config
//
// module.exports = [
//   {
//     pattern : "/api/v1",
//     target  : "http://localhost:3030",
//     logLevel: 'debug'
//   }, {
//     pattern : "/api",
//     target  : "http://devrefhspd:7162/healthshare",
//     logLevel: 'debug'
//   }
// ];

module.exports = [];