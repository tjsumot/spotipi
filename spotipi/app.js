var http = require('http').Server();
var io = require('socket.io')(http);
var winston = require('winston');

var pkg = require('./package');
var cfg = require('./config');

winston.info("Starting %s (%s)", pkg.name, pkg.version);

// Load all modules
require('fs').readdir(cfg.modules.dir, function(err, files) {
  if (err) {
    throw err;
  }
  var ext = cfg.modules.ext;
  files.filter(function(fileName) {
    return fileName.indexOf(ext) === fileName.length - ext.length;
  }).map(function(fileName) {
    return fileName.replace(ext, '');
  }).map(function(fileName) {
    return {
      name: fileName,
      mod: require(cfg.modules.dir + '/' + fileName)
    };
  }).map(function(mod) {

    winston.info("[%s] Loading module", mod.name);

    mod.mod(io.of(mod.name), function(evName) {
      return mod.name + "~" + evName;
    }, cfg, winston);

    winston.debug("[%s] Module loaded", mod.name);

  });
});

http.listen(cfg.host ? cfg.host + ':' + cfg.port : cfg.port, function() {
  winston.info("Listening on %s:%s", cfg.host, cfg.port);
});
