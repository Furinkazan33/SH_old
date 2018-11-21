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

    client.sendPacket('game.start', {
      configs: this._game._configs,
      players: this._game._players,
      goals: this._game._goals,
      balls: this._game._balls,
      displays: this._game._displays,
      pitches: this._game._pitches
    });

    client.handlePacket('game.player.ready', that.onGamePlayerReady, this);
    client.handlePacket('game.player.scores', that.onGamePlayerScores, this);
    client.handlePacket('game.player.tins', that.onGamePlayerTins, this);
  },

  destroyAll: function() {
    for (var index in this._clients) {
      var client = this._clients[index];
      client.socket.removeAllListeners('game.player.ready');
      client.socket.removeAllListeners('game.player.scores');
      client.socket.removeAllListeners('game.player.tins');
    }
  },

  onGamePlayerReady: function(client, data) {
    client.sendPacket('game.countdown.start', {
      count: 3
    });
  },
  onGamePlayerScores: function(client, data) {
    if (data.timestamp < (this._game._lastScoreTimestamp+2000)) {
      // 2 packets for the same goal ? It's impossible to scores 2 time in less than 2 seconds (even for VBAR)
      return;
    }

    var goal = this._game.getGoalByUID(data.goalUid);
    if (goal == null) {
      console.log('Error [GameMgr#onGamePlayerScores]: Goal {'+data.goalUid+'} non-existant');
      return;
    }

    this._game._lastScoreTimestamp = data.timestamp;

    var scoreTeam = goal.team == 'left' ? 'right' : 'left';
    this._game._scores[scoreTeam]++;

    var display = this._game.getDisplayByName(scoreTeam);
    if (display != null) {
      display.text = this._game._scores[scoreTeam];
      client.sendPacket('game.display.update', display);
    }

    client.sendPacket('game.reset');

    var winner = this._game.getWinner();
    if (winner != null) {
      client.sendPacket('game.finish', {
        winner: winner
      });
      return;
    }

    client.sendPacket('game.countdown.start', {
      count: 3
    });
  },
  onGamePlayerTins: function(client, data) {
    var goal = this._game.getGoalByUID(data.goalUid);
    if (goal == null) {
      console.log('Error [GameMgr#onGamePlayerScores]: Goal {'+data.goalUid+'} non-existant');
      return;
    }

    this._game._scores[goal.team]--;
    var display = this._game.getDisplayByName(goal.team);
    if (display != null) {
      display.text = this._game._scores[goal.team];
      client.sendPacket('game.display.update', display);
    }
  }
};


module.exports = GameMgr;
