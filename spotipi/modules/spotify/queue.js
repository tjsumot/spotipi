var util = require('util'),
  _ = require('lodash'),
  Q = require('q'),
  EventEmitter = require('events').EventEmitter;

function Queue(getData) {
  EventEmitter.call(this);
  this.getData = getData;
  this.queue = [];
}

util.inherits(Queue, EventEmitter);

Queue.prototype.push = function(data) {
  this.queue.push(data);
  this.process(data);
  this.emit('enqueue', data);
};

Queue.prototype.unshift = function(data) {
  this.queue.unshift(data);
  this.process(data);
  this.emit('enqueue', data);
};

Queue.prototype.getNext = function() {
  var that = this;
  var data = that.queue.shift();

  return data.tracks.then(function(tracks) {
    var track = tracks.shift();
    if (tracks.length) {
      that.queue.unshift(data);
    }
    that.emit('next', track.uri);
    return track.uri;
  });
};

Queue.prototype.process = function(data) {
  if (data.type === 'track') {
    data.tracks = Q.when(data.uri);
    return;
  }
  if (data.type === 'album') {
    data.tracks = this.getData(data.uri).then(function(album) {
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
};

module.exports = Queue;
