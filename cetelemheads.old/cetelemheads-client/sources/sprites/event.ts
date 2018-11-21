///<reference path="sprite.ts"/>

module cetelemheads.sprites {
  export class Event extends Sprite {
    public constructor(game: Phaser.Game, $attributes) {
      super(game, $attributes, $attributes.name);

      var gameState = <cetelemheadsClient.states.GameState>game.state.getCurrentState();

      var bonusAreaShape = this.body.setRectangle(75, 75);
      bonusAreaShape.sensor = true;

      this.body.static = true;
      this.body.setCollisionGroup(gameState.collisionGroups.areas);
      this.body.collides([gameState.collisionGroups.balls]);
      this.body.onBeginContact.add((ballBody) => {
        /*game._displayMessage(this.$attributes.message + " - " + this.$attributes.duration + " sec", 3, function() {
          game._displayMessage("");
        });

        var sendPacket = true;
        if (game.options.configs.mode == 'online') {
          if (!this._isPlayerHost(this._getLocalPlayer())) {
            sendPacket = false;
          }
        }

        if (sendPacket) {
          this.game.socket.emit('game.event.take', {
            eventUid: event.$attributes.uid,
            takerUid: ballBody.sprite.$attributes.lastPlayerHit.$attributes.uid
          });
        }

        event.destroy();*/
      });
    }
  }
}
