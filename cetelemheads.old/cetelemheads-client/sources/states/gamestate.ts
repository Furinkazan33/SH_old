///<reference path="abstractstate.ts"/>

module cetelemheadsClient.states {
  export class GameState extends AbstractState {
    options: any;
    groups : any;
    collisionGroups: any;
    materials: any;

    public init(options): void {
      this.options = options;
      this.groups = {};
      this.collisionGroups = {};
      this.materials = {};
    }

    public preload(): void {
      this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
      this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
      this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
      this.game.physics.p2.restitution = 0.8;
      this.game.physics.p2.gravity.x = this.options.configs.gravity.x;
      this.game.physics.p2.gravity.y = this.options.configs.gravity.y;

      for (let index in cetelemheads.configs.GameConfigs.MATERIAL_CONFIGS) {
        var materialConfig = cetelemheads.configs.GameConfigs.MATERIAL_CONFIGS[index];

        this.materials[index] = this.game.physics.p2.createMaterial(index);
        if (materialConfig['collideWith'].length > 0) {
          for (let collideWith of materialConfig['collideWith']) {
            this.game.physics.p2.createContactMaterial(this.materials[index], this.materials[collideWith], {
              friction: cetelemheads.configs.GameConfigs.CONTACT_MATERIALS['FRICTION'][index+'_'+collideWith],
              restitution: cetelemheads.configs.GameConfigs.CONTACT_MATERIALS['RESTITUTION'][index+'_'+collideWith]
            });
          }
        }
      }

      for (let index in cetelemheads.configs.GameConfigs.GROUP_CONFIGS) {
        let groupConfig = cetelemheads.configs.GameConfigs.GROUP_CONFIGS[index];

        this.groups[index] = this.game.add.group(this.game.world, index, groupConfig.addToStage, groupConfig.enableBody, Phaser.Physics.P2JS);
        this.collisionGroups[index] = this.game.physics.p2.createCollisionGroup();
        // this.groups[index].body.setMaterial(this.materials[index]);
      }

      this.game.physics.p2.setWorldMaterial(this.materials.worlds, true, true, true, true);
      this.game.physics.p2.updateBoundsCollisionGroup();

      this.createStage();
      this.createPitch(this.options.pitch);
    }

    public create(): void {
      this.game.add.sprite(0, 0, 'background');
    }

    public update(): void {

    }

    private createStage(): void {
      let stage = this.groups['stages'].create(cetelemheads.configs.GameConfigs.RESOLUTION.x, cetelemheads.configs.GameConfigs.RESOLUTION.y, 'ground');
      stage.scale.setTo(3, 2);
      //stage.body.addShape(new p2.Box({ width: 60, height: 3 }), 0, 0, 0);
      stage.body.debug = true;
    }

    private createPitch(pitchOptions): void {
      alert('create pitch');
      var pitch = this.groups.pitchs.create(0, 0, '');
      this.game.physics.enable(pitch, Phaser.Physics.P2JS);
      pitch.body.clearShapes();

      for (var index = 0; index < pitchOptions.definition.length; index++) {
        var definition = pitchOptions.definition[index];

        var color = Phaser.Color.createColor(definition.color.red, definition.color.green, definition.color.blue, 0, 0, 0, 0, 0);
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(5, color.color, 0.5);
        graphics.beginFill(color.color);

        if (definition.type == "polygon") {
          graphics.moveTo(definition.points[0][0], definition.points[0][1]);
          for (var j = 1; j < definition.points.length; j++) {
            graphics.lineTo(definition.points[j][0], definition.points[j][1]);
          }

          pitch.body.addPolygon(null, definition.points);
        }
        else if (definition.type == "convex") {
          graphics.moveTo(definition.vertices[0][0], definition.vertices[0][1]);
          for (var j = 1; j < definition.vertices.length; j++) {
            graphics.lineTo(definition.vertices[j][0], definition.vertices[j][1]);
          }

          var vertices = [];
          for (var a = 0; a < definition.vertices.length; a++) {
            vertices[a] = [];
            vertices[a][0] = (definition.vertices[a][0]-600) / -20;
            vertices[a][1] = (definition.vertices[a][1]-122) / -20;
          }

          var convex = new p2.Convex({ vertices: vertices } );
          pitch.body.addShape(convex, 0, 0, 0);
        }
        else if (definition.type == "circle") {
          graphics.moveTo(0, 0);
          graphics.drawCircle(definition.x, definition.y, 40*definition.diameter);

          var circle = new p2.Circle({ radius: definition.diameter } );
          pitch.body.addShape(circle, definition.x-600, definition.y-122, 0);
        }

        graphics.endFill();

        this.groups.pitchs.add(graphics);
      }

      pitch.body.immovable = true;
      pitch.body.moves = false;
      pitch.body.setMaterial(this.materials.stages);
      pitch.body.setCollisionGroup(this.collisionGroups.stages);
      pitch.body.collides([this.collisionGroups.players, this.collisionGroups.balls]);
      pitch.body.static = true;


      if (this.options.configs.debug.pitch) {
        pitch.body.debug = true;
      }

      return pitch;
    }
  }
}
