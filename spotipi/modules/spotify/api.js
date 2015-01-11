var SpotifyPlayer = require('./player'),
  Queue = require('./queue');
module.exports = function(io, ev, cfg, log) {


  var player = new SpotifyPlayer(log, cfg.spotify);
  var playlist = new Queue();

  ['play', 'stop'].map(function(eventName) {
    player.on(eventName, function(track) {
      log.info("Player [%s] %s", eventName, track.name);
      io.emit(ev(eventName), track);
    });
  });

  ['enqueue', 'next'].map(function(eventName){
    playlist.on(eventName, function(data) {
      log.info("Playlist [%s] %s", eventName, data);
      io.emit(ev(eventName), data);
    });
  });

  player.on('stop', function(){
    var next = playlist.getNext();
    if (next) {
      player.play(next);
    }
  });

  io.on('connection', function(socket) {

    log.info("Client connected %s", socket.id);

    socket.on('disconnect', function(){
      log.info("Client disconnected %s", socket.id);
    });

    socket.emit(ev('start'), {
      track: player.currentTrack,
      queue: playlist.queue
    });

    socket.on(ev('play'), function(trackUri, cb) {
      player.once('play', cb);
      player.play(trackUri);
    });

    socket.on(ev('enqueue'), function(trackUri, cb) {
      playlist.once('enqueue', cb);
      playlist.add(trackUri);
    });
  });

};
