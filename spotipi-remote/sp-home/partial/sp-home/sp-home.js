angular.module('spHome').controller('SpHomeCtrl', [
  '$scope', 'spSpotify',
  function($scope, spSpotify) {
  
    spSpotify.play('spotify:track:2sCXIORj80VAuapMIRZcIy').then(function(data){
      $scope.data = data;
    });

  }
]);
