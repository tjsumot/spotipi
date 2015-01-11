angular.module('spHome').controller('SpHomeCtrl', function($scope, spSpotify, Spotify) {

  $scope.$watch('search', function(search) {
    if (!search) {
      return;
    }
    doSearch(search);
  });

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


  function search(query) {
    Spotify.search(query, 'track').then(function(data) {
      $scope.data = data;
    });
  }
  var doSearch = _.throttle(search, 500);

});
