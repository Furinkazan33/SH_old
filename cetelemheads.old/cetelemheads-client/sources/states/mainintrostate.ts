///<reference path="abstractstate.ts"/>

module cetelemheadsClient.states {
  export class MainIntroState extends AbstractState {
    preload() {
    }

    create() {
      this.game.state.start('main-menu');
    }
  }
}
