var express= require('express');
var http = require('http');
var fs = require('node-fs');
var app = express();

var controllers_path = __dirname + '/controllers'
  , controller_files = fs.readdirSync(controllers_path)
controller_files.forEach(function (file) {
console.info(file);
if(!(file==".DS_Store")){
console.info(file +"iNSIDE");
  require(controllers_path+'/'+file)(app)}
});

var server = http.createServer(app);
var port = process.env.PORT || 9080;

server.listen(port,'127.0.0.1', function() {
  console.log('Listening on ' + port);
});
