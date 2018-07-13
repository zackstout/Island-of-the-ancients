
const resources = ["stone", "iron", "gem"];

import { Cell } from './Cell.js';

export function Grid(h, w, numCellsH, numCellsW) {
  this.numCellsH = numCellsH;
  this.numCellsW = numCellsW;
  this.cell_height = h / numCellsH;
  this.cell_width = w / numCellsW;
  this.cells = [];

  this.generateCells = function() {
    let cells = [];
    for (let i=0; i < this.numCellsW; i++) {
      for (let j=0; j < this.numCellsH; j++) {
        const rarity = 27;
        let random_int = Math.floor(Math.random() * rarity);
        let resource;

        if (random_int === 0) {
          resource = resources[2];
        } else if (random_int < Math.ceil(rarity/2)) {
          resource = resources[0];
        } else {
          resource = resources[1];
        }

        // let resource = Math.random() > 0.5 ? resources[0] : resources[1];
        let cell = new Cell(i, j, resource);
        cell.vertices = cell.computeVertices(); // Not sure this is needed

        cells.push(cell);
      }
    }
    this.cells = cells;
  };

  // Grab the cell from the grid array at a given xy-position:
  this.findCell = function(x, y) {
    return this.cells[x * this.numCellsW + y];
  };

  this.generateCells();
}
