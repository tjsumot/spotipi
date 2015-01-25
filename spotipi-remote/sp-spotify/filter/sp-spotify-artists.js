angular.module('spSpotify').filter('spSpotifyArtists', function() {
	return function(input, arg) {
    if (!input || !input.reduce) {
      return input;
    }

    return input.reduce(function(memo, artist) {
      if (!memo) {
        return artist.name;
      }
      return memo + ', ' + artist.name;
    }, false);

	};
});
