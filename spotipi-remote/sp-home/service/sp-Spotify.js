angular.module('spHome').factory('spSpotify', [
  'spApi',
  function(spApi) {
    var socket = spApi.create('spotify');

    var spSpotify = {
      onRun: function(scope, listener) {
        socket.on(scope, 'run', listener);
      },
      play: function(trackUri) {
        return socket.emit('play', trackUri);
      }
    };

    return spSpotify;
  }
]);
