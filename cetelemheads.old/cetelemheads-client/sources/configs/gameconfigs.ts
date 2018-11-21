module cetelemheads.configs {
  export class GameConfigs {
    public static RESOLUTION = { "x": 1200, "y": 750 };

    public static CONTACT_MATERIALS = {
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

    public static MATERIAL_CONFIGS = {
      worlds:   {collideWith: []},
      stages:   {collideWith: []},
      pitchs:   {collideWith: []},
      events:   {collideWith: []},
      goals:    {collideWith: []},
      areas:    {collideWith: []},
      displays: {collideWith: []},
      balls:    {collideWith: ['worlds', 'stages', 'balls']},
      feets:    {collideWith: ['stages', 'balls']},
      players:  {collideWith: ['worlds', 'stages', 'balls', 'players']},
    };

    public static GROUP_CONFIGS = {
      stages:   {addToStage: false, enableBody: true},
      pitchs:   {addToStage: false, enableBody: false},
      balls:    {addToStage: false, enableBody: true},
      players:  {addToStage: false, enableBody: true},
      feets:    {addToStage: false, enableBody: true},
      events:   {addToStage: false, enableBody: true},
      goals:    {addToStage: false, enableBody: false},
      areas:    {addToStage: true,  enableBody: true},
      displays: {addToStage: false, enableBody: false},
      worlds:   {addToStage: false, enableBody: false}
    }
  }
}
