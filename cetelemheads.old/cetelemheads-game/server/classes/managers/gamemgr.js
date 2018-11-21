var Utils = require('../../../lib/utils');

var GameMgr = function(game, clients) {
  this._game = game;
  this._clients = clients;

  for (var index in clients) {
    this.handleClient(clients[index]);
  }
};

GameMgr.prototype = {
  handleClient: function(client) {
    var that = this;

    client.handlePacket('disconnect', this.onDisconnect, this);

    client.handlePacket('game.ping', this.onGamePing, this);
    client.handlePacket('game.player.ready', this.onGamePlayerReady, this);
    client.handlePacket('game.player.scores', this.onGamePlayerScores, this);
    client.handlePacket('game.player.tins', this.onGamePlayerTins, this);
    client.handlePacket('game.player.position.update', this.onGamePlayerPositionUpdate, this);
    client.handlePacket('game.balls.position.update', this.onGameBallsPositionUpdate, this);

    client.sendPacket('state.game.start', {
      configs: this._game._configs,
      players: this._game._players,
      goals: this._game._goals,
      balls: this._game._balls,
      displays: this._game._displays,
      skins: this._game._skinDatas,
      pitch: this._game._pitch,
    });

    Utils.timer.repeat({
      tickCallback: function() {
        var updatePacket = {
          balls: [],
          players: []
        };

        for (var index = 0; index < this._game._balls.length; index++) {
          var ball = this._game._balls[index];

          updatePacket.balls.push({
            uid: ball.uid,
            position: ball.position,
            velocity: ball.velocity
          })
        }

        for (var index = 0; index < this._game._players.length; index++) {
          var player = this._game._players[index];

          updatePacket.players.push({
            uid: player.uid,
            position: player.position,
            velocity: player.velocity,
            isShooting: player.isShooting
          })
        }

        client.sendPacket('game.state.update', updatePacket);
      },
      interval: 1000/60,
      delay: 0,
      context: this
    });
  },

  destroyAll: function() {
    for (var index in this._clients) {
      var client = this._clients[index];
      client.socket.removeAllListeners('game.ping');
      client.socket.removeAllListeners('game.player.ready');
      client.socket.removeAllListeners('game.player.scores');
      client.socket.removeAllListeners('game.player.tins');
      client.socket.removeAllListeners('game.positions.update');
    }
  },

  onDisconnect: function(client, data) {
    this._game.removeClient(client);

    if (this._game._clients.length % 2 > 0) {
      this._resetGame();
      this._finishGame(null);
    }
  },

  onGamePing: function(client, data) {
    client.sendPacket('game.pong', data);
  },
  onGamePlayerReady: function(client, data) {
    this._startCountdown(3);
  },
  onGamePlayerScores: function(client, data) {
    if (data.timestamp < (this._game._lastScoreTimestamp+2000)) {
      // 2 packets for the same goal ? It's impossible to scores 2 time in less than 2 seconds (even for VBAR)
      return;
    }

    var goal = this._game.findGoalByUid(data.goalUid);
    if (goal == null) {
      console.log('Error [GameMgr#onGamePlayerScores]: Goal {'+data.goalUid+'} non-existant');
      return;
    }

    this._game._lastScoreTimestamp = data.timestamp;

    var scoreTeam = goal.team == 'left' ? 'right' : 'left';
    this._game._scores[scoreTeam]++;

    var display = this._game.findDisplayByName(scoreTeam);
    if (display != null) {
      display.text = this._game._scores[scoreTeam];
      this._updateDisplay(display);
    }

    this._resetGame();

    var winner = this._game.getWinner();
    if (winner != null) {
      this._finishGame(winner);
      return;
    }


    this._startCountdown(3);
  },
  onGamePlayerTins: function(client, data) {
    var goal = this._game.findGoalByUid(data.goalUid);
    if (goal == null) {
      console.log('Error [GameMgr#onGamePlayerScores]: Goal {'+data.goalUid+'} non-existant');
      return;
    }

    this._game._scores[goal.team]--;
    var display = this._game.findDisplayByName(goal.team);
    if (display != null) {
      display.text = this._game._scores[goal.team];
      this._updateDisplay(display);
    }
  },
  onGamePlayerPositionUpdate: function(client, data) {
    var player = this._game.findPlayerByUid(data.uid);
    if (player == null) {
      console.log('ERROR');
      return;
    }

    player.position = data.position;
    player.velocity = data.velocity;
    player.isShooting = data.isShooting
  },

  onGameBallsPositionUpdate: function(client, data) {
    for (var index = 0; index < data.balls.length; index++) {
      var ballUpdated = data.balls[index];
      var ball = this._game.findBallByUid(ballUpdated.uid);
      if (ball == null) {
        console.log('ERROR');
        continue;
      }

      ball.position = ballUpdated.position;
      ball.velocity = ballUpdated.velocity;
    }
  },

  _startCountdown: function(count) {
    Utils.timer.repeat({
      tickCallback: function() {
        this._setCountDown(count--);
      },
      endCallback: function() {
        this._releaseGame();
      },
      interval: 1000,
      times: 3,
      delay: 0,
      context: this
    });
  },

  _updateDisplay: function(display) {
    this._game.sendToAll('game.display.update', display);
  },
  _setCountDown: function(count) {
    this._game.sendToAll('game.countdown.set', {
      value: count
    });
  },
  _resetGame: function() {
    this._game.sendToAll('game.reset');
  },
  _releaseGame: function() {
    var ballVelocities = [];
    for (var index = 0; index < this._game._balls.length; index++) {
      ballVelocities.push({
        velocity: {
          x: Utils.random.nextInt(-25, 25) * 10,
          y: 0
        }
      })
    }

    this._game.sendToAll('game.release', {
      balls: ballVelocities
    });
  },
  _finishGame: function(winner) {
    this._game.sendToAll('game.finish', {
      winner: winner
    });
  }
};


module.exports = GameMgr;
