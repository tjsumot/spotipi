angular.module('spSpotify', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'spotify']);

angular.module('spSpotify').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('spotify', {
      url: '/spotify',
      templateUrl: 'sp-spotify/partial/sp-spotify-home/sp-spotify-home.html'
    });

    $stateProvider.state('spotify.search', {
        url: '/search',
        templateUrl: 'sp-spotify/partial/search/search.html'
    });

    /* Add New States Above */

    $urlRouterProvider.when('/spotify', '/spotify/search');
});

