angular.module('spSpotify').controller('SpSpotifyHomeCtrl',function($scope, spSpotify) {

  $scope.play = function(trackUri) {
    spSpotify.play(trackUri).then(function(data) {
      console.log("Playing");
    });
  };

  $scope.enqueue = function(trackUri) {
    spSpotify.enqueue(trackUri).then(function() {
      console.log("Enqueued");
    });
  };

  spSpotify.onStart($scope, function(data) {
    $scope.playing = data.track;
    $scope.queue = data.queue;
  });

  spSpotify.onEnqueue($scope, function(data) {
    $scope.queue.push(data);
  });

  spSpotify.onPlay($scope, function(data) {
    $scope.playing = data;
  });

});
