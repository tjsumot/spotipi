angular.module('spHome').controller('SpHomeCtrl', function($scope, spSpotify, Spotify) {

  $scope.$watch('search', function(search) {
    if (!search) {
      return;
    }
    doSearch(search);
  });

  $scope.play = function(trackUri) {

    spSpotify.play(trackUri).then(function(data) {
      $scope.playing = data;
    });
  };


  function search(query) {
    Spotify.search(query, 'track').then(function(data) {
      $scope.data = data;
    });
  }
  var doSearch = _.throttle(search, 500);

});
