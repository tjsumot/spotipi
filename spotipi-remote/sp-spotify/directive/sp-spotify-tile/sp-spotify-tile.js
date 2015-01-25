angular.module('spSpotify').directive('spSpotifyTile', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
      onEnqueue: '&',
      onPlay: '&',
      img: '=',
      text: '=',
      subText: '='
		},
		templateUrl: 'sp-spotify/directive/sp-spotify-tile/sp-spotify-tile.html',
		link: function(scope, element, attrs, fn) {


		}
	};
});
