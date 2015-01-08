var _ = require('lodash');

var envConfig = env('node_env', 'development');
var config = _.merge({}, require('./default'));
config = _.merge(config, require('./' + envConfig));

// check env variables
['port', 'host'].map(function(key) {
  config[key] = env(key, config[key]);
});

module.exports = config;

function env(name, def) {
  return process.env[name] || process.env[name.toUpperCase()] || def;
}
