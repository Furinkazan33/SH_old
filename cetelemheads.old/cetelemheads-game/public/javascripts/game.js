var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cetelemheads;
(function (cetelemheads) {
    var configs;
    (function (configs) {
        var GameConfigs = (function () {
            function GameConfigs() {
            }
            GameConfigs.RESOLUTION = { "x": 1200, "y": 750 };
            GameConfigs.CONTACT_MATERIALS = {
                "RESTITUTION": {
                    "players_worlds": 0,
                    "players_stages": 0,
                    "players_players": 0,
                    "players_balls": 0.8,
                    "feets_stages": 0.2,
                    "feets_balls": 1.2,
                    "balls_worlds": 0.7,
                    "balls_stages": 0.7,
                    "balls_balls": 1.2
                },
                "FRICTION": {
                    "players_worlds": 0.2,
                    "players_stages": 0.2,
                    "players_players": 0.2,
                    "players_balls": 0.5,
                    "feets_stages": 0.5,
                    "feets_balls": 25,
                    "balls_worlds": 10,
                    "balls_stages": 10,
                    "balls_balls": 0.2
                }
            };
            GameConfigs.MATERIAL_CONFIGS = {
                worlds: { collideWith: [] },
                stages: { collideWith: [] },
                pitchs: { collideWith: [] },
                events: { collideWith: [] },
                goals: { collideWith: [] },
                areas: { collideWith: [] },
                displays: { collideWith: [] },
                balls: { collideWith: ['worlds', 'stages', 'balls'] },
                feets: { collideWith: ['stages', 'balls'] },
                players: { collideWith: ['worlds', 'stages', 'balls', 'players'] },
            };
            GameConfigs.GROUP_CONFIGS = {
                stages: { addToStage: false, enableBody: true },
                pitchs: { addToStage: false, enableBody: false },
                balls: { addToStage: false, enableBody: true },
                players: { addToStage: false, enableBody: true },
                feets: { addToStage: false, enableBody: true },
                events: { addToStage: false, enableBody: true },
                goals: { addToStage: false, enableBody: false },
                areas: { addToStage: true, enableBody: true },
                displays: { addToStage: false, enableBody: false },
                worlds: { addToStage: false, enableBody: false }
            };
            return GameConfigs;
        }());
        configs.GameConfigs = GameConfigs;
    })(configs = cetelemheads.configs || (cetelemheads.configs = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = this;
            _super.call(this, 1200, 750, Phaser.AUTO);
            this.data = {
                clientUid: null,
                groupUid: null,
            };
            this.socket = io.connect();
            this.socket.on('client.attributes.set', function (data) {
                for (var index in data.attributes) {
                    var name = data.attributes[index].name;
                    var value = data.attributes[index].value;
                    _this.data[index] = value;
                }
            });
            this.gui = new phasergui.PhaserGui(this);
            this.state.add('boot', cetelemheadsClient.states.BootState);
            this.state.add('preload', cetelemheadsClient.states.PreloadState);
            this.state.add('main-intro', cetelemheadsClient.states.MainIntroState);
            this.state.add('main-menu', cetelemheadsClient.states.MainMenuState);
            this.state.add('lobby', cetelemheadsClient.states.LobbyState);
            this.state.add('game', cetelemheadsClient.states.GameState);
            this.state.start('boot');
        }
        return Game;
    }(Phaser.Game));
    cetelemheadsClient.Game = Game;
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Sprite = (function (_super) {
            __extends(Sprite, _super);
            function Sprite(game, $attributes, sprite) {
                if (sprite === void 0) { sprite = ''; }
                _super.call(this, game, $attributes.position.x, $attributes.position.y, sprite);
                this.$attributes = $attributes;
                this.$defaultAttributes = cetelemheads.utils.ObjectUtils.clone(this.$attributes, this.getTransientAttributes());
                this.debug = $attributes.debug;
            }
            Sprite.prototype.getTransientAttributes = function () {
                return [];
            };
            return Sprite;
        }(Phaser.Sprite));
        sprites.Sprite = Sprite;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Ball = (function (_super) {
            __extends(Ball, _super);
            function Ball(game, $attributes) {
                _super.call(this, game, $attributes);
                var gameState = game.state.getCurrentState();
                this.body.setCircle(this.$attributes.radius, 0, 0, 0);
                this.body.mass = 0.2;
                this.body.damping = 0.2;
                this.body.setMaterial(gameState.materials.balls);
                this.body.setCollisionGroup(gameState.collisionGroups.balls);
                this.body.collides([
                    gameState.collisionGroups.balls,
                    gameState.collisionGroups.stages,
                    gameState.collisionGroups.players,
                    gameState.collisionGroups.feets,
                    gameState.collisionGroups.areas
                ]);
            }
            Ball.prototype.getTransientAttributes = function () {
                return ['lastPlayerHit', 'hasScored'];
            };
            return Ball;
        }(sprites.Sprite));
        sprites.Ball = Ball;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Display = (function (_super) {
            __extends(Display, _super);
            function Display(game, $attributes) {
                _super.call(this, game, $attributes);
            }
            return Display;
        }(sprites.Sprite));
        sprites.Display = Display;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Event = (function (_super) {
            __extends(Event, _super);
            function Event(game, $attributes) {
                _super.call(this, game, $attributes, $attributes.name);
                var gameState = game.state.getCurrentState();
                var bonusAreaShape = this.body.setRectangle(75, 75);
                bonusAreaShape.sensor = true;
                this.body.static = true;
                this.body.setCollisionGroup(gameState.collisionGroups.areas);
                this.body.collides([gameState.collisionGroups.balls]);
                this.body.onBeginContact.add(function (ballBody) {
                });
            }
            return Event;
        }(sprites.Sprite));
        sprites.Event = Event;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Goal = (function (_super) {
            __extends(Goal, _super);
            function Goal(game, $attributes) {
                _super.call(this, game, $attributes, 'goal');
                var gameState = game.state.getCurrentState();
                var topBar = gameState.groups.stages.create($attributes.position.x + ($attributes.team == 'right' ? 0 : 61), $attributes.position.y + 5);
                topBar.body.setRectangle(120, 10);
                topBar.body.angle = ($attributes.team == 'right' ? -2 : 2);
                topBar.body.static = true;
                var backBar = gameState.groups.stages.create($attributes.position.x + ($attributes.team == 'right' ? 50 : 15), $attributes.position.y + 100);
                backBar.body.setRectangle(10, 200);
                backBar.body.angle = ($attributes.team == 'right' ? 175 : -175);
                backBar.body.static = true;
                var goalArea = gameState.groups.areas.create($attributes.position.x + ($attributes.team == 'right' ? 12 : 52), $attributes.position.y + 100);
                var goalAreaShape = goalArea.body.setRectangle(80, 180);
                goalAreaShape.sensor = true;
                goalArea.body.setCollisionGroup(gameState.collisionGroups.areas);
                goalArea.body.collides([gameState.collisionGroups.balls]);
            }
            return Goal;
        }(sprites.Sprite));
        sprites.Goal = Goal;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Pitch = (function (_super) {
            __extends(Pitch, _super);
            function Pitch(game, $attributes) {
                _super.call(this, game, $attributes);
                var gameState = game.state.getCurrentState();
                this.body.clearShapes();
                for (var index = 0; index < $attributes.definition.length; index++) {
                    var definition = $attributes.definition[index];
                    var color = Phaser.Color.createColor(definition.color.red, definition.color.green, definition.color.blue, 0, 0, 0, 0, 0);
                    var graphics = this.game.add.graphics(0, 0);
                    graphics.lineStyle(5, color.color, 0.5);
                    graphics.beginFill(color.color);
                    if (definition.type == "polygon") {
                        graphics.moveTo(definition.points[0][0], definition.points[0][1]);
                        for (var j = 1; j < definition.points.length; j++) {
                            graphics.lineTo(definition.points[j][0], definition.points[j][1]);
                        }
                        this.body.addPolygon(null, definition.points);
                    }
                    else if (definition.type == "convex") {
                        graphics.moveTo(definition.vertices[0][0], definition.vertices[0][1]);
                        for (var j = 1; j < definition.vertices.length; j++) {
                            graphics.lineTo(definition.vertices[j][0], definition.vertices[j][1]);
                        }
                        var vertices = [];
                        for (var a = 0; a < definition.vertices.length; a++) {
                            vertices[a] = [];
                            vertices[a][0] = (definition.vertices[a][0] - 600) / -20;
                            vertices[a][1] = (definition.vertices[a][1] - 122) / -20;
                        }
                        var convex = new p2.Convex(vertices, []);
                        this.body.addShape(convex, 0, 0, 0);
                    }
                    else if (definition.type == "circle") {
                        graphics.moveTo(0, 0);
                        graphics.drawCircle(definition.x, definition.y, 40 * definition.diameter);
                        var circle = new p2.Circle(definition.diameter);
                        this.body.addShape(circle, definition.x - 600, definition.y - 122, 0);
                    }
                    graphics.endFill();
                    gameState.groups.pitchs.add(graphics);
                }
            }
            return Pitch;
        }(sprites.Sprite));
        sprites.Pitch = Pitch;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(game, $attributes) {
                _super.call(this, game, $attributes);
                var gameState = game.state.getCurrentState();
                if (this.$attributes.team == 'right') {
                    this.anchor.setTo(0.5, 0.5);
                    this.scale.x = -1;
                }
                this.body.clearShapes();
                this.body.addShape(new p2.Circle(1.3), 2, -7, 0);
                this.body.addShape(new p2.Circle(1.4), 0, 0, 0);
                this.foot = new cetelemheads.sprites.PlayerFoot(game, this.$attributes.position.x, this.$attributes.position.y, this);
                this.body.collideWorldBounds = true;
                this.body.fixedRotation = true;
                this.body.damping = 0.5;
                this.body.mass = 6;
                this.body.setMaterial(gameState.materials.players);
                this.body.setCollisionGroup(gameState.collisionGroups.players);
                this.body.collides([gameState.collisionGroups.stages, gameState.collisionGroups.players]);
                this.body.collides(gameState.collisionGroups.balls, function (playerBody, ballBody) {
                    this.hitBall(playerBody.sprite, ballBody.sprite);
                }, this);
                this.$attributes.isShooting = false;
            }
            return Player;
        }(sprites.Sprite));
        sprites.Player = Player;
        var PlayerFoot = (function (_super) {
            __extends(PlayerFoot, _super);
            function PlayerFoot(game, x, y, player, debug) {
                if (debug === void 0) { debug = false; }
                _super.call(this, game, x, y, 'foot', 0);
                this.exists = true;
                this.body.mass = 1;
                this.body.clearShapes();
                if (player.$attributes.team == 'right') {
                    this.anchor.setTo(0.5, 0.5);
                    this.scale.x = -1;
                    this.body.addPolygon(null, [[8, -10], [25, -10], [25, 12], [0, 12]]);
                    this.constraint = this.game.physics.p2.createRevoluteConstraint(player, [0, -10], this, [-14, -45]);
                    this.constraint.lowerLimit = Phaser.Math.degToRad(0);
                    this.constraint.upperLimit = Phaser.Math.degToRad(90);
                }
                else {
                    this.body.addPolygon(null, [[17, -10], [0, -10], [0, 12], [25, 12]]);
                    this.constraint = this.game.physics.p2.createRevoluteConstraint(player, [-2, -10], this, [14, -45]);
                    this.constraint.lowerLimit = Phaser.Math.degToRad(-90);
                    this.constraint.upperLimit = Phaser.Math.degToRad(0);
                }
                this.constraint.lowerLimitEnabled = true;
                this.constraint.upperLimitEnabled = true;
                this.constraint.enableMotor();
                var multiplicator = (player.$attributes.team == 'right' ? -1 : 1);
                this.constraint.setMotorSpeed((player.$attributes.speeds.shoot * multiplicator / 2) * -1);
            }
            return PlayerFoot;
        }(Phaser.Sprite));
        sprites.PlayerFoot = PlayerFoot;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheads;
(function (cetelemheads) {
    var sprites;
    (function (sprites) {
        var Stage = (function (_super) {
            __extends(Stage, _super);
            function Stage(game, $attributes) {
                _super.call(this, game, $attributes);
                this.scale.setTo(3, 2);
            }
            return Stage;
        }(sprites.Sprite));
        sprites.Stage = Stage;
    })(sprites = cetelemheads.sprites || (cetelemheads.sprites = {}));
})(cetelemheads || (cetelemheads = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var states;
    (function (states) {
        var AbstractState = (function (_super) {
            __extends(AbstractState, _super);
            function AbstractState() {
                _super.apply(this, arguments);
            }
            return AbstractState;
        }(Phaser.State));
        states.AbstractState = AbstractState;
    })(states = cetelemheadsClient.states || (cetelemheadsClient.states = {}));
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var states;
    (function (states) {
        var BootState = (function (_super) {
            __extends(BootState, _super);
            function BootState() {
                _super.apply(this, arguments);
            }
            BootState.prototype.preload = function () {
            };
            BootState.prototype.create = function () {
                this.game.state.start('preload');
            };
            return BootState;
        }(states.AbstractState));
        states.BootState = BootState;
    })(states = cetelemheadsClient.states || (cetelemheadsClient.states = {}));
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var states;
    (function (states) {
        var GameState = (function (_super) {
            __extends(GameState, _super);
            function GameState() {
                _super.apply(this, arguments);
            }
            GameState.prototype.init = function (options) {
                this.options = options;
                this.groups = {};
                this.collisionGroups = {};
                this.materials = {};
            };
            GameState.prototype.preload = function () {
                this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
                this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
                this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
                this.game.physics.startSystem(Phaser.Physics.P2JS);
                this.game.physics.p2.setImpactEvents(true);
                this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
                this.game.physics.p2.restitution = 0.8;
                this.game.physics.p2.gravity.x = this.options.configs.gravity.x;
                this.game.physics.p2.gravity.y = this.options.configs.gravity.y;
                for (var index in cetelemheads.configs.GameConfigs.MATERIAL_CONFIGS) {
                    var materialConfig = cetelemheads.configs.GameConfigs.MATERIAL_CONFIGS[index];
                    this.materials[index] = this.game.physics.p2.createMaterial(index);
                    if (materialConfig['collideWith'].length > 0) {
                        for (var _i = 0, _a = materialConfig['collideWith']; _i < _a.length; _i++) {
                            var collideWith = _a[_i];
                        }
                    }
                }
                for (var index in cetelemheads.configs.GameConfigs.GROUP_CONFIGS) {
                    var groupConfig = cetelemheads.configs.GameConfigs.GROUP_CONFIGS[index];
                    this.groups[index] = this.game.add.group(this.game.world, index, groupConfig.addToStage, groupConfig.enableBody, Phaser.Physics.P2JS);
                    this.collisionGroups[index] = this.game.physics.p2.createCollisionGroup();
                }
                this.game.physics.p2.setWorldMaterial(this.materials.worlds, true, true, true, true);
                this.game.physics.p2.updateBoundsCollisionGroup();
                this.createStage();
                this.createPitch(this.options.pitch);
            };
            GameState.prototype.create = function () {
                this.game.add.sprite(0, 0, 'background');
            };
            GameState.prototype.update = function () {
            };
            GameState.prototype.createStage = function () {
                var stage = this.groups['stages'].create(cetelemheads.configs.GameConfigs.RESOLUTION.x, cetelemheads.configs.GameConfigs.RESOLUTION.y, 'ground');
                stage.scale.setTo(3, 2);
                stage.body.debug = true;
                console.log(stage);
            };
            GameState.prototype.createPitch = function (pitchOptions) {
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
                            vertices[a][0] = (definition.vertices[a][0] - 600) / -20;
                            vertices[a][1] = (definition.vertices[a][1] - 122) / -20;
                        }
                        var convex = new p2.Convex({ vertices: vertices });
                        pitch.body.addShape(convex, 0, 0, 0);
                    }
                    else if (definition.type == "circle") {
                        graphics.moveTo(0, 0);
                        graphics.drawCircle(definition.x, definition.y, 40 * definition.diameter);
                        var circle = new p2.Circle({ radius: definition.diameter });
                        pitch.body.addShape(circle, definition.x - 600, definition.y - 122, 0);
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
            };
            return GameState;
        }(states.AbstractState));
        states.GameState = GameState;
    })(states = cetelemheadsClient.states || (cetelemheadsClient.states = {}));
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var states;
    (function (states) {
        var LobbyState = (function (_super) {
            __extends(LobbyState, _super);
            function LobbyState() {
                _super.apply(this, arguments);
            }
            LobbyState.prototype.preload = function () {
            };
            LobbyState.prototype.create = function () {
            };
            return LobbyState;
        }(states.AbstractState));
        states.LobbyState = LobbyState;
    })(states = cetelemheadsClient.states || (cetelemheadsClient.states = {}));
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var states;
    (function (states) {
        var MainIntroState = (function (_super) {
            __extends(MainIntroState, _super);
            function MainIntroState() {
                _super.apply(this, arguments);
            }
            MainIntroState.prototype.preload = function () {
            };
            MainIntroState.prototype.create = function () {
                this.game.state.start('main-menu');
            };
            return MainIntroState;
        }(states.AbstractState));
        states.MainIntroState = MainIntroState;
    })(states = cetelemheadsClient.states || (cetelemheadsClient.states = {}));
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var states;
    (function (states) {
        var MainMenuState = (function (_super) {
            __extends(MainMenuState, _super);
            function MainMenuState() {
                _super.apply(this, arguments);
            }
            MainMenuState.prototype.preload = function () {
                var resources = [
                    '/templates/main-menu/main.json',
                    '/templates/main-menu/offline.json',
                    '/templates/main-menu/online.json'
                ];
                for (var index = 0; index < resources.length; index++) {
                    this.game.load.json(resources[index], resources[index]);
                }
            };
            MainMenuState.prototype.create = function () {
                var _this = this;
                this.game.socket.on('state.game.start', function (data) {
                    _this.game.state.start('game', true, false, data);
                });
                this.game.socket.on('state.lobby.start', function (data) {
                    _this.game.state.start('lobby', true, false, data);
                });
                var offlineButton = this.game.gui.add.button("Hors-ligne", 50, 50);
                offlineButton.onClick.add(function () {
                    var data = {
                        players: {
                            amount: 2,
                            skins: ['player_italia', 'player_italia', 'player_italia', 'player_italia']
                        },
                        events: {
                            bonuses: true,
                            penalties: true,
                            others: true
                        },
                        goals: {
                            tinEnabled: true
                        },
                        pitch: 'default',
                        mode: 'offline'
                    };
                    _this.game.socket.emit('mainmenu.offlinegame.start', data);
                });
                var onlineButton = this.game.gui.add.button("En-ligne", 50, 100);
            };
            return MainMenuState;
        }(states.AbstractState));
        states.MainMenuState = MainMenuState;
    })(states = cetelemheadsClient.states || (cetelemheadsClient.states = {}));
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheadsClient;
(function (cetelemheadsClient) {
    var states;
    (function (states) {
        var PreloadState = (function (_super) {
            __extends(PreloadState, _super);
            function PreloadState() {
                _super.apply(this, arguments);
            }
            PreloadState.prototype.preload = function () {
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
                var images = [
                    '/images/assets/game/players/kevin.png',
                    '/images/assets/game/players/mathieu.png',
                    '/images/assets/game/players/player.png'
                ];
                for (var index = 0; index < images.length; index++) {
                    this.game.load.image(images[index], images[index]);
                }
            };
            PreloadState.prototype.create = function () {
                this.game.state.start('main-intro');
            };
            return PreloadState;
        }(states.AbstractState));
        states.PreloadState = PreloadState;
    })(states = cetelemheadsClient.states || (cetelemheadsClient.states = {}));
})(cetelemheadsClient || (cetelemheadsClient = {}));
var cetelemheads;
(function (cetelemheads) {
    var utils;
    (function (utils) {
        var ObjectUtils = (function () {
            function ObjectUtils() {
            }
            ObjectUtils.clone = function (object, propertiesNotToClone) {
                if (propertiesNotToClone === void 0) { propertiesNotToClone = []; }
                var clone = {};
                ObjectUtils.merge(object, clone, propertiesNotToClone);
                return clone;
            };
            ObjectUtils.merge = function (fromObject, toObject, transientProperties) {
                if (transientProperties === void 0) { transientProperties = []; }
                for (var index in fromObject) {
                    if (transientProperties != null && transientProperties.length > 0) {
                        if (transientProperties.indexOf(index) != -1) {
                            continue;
                        }
                    }
                    if (typeof fromObject[index] == "object") {
                        toObject[index] = ObjectUtils.clone(fromObject[index]);
                    }
                    else {
                        toObject[index] = fromObject[index];
                    }
                }
            };
            return ObjectUtils;
        }());
        utils.ObjectUtils = ObjectUtils;
    })(utils = cetelemheads.utils || (cetelemheads.utils = {}));
})(cetelemheads || (cetelemheads = {}));
