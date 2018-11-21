///<reference path="abstractstate.ts"/>

module cetelemheadsClient.states {

  export class PreloadState extends AbstractState {
    public preload() {
      this.game.load.image('background', 'images/assets/game/stage1200x750.jpg');
      this.game.load.image('ground', 'images/assets/game/ground.png');

      this.game.load.image('BIG_BALL', 'images/assets/game/events/BIG_BALL.png');
      this.game.load.image('BIG_GOAL', 'images/assets/game/events/BIG_GOAL.png');
      this.game.load.image('BIG_HEAD', 'images/assets/game/events/BIG_HEAD.png');
      this.game.load.image('BOMB', 'images/assets/game/events/BOMB.png');
      this.game.load.image('BOUNCY', 'images/assets/game/events/BOUNCY.png');
      this.game.load.image('DEAD_BALL', 'images/assets/game/events/DEAD_BALL.png');
      this.game.load.image('FREEZE_OTHER', 'images/assets/game/events/FREEZE_OTHER.png');
      this.game.load.image('FREEZE_SELF', 'images/assets/game/events/FREEZE_SELF.png');
      this.game.load.image('HIGH_JUMP', 'images/assets/game/events/HIGH_JUMP.png');
      this.game.load.image('LEG_BROKEN_BONUS', 'images/assets/game/events/LEG_BROKEN_BONUS.png');
      this.game.load.image('LEG_BROKEN_MALUS', 'images/assets/game/events/LEG_BROKEN_MALUS.png');
      this.game.load.image('LITTLE_BALL', 'images/assets/game/events/LITTLE_BALL.png');
      this.game.load.image('LITTLE_GOAL', 'images/assets/game/events/LITTLE_GOAL.png');
      this.game.load.image('LITTLE_HEAD', 'images/assets/game/events/LITTLE_HEAD.png');
      this.game.load.image('LOW_JUMP', 'images/assets/game/events/LOW_JUMP.png');
      this.game.load.image('SPEED_DOWN', 'images/assets/game/events/SPEED_DOWN.png');
      this.game.load.image('SPEED_UP', 'images/assets/game/events/SPEED_UP.png');
      this.game.load.image('SUPPORTER', 'images/assets/game/events/SUPPORTER.png');

      this.game.load.image('ball', 'images/assets/game/ballon.png');
      this.game.load.image('foot', 'images/assets/game/foot.png');
      this.game.load.image('goal', 'images/assets/game/goal.png');

      // TODO better
      var images = [
        '/images/assets/game/players/kevin.png',
        '/images/assets/game/players/mathieu.png',
        '/images/assets/game/players/player.png'
      ];
      for (var index = 0; index < images.length; index++) {
        this.game.load.image(images[index], images[index]);
      }
    }

    public create() {
      this.game.state.start('main-intro');
    }
  }
}
