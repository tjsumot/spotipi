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
  this.speaker = new Speaker().on('error', function(err) {
    log.error("Error in Speaker stream", err);
  });
};

util.inherits(SpotifyPlayer, EventEmitter);

SpotifyPlayer.prototype = _.extend(SpotifyPlayer.prototype, {
  conn: null,
  speaker: null,
  currentStream: null,

  play: function(trackUri) {
    var that = this;
    var defer = Q.defer();

    that.stop();
    that.conn.then(function(spotify) {
      // first get a "Track" instance from the track URI
      spotify.get(trackUri, function(err, track) {
        if (err) throw err;

        that.emit('play', serializeTrack(track));
        // play() returns a readable stream of MP3 audio data
        that.currentStream = track.play();

        that.currentStream
          .on('finish', function() {
            defer.resolve({
              ev: 'finish',
              track: track
            });
          })
          .on('unpipe', function() {
            that.emit('stop', serializeTrack(track));
            defer.reject({
              ev: 'stop',
              track: track
            });
          })
          .pipe(new lame.Decoder())
          .pipe(that.speaker);

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
