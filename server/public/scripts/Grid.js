
const resources = ["stone", "iron"];

import { Cell } from './Cell.js';

export function Grid(h, w, numCellsH, numCellsW) {

  this.numCellsH = numCellsH;
  this.numCellsW = numCellsW;

  this.cell_height = h / numCellsH;
  this.cell_width = w / numCellsW;

  this.generateCells = function() {
    let cells = [];
    for (let i=0; i < this.numCellsW; i++) {
      for (let j=0; j < this.numCellsH; j++) {
        let resource = Math.random() > 0.5 ? resources[0] : resources[1];
        let cell = new Cell(i, j, resource);
        cell.vertices = cell.computeVertices(); // Not sure this is needed

        cells.push(cell);
      }
    }
    this.cells = cells;
  };

  this.findCell = function(x, y) {
    return this.cells[x * this.numCellsW + y];
  };

  this.generateCells();
}
