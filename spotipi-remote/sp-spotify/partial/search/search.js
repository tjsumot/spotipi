angular.module('spSpotify').controller('SearchCtrl', function($scope, spSpotify, Spotify) {

  $scope.$watch('search', function(search) {
    if (!search) {
      return;
    }
    doSearch(search);
  });

  function search(query) {
    Spotify.search(query, 'album,artist,track').then(function(data) {
      $scope.data = data;
    });
  }
  var doSearch = _.throttle(search, 500);



});
