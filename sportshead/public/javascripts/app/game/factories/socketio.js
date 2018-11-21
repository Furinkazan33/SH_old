var cetelemHeadsGameFactories = angular.module('cetelemHeadsGameFactories');

cetelemHeadsGameFactories.factory('SocketIO', function() {
  var socket = io.connect(window.location.hostname+':'+window.location.port);
  return function() {
    return socket;
  }();
});
