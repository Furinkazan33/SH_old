var cetelemHeadsGameControllers = angular.module('cetelemHeadsGameControllers');

cetelemHeadsGameControllers.controller('MainMenuController', function($scope, SocketIO) {
  $scope.models = {
    players: {
      amount: 2,
      skins: null
    },
    skins: [{
      id: 'player_italia',
      name: 'Italie'
    }, {
      id: 'player_mathieu',
      name: 'Mathieu Vidalies'
    }, {
      id: 'player_kevin',
      name: 'Kevin Bonnoron'
    }]
  };

  $scope.events = {
    offline: {
      submit: function() {
        SocketIO.emit('lobby.game.start', {
          model: 'offline',
          options: {
            players: {
              amount: $scope.models.players.amount,
              skins: {
                0: 'player_italia',
                1: 'player_italia',
                2: 'player_italia',
                3: 'player_italia'
              }
            },
            events: {
              bonuses: true,
              penalties: true,
              others: true
            },
            goals: {
              tinEnabled: true
            }
          }
        });
      }
    }
  }

  $scope.range = function(n) {
    return new Array(parseInt(n));
  };
});
