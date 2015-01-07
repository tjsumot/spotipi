angular.module('spHome').controller('SpHomeCtrl', [
  '$scope', 'spSpotify',
  function($scope, spSpotify) {
  
    spSpotify.onRun($scope, function(data) {
      $scope.data = data;
    });

  }
]);
