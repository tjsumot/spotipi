describe('spSpotifyArtists', function() {

	beforeEach(module('spSpotify'));

	it('should display multiple artists', inject(function($filter) {

    var filter = $filter('spSpotifyArtists');

		expect(filter([
          {
            name: 'X'
          },
          {
            name: 'Y'
          }
    ])).toEqual('X, Y');

	}));

	it('should display single artist', inject(function($filter) {

    var filter = $filter('spSpotifyArtists');

		expect(filter([
          {
            name: 'X'
          }
    ])).toEqual('X');

	}));


});
