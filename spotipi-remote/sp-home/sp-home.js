angular.module('spHome', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'spApi', 'spotify']);

angular.module('spHome').config(function($stateProvider) {

    $stateProvider.state('sp-home', {
        url: '/home',
        templateUrl: 'sp-home/partial/sp-home/sp-home.html'
    });
    /* Add New States Above */

});

