var
  _ = require('lodash'),
  Q = require('q'),
  EventEmitter = require('events').EventEmitter;

function intercept(fun) {

  fun = fun || function() {};

  return function(err /* args */ ) {
    if (err) {
      throw err;
    }

    fun.apply(null, [].slice.call(arguments, 1));
  };
}

function Queue(getData, db) {
  // Init
  var api = new EventEmitter();
  var state = {
    queue: []
  };

  // Methods
  api.push = function(data) {
    data.order = getOrder(_.last(state.queue)) + 1;
    state.queue.push(data);
    db.insert(data, intercept(assignId(data)));
    process(data);
    api.emit('enqueue', data);
  };

  api.unshift = function(data) {
    data.order = getOrder(_.first(state.queue)) - 1;
    state.queue.unshift(data);
    db.insert(data, intercept(assignId(data)));
    process(data);
    api.emit('enqueue', data);
  };

  api.getNext = function() {
    var data = state.queue.shift();
    if (!data) {
      return data;
    }

    return data.tracks.then(function(tracks) {
      var track = tracks.shift();
      if (tracks.length) {
        state.queue.unshift(data);
      } else {
        // Remove from db
        db.remove({
          _id: data._id
        }).exec(intercept());
      }
      api.emit('next', track.uri);
      return track.uri;
    });
  };

  api.getQueue = function() {
    return state.queue.slice();
  };

  // Private
  function loadFromDb() {
    db.find({}).sort({
      'order': 1
    }).exec(intercept(function(docs) {
      docs = docs || [];
      state.queue = docs.map(process);
    }));
  }

  function getOrder(data) {
    if (data) {
      return data.order;
    }
    return 0;
  }

  function assignId(data) {
    return function(doc) {
      data._id = doc._id;
    };
  }

  function process(data) {
    if (data.type === 'track') {
      data.tracks = Q.when(data.uri);
      return data;
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

      return data;
    }

    return data;
  }

  // Init
  loadFromDb();

  return api;
}

module.exports = Queue;
