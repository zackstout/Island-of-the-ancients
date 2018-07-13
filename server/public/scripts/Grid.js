
const resources = ["stone", "iron", "gem"];

import { Cell } from './Cell.js';

import { getDistance } from './Vertex.js';

export function Grid(h, w, numCellsH, numCellsW) {
  this.numCellsH = numCellsH;
  this.numCellsW = numCellsW;
  this.cell_height = h / numCellsH;
  this.cell_width = w / numCellsW;
  this.cells = [];

  this.generateCells = function() {
    for (let i=0; i < this.numCellsW; i++) {
      for (let j=0; j < this.numCellsH; j++) {
        const rarity = 27;
        const random_int = Math.floor(Math.random() * rarity);
        let resource;

        if (random_int === 0) {
          resource = resources[2];
        } else if (random_int < Math.ceil(rarity/2)) {
          resource = resources[0];
        } else {
          resource = resources[1];
        }

        // let resource = Math.random() > 0.5 ? resources[0] : resources[1];
        const cell = new Cell(i, j, resource);
        this.cells.push(cell);
      }
    }
  };

  this.getClickedCell = function(point) {
    const cell_x = Math.floor(point.x / this.cell_width);
    const cell_y = Math.floor(point.y / this.cell_height);
    const cell = this.findCell(cell_x, cell_y);
    return cell;
  };


  this.getNearestVertex = function (point) {
    const cell = this.getClickedCell(point);

    const vertices = cell.vertices.map(v => {
      const res = {x: v.x * this.cell_width, y: v.y * this.cell_height};
      return res;
    });

    let minDist = 1000;
    let closestVertex = {};

    vertices.forEach(v => {
      const d = getDistance(point, v);
      if (d < minDist) {
        minDist = d;
        closestVertex.x = Math.round(v.x / this.cell_width);
        closestVertex.y = Math.round(v.y / this.cell_height);
      }
    });

    console.log(cell, closestVertex);
    return closestVertex;
  };


  this.getNearestEdge = function(point) {
    const cell = this.getClickedCell(point);
    let minDist = 1000;
    let closestEdge = [];

    cell.edges.forEach(edge => {
      const w = this.cell_width;
      const h = this.cell_height;
      const midpoint = {
        x: w * edge[0].x + w/2 * (edge[1].x - edge[0].x),
        y: h * edge[0].y + h/2 * (edge[1].y - edge[0].y)
      }; // These should always be positive if we stick to LR/UD convention for edges.

      const d = getDistance(point, midpoint);

      if (d < minDist) {
        minDist = d;
        closestEdge = edge;
      }
    });

    console.log(cell, closestEdge);
    return closestEdge;
  };


  // Grab the cell from the grid array at a given xy-position:
  this.findCell = function(x, y) {
    return this.cells[x * this.numCellsW + y];
  };

  this.generateCells();
}
