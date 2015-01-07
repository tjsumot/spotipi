angular.module('spHome').factory('spSpotify', [
  'spApi',
  function(spApi) {
    var socket = spApi.create('spotify');

    var spSpotify = {
      onRun: function(scope, listener) {
        socket.on(scope, 'run', listener);
      }
    };

    return spSpotify;
  }
]);
