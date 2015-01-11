module.exports = function(io, ev, cfg, log) {
  var SpotifyPlayer = require('./player');
  var player = new SpotifyPlayer(log, cfg.spotify);

  ['play', 'stop'].map(function(eventName) {
    player.on(eventName, function(track) {
      io.emit(eventName, track);
    });
  });

  io.on('connection', function(socket) {

    log.info("Client connected");

    socket.emit(ev('start'), {
      track: player.currentTrack
    });

    socket.on(ev('play'), function(trackUri, cb) {
      player.once('play', cb);
      player.play(trackUri);
    });
  });

};
