var Datastore = require('nedb');

module.exports = function(io, ev, cfg, log) {

  return function createDb(name) {

    return new Datastore({
      filename: '../../data/' + name,
      autoload: true
    });

  };

};

