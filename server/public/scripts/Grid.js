
const resources = ["stone", "iron"];

export function Grid(h, w, numCellsH, numCellsW) {

  this.numCellsH = numCellsH;
  this.numCellsW = numCellsW;

  this.cell_height = h / numCellsH;
  this.cell_width = w / numCellsW;

  this.generateSquares = function() {
    let squares = [];
    for (let i=0; i < this.numCellsW; i++) {
      for (let j=0; j < this.numCellsH; j++) {
        let resource = Math.random() > 0.5 ? resources[0] : resources[1];
        let square = {x: i, y: j, resource: resource};

        squares.push(square);
      }
    }
    this.squares = squares;
    // return squares;
  };

  this.generateSquares();
}

// module.exports = Grid;
