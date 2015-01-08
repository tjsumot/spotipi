module.exports = function(io, ev) {

  io.on('connection', function(socket) {
    socket.emit(ev('run'), "Hello!");

    var lame = require('lame');
    var Speaker = require('speaker');
    var Spotify = require('spotify-web');
    var uri = 'spotify:track:2sCXIORj80VAuapMIRZcIy';

    // Spotify credentials...
    var username = "11145642858"; //process.env.USERNAME;
    var password = "123Spotify789"; //process.env.PASSWORD;

    console.log("Client connected");
    Spotify.login(username, password, function(err, spotify) {
      if (err) throw err;

      // first get a "Track" instance from the track URI
      spotify.get(uri, function(err, track) {
        if (err) throw err;

        //socket.emit('spotify~run', track);

        // play() returns a readable stream of MP3 audio data
        track.play()
          .pipe(new lame.Decoder())
          .pipe(new Speaker())
          .on('finish', function() {
            spotify.disconnect();
          });
      });
    });
  });

};
