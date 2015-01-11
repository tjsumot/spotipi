var _ = require('lodash');

var envConfig = env('node_env', 'development');
var config = _.merge({}, require('./default'));
config = _.merge(config, require('./' + envConfig));

// check env variables
config = mergeWithEnv('', config);

module.exports = config;

function env(name, def) {
  return process.env[name] || process.env[name.toUpperCase()] || def;
}

function mergeWithEnv(path, obj) {
  return _.mapValues(obj, function(val, key) {

    if (_.isObject(val)) {
      return mergeWithEnv(path + key + "__", val);
    }

    return env(path + key, obj[key]);

  });
}
