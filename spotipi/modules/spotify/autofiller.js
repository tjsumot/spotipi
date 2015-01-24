var Q = require('q'),
  EventEmitter = require('events').EventEmitter;

function Autofiller(player, conn) {

  var api = new EventEmitter();
  var state = {
    queue: []
  };

  player.on('play', function(track) {
    
    conn.then(function(spotify) {
      console.log("Searching for similar tracks.");
      return Q.ninvoke(spotify, 'similar', track.uri);
    }).then(function(similar) {
      var s = similar[0];
      state.queue.push(s);

      api.emit('similar', {
        gid: s.gid,
        name: s.name,
        artist: s.artist,
        album: s.album,
        uri: s.uri
      });
    }).fail(function(err) {
      console.error("Couldn't fetch similar tracks!", err);
    });

  });

  api.getNext = function() {
    return Q.when(state.queue.shift());
  };

  return api;

}


module.exports = Autofiller;
