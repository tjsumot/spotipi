angular.module('spSpotify').directive('spSpotifyNow', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
      track: '='
		},
		templateUrl: 'sp-spotify/directive/sp-spotify-now/sp-spotify-now.html',
		link: function(scope, element, attrs, fn) {


		}
	};
});
