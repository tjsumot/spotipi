var lame = require('lame'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter,
  Q = require('q'),
  _ = require('lodash'),
  Speaker = require('speaker'),
  Spotify = require('spotify-web');



var SpotifyPlayer = function(log, spotifyCfg) {
  EventEmitter.call(this);

  this.conn = loginToSpotify(log, spotifyCfg);
};

util.inherits(SpotifyPlayer, EventEmitter);

SpotifyPlayer.prototype = _.extend(SpotifyPlayer.prototype, {
  conn: null,
  speaker: null,
  currentStream: null,
  currentTrack: null,

  play: function(trackUri) {
    var that = this;
    var defer = Q.defer();

    that.stop();
    that.conn.then(function(spotify) {
      // first get a "Track" instance from the track URI
      spotify.get(trackUri, function(err, track) {
        if (err) throw err;

        that.speaker = new Speaker();
        that.currentTrack = serializeTrack(track);
        // play() returns a readable stream of MP3 audio data
        that.currentStream = track.play().pipe(new lame.Decoder());
        that.currentStream.pipe(that.speaker);

        that.emit('play', that.currentTrack);

      });
    });

    return defer.promise;
  },

  stop: function() {
    var that = this;
    if (that.currentStream) {
      that.currentStream.unpipe(that.speaker);
    }
  }

});

function loginToSpotify(log, spotifyCfg) {
  var defer = Q.defer();
  Q.ninvoke(Spotify, 'login', spotifyCfg.username, spotifyCfg.password).done(function(spotify) {
    log.info("Logged to Spotify.");
    defer.resolve(spotify);
  }, function(err) {
    defer.reject(err);
    throw Error("Cannot login to Spotify", err);
  });
  return defer.promise;
}

function serializeTrack(track) {
  return {
    gid: track.gid,
    name: track.name,
    album: track.album,
    artist: track.artist,
    popularity: track.popularity,
    duration: track.duration,
    number: track.number,
    discNumber: track.discNumber
  };
}

module.exports = SpotifyPlayer;
