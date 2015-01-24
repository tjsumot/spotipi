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

  get: function(uri) {
    return this.conn.then(function(spotify) {
      return Q.ninvoke(spotify, 'get', uri);
    });
  },

  play: function(trackUri) {
    var that = this;

    that.stop();

    // first get a "Track" instance from the track URI
    that.get(trackUri).then(function(track) {

      that.speaker = new Speaker();
      that.currentTrack = serializeTrack(track);
      // play() returns a readable stream of MP3 audio data
      that.currentStream = track.play().pipe(new lame.Decoder());
      that.currentStream.pipe(that.speaker);

      that.currentStream.on('finish', function() {
        that.isPlaying = false;
        that.emit('stop', that.currentTrack);
      });

      that.isPlaying = true;
      that.emit('play', that.currentTrack);

    }).done();
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
    uri: track.uri,
    album: track.album,
    artist: track.artist,
    popularity: track.popularity,
    duration: track.duration,
    number: track.number,
    discNumber: track.discNumber
  };
}

module.exports = SpotifyPlayer;
