angular.module('spSpotify').factory('spSpotify', [
  'spApi',
  function(spApi) {
    var socket = spApi.create('spotify');

    var spSpotify = {

      onStart: function(scope, listener) {
        socket.on(scope, 'start', listener);
      },

      onEnqueue: function(scope, listener) {
        socket.on(scope, 'enqueue', listener);
      },

      onPlay: function(scope, listener) {
        socket.on(scope, 'play', listener);
      },

      play: function(trackUri) {
        return socket.emit('play', trackUri);
      },

      enqueue: function(trackUri) {
        return socket.emit('enqueue', trackUri);
      }

    };

    return spSpotify;
  }
]);
