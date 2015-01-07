/* global io:true */

angular.module('spApi').factory('spApi', [
  '$q', 'socketFactory', 'spServerAddress',
  function($q, socketFactory, serverAddress) {

    return {
      create: function(name) {
        var ioSocket = io.connect(serverAddress + '/' + name);
        var prefix = name + '~';
        var socket = socketFactory({
          prefix: prefix,
          ioSocket: ioSocket
        });

        return {
          // We wrap emit invocations into promises.
          emit: function(ev, data) {
            var defer = $q.defer();
            socket.emit(prefix + ev, data, function(data) {
              defer.resolve(data);
            });
            return defer.promise;
          },
          // Because socket lib is lacking proper cleanup
          // when scope is destroyed we don't expose `on` method
          on: function(scope, ev, listener) {
            socket.on(prefix + ev, listener);
            scope.$on('$destroy', function() {
              socket.removeListener(prefix + ev, listener);
            });
          }
        };
      }

    };
  }
]);
