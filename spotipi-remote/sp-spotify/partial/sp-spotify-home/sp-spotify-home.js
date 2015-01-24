angular.module('spSpotify').controller('SpSpotifyHomeCtrl', function($scope, spSpotify) {

  $scope.play = function(trackUri) {
    spSpotify.play({
      type: 'track',
      uri: trackUri
    }).then(function(data) {
      console.log("Playing");
    });
  };

  $scope.enqueue = function(trackUri) {
    spSpotify.enqueue(trackUri).then(function() {
      console.log("Enqueued");
    });
  };

  $scope.next = function() {
    spSpotify.next();
  };
  $scope.stop = function() {
    spSpotify.stop();
  };

  $scope.playAlbum = function(albumUri) {
    spSpotify.play({
      type: 'album',
      uri: albumUri
    });
  };


  spSpotify.onStart($scope, function(data) {
    $scope.playing = data.track;
    $scope.queue = data.queue;
    $scope.autofiller = [];
  });

  spSpotify.onEnqueue($scope, function(data) {
    $scope.queue.push(data);
  });

  spSpotify.onPlay($scope, function(data) {
    $scope.playing = data;
  });

  spSpotify.onSimilar($scope, function(data) {
    $scope.autofiller.push(data);
  });

});
