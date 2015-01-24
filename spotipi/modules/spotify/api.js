var SpotifyPlayer = require('./player'),
  Queue = require('./queue'),
  Autofiller = require('./autofiller');

module.exports = function(i, ev) {

  var player = new SpotifyPlayer(i.log, i.cfg.spotify);
  var playlist = Queue(player.get.bind(player), i.modules.db('queue'));
  var autofiller = Autofiller(player, player.conn);

  forwardEventsOf(player, ['play', 'stop'], 'Player');
  forwardEventsOf(playlist, ['enqueue', 'next'], 'Playlist');
  forwardEventsOf(autofiller, ['similar'], 'Autofiller');

  player.on('stop', function() {
    playNext();
  });

  i.io.on('connection', function(socket) {

    i.log.info("Client connected %s", socket.id);

    socket.emit(ev('start'), {
      track: player.currentTrack,
      queue: playlist.getQueue()
    });


    // Events
    socket.on('disconnect', function() {
      i.log.info("Client disconnected %s", socket.id);
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


  function forwardEventsOf(obj, events, name) {
    events.map(function(eventName) {
      obj.on(eventName, function(track) {
        i.log.info("%s [%s] %s", name, eventName, track.name);
        i.io.emit(ev(eventName), track);
      });
    });
  }


  function playNext() {
    return playlist.getNext().then(function(next) {
      if (next) {
        return next;
      }

      return autofiller.getNext();
    }).then(function(next) {
      if (next) {
        player.play(next);
      }

      return next;
    });
  }


};
