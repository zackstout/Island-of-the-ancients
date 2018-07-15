
var Player = require('./Player.js');

// Takes in two user Ids and creates a new Game:
function Game(p1, p2) {
  this.player1 = new Player(p1, [0, 0]);
  this.player2 = new Player(p2, [0, 0]);
  this.grid = new Grid(500, 500, 12, 12);

  this.historyOfMoves = [];

  this.boardState = {
    cells: this.grid.cells,
    occupied_vertices: [],
    occupied_edges: []
  };

  this.generateNexuses = function() {

  };


}

module.exports = Game;
