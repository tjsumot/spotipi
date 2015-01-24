angular.module('spSpotify').controller('SearchCtrl', function($scope, spSpotify, Spotify) {

  var defaultLimit = 5;

  $scope.results = {
    limit: defaultLimit
  };

  $scope.maxResults = function() {
    if (!$scope.search || !$scope.data) {
      return false;
    }
    return ['artists', 'albums', 'tracks'].reduce(function(sum, what) {
      return sum + $scope.data[what].items.length;
    }, 0);
  };

  $scope.$watch('search', function(search) {
    if (!search) {
      return;
    }
    doSearch(search);
  });

  function search(query) {
    $scope.data = null;

    Spotify.search(query, 'album,artist,track').then(function(data) {
      $scope.results.limit = defaultLimit;
      $scope.data = data;
    });
  }

  var doSearch = _.throttle(search, 750);



});
