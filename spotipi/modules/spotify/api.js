var SpotifyPlayer = require('./player'),
  Queue = require('./queue');

module.exports = function(i, ev) {

  var player = new SpotifyPlayer(i.log, i.cfg.spotify);
  var playlist = new Queue(player.get.bind(player));

  ['play', 'stop'].map(function(eventName) {
    player.on(eventName, function(track) {
      i.log.info("Player [%s] %s", eventName, track.name);
      i.io.emit(ev(eventName), track);
    });
  });

  ['enqueue', 'next'].map(function(eventName) {
    playlist.on(eventName, function(data) {
      i.log.info("Playlist [%s] %s", eventName, data);
      io.emit(ev(eventName), data);
    });
  });

  player.on('stop', function() {
    playNext();
  });

  function playNext() {
    return playlist.getNext().then(function(next) {
      if (next) {
        player.play(next);
      }
      return next;
    });
  }

  i.io.on('connection', function(socket) {

    i.log.info("Client connected %s", socket.id);

    socket.on('disconnect', function() {
      i.log.info("Client disconnected %s", socket.id);
    });

    socket.emit(ev('start'), {
      track: player.currentTrack,
      queue: playlist.queue
    });

    socket.on(ev('play'), function(data, cb) {
      if (data.type === 'track') {
        player.once('play', cb);
        player.play(data.uri);
        return;
      }

      playlist.unshift(data);
      playNext().then(cb);
      return;
    });

    socket.on(ev('next'), function(data, cb) {
      playNext().then(cb);
    });

    socket.on(ev('stop'), function(data, cb) {
      player.stop();
    });

    socket.on(ev('enqueue'), function(data, cb) {
      playlist.once('enqueue', function(data) {
        if (!player.isPlaying) {
          playNext().then(cb);
        }
      });

      playlist.push(data);
    });
  });

};
