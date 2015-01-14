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

  files.filter(function(fileName) {
    return fileName.indexOf('.') !== 0;
  }).map(function(fileName) {
    return {
      name: fileName,
      mod: require(cfg.modules.dir + '/' + fileName)
    };
  }).reduce(function(modules, mod) {

    winston.info("[%s] Loading module", mod.name);

    var modApi = mod.mod({
      io: io.of(mod.name),
      cfg: cfg,
      log: winston,
      modules: modules
    }, function(evName) {
      return mod.name + "~" + evName;
    });

    winston.debug("[%s] Module loaded", mod.name);

    // Expose API
    modules[mod.name] = modApi;

    return modules;
  }, {});
});

http.listen(cfg.host ? cfg.host + ':' + cfg.port : cfg.port, function() {
  winston.info("Listening on %s:%s", cfg.host, cfg.port);
});
