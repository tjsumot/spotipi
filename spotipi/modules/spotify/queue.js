var util = require('util'),
  _ = require('lodash'),
  Q = require('q'),
  EventEmitter = require('events').EventEmitter;

function Queue(getData, db) {
  // Init
  var api = new EventEmitter();
  var state = {
    queue: []
  };

  // Methods
  api.push = function(data) {
    state.queue.push(data);
    process(data);
    api.emit('enqueue', data);
  };

  api.unshift = function(data) {
    state.queue.unshift(data);
    api.process(data);
    api.emit('enqueue', data);
  };

  api.getNext = function() {
    var data = queue.shift();

    return data.tracks.then(function(tracks) {
      var track = tracks.shift();
      if (tracks.length) {
        state.queue.unshift(data);
      }
      api.emit('next', track.uri);
      return track.uri;
    });
  };

  api.getQueue = function () {
    return state.queue.slice();
  };

  // Private
  function loadFromDb() {
    db.find({}).sort({
      'order': 1
    }).exec(function(err, docs) {
      if (err) {
        throw err;
      }

      state.queue = docs;
    });
  }

  function process(data) {
    if (data.type === 'track') {
      data.tracks = Q.when(data.uri);
      return;
    }
    if (data.type === 'album') {
      data.tracks = getData(data.uri).then(function(album) {
        var tracks = album.disc.reduce(function(tracks, disc) {

          if (_.isArray(disc.track)) {
            return tracks.concat(disc.track);
          }
          return tracks;
        }, []);

        return tracks;
      });
      return;
    }
  }

  // Init
  loadFromDb();

  return api;
}

module.exports = Queue;
