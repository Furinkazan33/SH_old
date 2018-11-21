///<reference path="abstractstate.ts"/>

module cetelemheadsClient.states {
  export class BootState extends AbstractState {
    preload() {
    }

    create() {
      this.game.state.start('preload');
    }
  }
}
