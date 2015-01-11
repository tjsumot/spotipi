angular.module('spotipiRemote', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'spHome', 'spApi', 'spSpotify']);

angular.module('spotipiRemote').config(function($stateProvider, $urlRouterProvider) {

  /* Add New States Above */
  $urlRouterProvider.otherwise('/spotify');

});

angular.module('spotipiRemote').constant('spServerAddress', 'http://' + window.location.hostname + ':3000');


angular.module('spotipiRemote').run(function($rootScope) {

  $rootScope.safeApply = function(fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

});
