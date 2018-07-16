
const resources = ["iron", "stone"];
const FEATURE_DETECTION_THRESHOLD = 10;

import { edgeInArray, vertexInArray, getDistance, computeVertices, computeEdges } from '../functions.js';
import { drawOccupiedVertices, drawOccupiedEdges, drawNumOccupiedEdgesPerCell } from './drawing.js';

export function Grid(w, h, numCellsW, numCellsH) {
  this.numCellsH = numCellsH;
  this.numCellsW = numCellsW;
  this.cell_height = h / numCellsH;
  this.cell_width = w / numCellsW;

  this.cells = [];
  this.occ_vertices = [];
  this.occ_edges = [];

  // ===============================================================================================

  this.getClickedCell = function(point) {
    let cell_x = Math.floor(point.x / this.cell_width);
    let cell_y = Math.floor(point.y / this.cell_height);
    // I don't believe this condition should ever be true -- if numCellsW is 12, max of cell_x should be 11:
    if (cell_x === numCellsW){
      cell_x -= 1;
    }
    if (cell_y === numCellsH) {
      cell_y -= 1;
    }
    const cell = this.findCell(cell_x, cell_y);
    console.log(cell);

    return cell;
  };

  // ===============================================================================================

  this.drawBoardFeature = bf => {
    if (bf.feature != 'cell') {
      this.drawGrid(this.occ_vertices, this.occ_edges);
    }

    const w = this.cell_width;
    const h = this.cell_height;

    if (bf.feature == 'edge') {
      console.log(bf);
      ctx.beginPath();
      ctx.moveTo(bf.location[0].x * w, bf.location[0].y * h);
      ctx.lineTo(bf.location[1].x * w, bf.location[1].y * h);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'green';
      ctx.stroke();
    }

    if (bf.feature == 'vertex') {
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(bf.location.x * w, bf.location.y * h, 10, 0, 2*Math.PI);
      ctx.fill();
    }
  };

  // ===============================================================================================

  this.detectBoardFeature = function(point) {
    const cell = this.getClickedCell(point);
    const edgeDistances = this.distanceToEdges(cell, point);
    // console.log(edgeDistances);
    return this.selectedFeature(cell, edgeDistances);
  };

  // ===============================================================================================

  this.distanceToEdges = function(cell,point){
    const edges = computeEdges(cell);
    return [
      Math.abs(edges[0][0].y * this.cell_height - point.y),
      Math.abs(edges[1][0].x * this.cell_width - point.x),
      Math.abs(edges[2][0].y * this.cell_height - point.y),
      Math.abs(edges[3][0].x * this.cell_width - point.x)
    ];
  };

  // ===============================================================================================

  this.selectedFeature = function(cell,edgeDistances) {
    let result = {
      feature: null,
      location: null
    };
    const threshold = FEATURE_DETECTION_THRESHOLD;

    let featureIndex = [];
    edgeDistances.forEach((d,i) => {
      if (d < threshold) {
        featureIndex.push(i);
      }
    });

    const edges = computeEdges(cell);
    
    if (featureIndex.length === 2) {
      result.feature = "vertex";
      result.location = this.getCommonVertex(edges[featureIndex[0]], edges[featureIndex[1]]);
    } else if (featureIndex.length === 1) {
      result.feature = "edge";
      result.location = edges[featureIndex[0]];
    } else {
      result.feature = "cell";
      result.location = {
        x: cell.x,
        y: cell.y
      };
    }
    return result;
  };

  // ===============================================================================================
  // find a way to do this where it stops immediately if it finds the correct vertex. I guess could use regular for loops.
  this.getCommonVertex = function(edge1,edge2) {
    let result = null;
    edge1.forEach(vertex1 => {
      edge2.forEach(vertex2 => {
        if (vertex1.x === vertex2.x && vertex1.y === vertex2.y) {
          result = vertex1;
        }
      });
    });
    return result;
  };

  // ===============================================================================================
  //
  // this.getNearestVertex = function (point) {
  //   const cell = this.getClickedCell(point);
  //
  //   const cell_verts = computeVertices(cell);
  //   const vertices = cell_verts.vertices.map(v => {
  //     const res = {x: v.x * this.cell_width, y: v.y * this.cell_height};
  //     return res;
  //   });
  //
  //   let minDist = 1000;
  //   let closestVertex = {};
  //
  //   vertices.forEach(v => {
  //     const d = getDistance(point, v);
  //     if (d < minDist) {
  //       minDist = d;
  //       closestVertex.x = Math.round(v.x / this.cell_width);
  //       closestVertex.y = Math.round(v.y / this.cell_height);
  //     }
  //   });
  //
  //   return closestVertex;
  // };

  // ===============================================================================================

  // NOTE: this is wrong for the literal edge cases, i think...:
  // Get the 1 or 2 cells that border a given edge:
  this.getNeighborsOfEdge = function(edge) {
    let res = [];

    // Vertical edge:
    if (edge[0].x == edge[1].x) { // edge[0] is starting vertex, edge[1] is ending vertex.
      if (edge[0].x != 0) {
        res.push(this.findCell(edge[0].x - 1, edge[0].y));
      }
      if (edge[1].x != this.numCellsW - 1) {
        res.push(this.findCell(edge[0].x + 1, edge[0].y));
      }

      // Horizontal edge:
    } else if (edge[0].y == edge[1].y) {
      if (edge[0].y != 0) {
        res.push(this.findCell(edge[0].x, edge[0].y - 1));
      }
      if (edge[1].y != this.numCellsH - 1) {
        res.push(this.findCell(edge[0].x, edge[0].y + 1));
      }
    }

    return res;
  };

  // ===============================================================================================

  this.getOccupiedEdgesOfEachCell = function(occupied_edges) {
    this.cells.forEach(cell => {
      cell.numOccEdges = 0;
      cell.edges.forEach(edge => {
        if (edgeInArray(edge, occupied_edges)) {
          cell.numOccEdges ++;
        }
      });
    });
  };

  // ===============================================================================================

  this.getEachCellsOwner = function(occupied_vertices) {
    this.cells.forEach(cell => {
      cell.numPlay1 = 0;
      cell.numPlay2 = 0;

      for (let i=0; i < cell.vertices.length; i++) {
        const vtx = cell.vertices[i];
        // Not using vertexInArray because it doesn't return position or player.
        for (let j=0; j < occupied_vertices.length; j++) {
          const occ = occupied_vertices[j];
          // We have a match:
          if (vtx.x == occ.x && vtx.y == occ.y) {
            if (occ.occupant == 'P1') {
              cell.numPlay1 ++;
            } else if (occ.occupant == 'P2') {
              cell.numPlay2 ++;
            }
          }
        }
      }

      // Determine the owner:
      if (cell.numPlay1 > cell.numPlay2) {
        cell.owner = 'P1';
      } else if (cell.numPlay2 > cell.numPlay1) {
        cell.owner = 'P2';
      } else if (cell.numPlay1 == 0 && cell.numPlay2 == 0) {
        cell.owner = null;
      } else {
        cell.owner = 'Neutral';
      }

    });
  };

  // ===============================================================================================

  // NOTE: there is a bug here. If two sentries border a field that grows one, player's count will go up by 2.

  this.getNextHarvest = function() {
    this.nextHarvest = {
      player1: {
        "iron": 0,
        "stone": 0,
        "gem": 0
      },
      player2: {
        "iron": 0,
        "stone": 0,
        "gem": 0
      }
    };

    this.cells.forEach(cell => {
      if (cell.owner == 'P1') {
        this.nextHarvest.player1[cell.resource] += cell.numOccEdges;
      }
      if (cell.owner == 'P2') {
        this.nextHarvest.player2[cell.resource] += cell.numOccEdges;
      }
    });

    console.log(this.nextHarvest);
  };

  // ===============================================================================================

  // Check whether two vertices are connected by a path of rods for a given configuration of rods:
  this.areConnectedVertices = function(v1, v2, occupant_edges) {
    // Let's use the fact that each of our edges has orientation either LR or UD.... Or perhaps not:
    // Start at one vertex. Check for rods; if find one, follow it.
    // Hmm. It would be faster to look through the edges of a vertex... No it wouldn't!

    // Loop through all occupant_edges. See if any contain vertex. If they do, run again with new vertex.
    // ISSUE: can't count the edge you just walked through -- otherwise you just walk back and forth!

    // It's starting to feel like we'll need recursive backtracking...But maybe there's a simpler way.


  };

  // ===============================================================================================

  this.handleMouseMove = function(e) {
    const mouse = {x: e.offsetX, y: e.offsetY};
    // console.log(grid.detectBoardFeature(mouse));
    const grid = e.data.grid;
    grid.drawBoardFeature(grid.detectBoardFeature(mouse));
  };

  // ===============================================================================================

  this.handleClick = function(e) {
      const mouse = {x: e.offsetX, y: e.offsetY};
      // console.log(e.data.grid);
      const grid = e.data.grid;
      const cell = grid.getClickedCell(mouse);
      // grid.getNearestVertex(mouse);
      // grid.getNearestEdge(mouse);
      grid.distanceToEdges(cell, mouse);
  };


  this.drawGrid = function(occupied_vertices=[], occupied_edges=[]) {
    // let ctx = window.ctx;

    this.cells.forEach(cell => {
      let col;
      switch(cell.resource) {
        case 'stone': col = 'gray'; break;
        case 'iron': col = 'brown'; break;
        // case 'gem': col = 'plum'; break;
      }
      ctx.fillStyle = col;
      ctx.fillRect(cell.x * this.cell_width, cell.y * this.cell_height, this.cell_width, this.cell_height);
    });

    // Pretty ugly to pass around grid like this...
    drawOccupiedEdges(occupied_edges, this);
    drawOccupiedVertices(occupied_vertices, this);
    // drawNumOccupiedEdgesPerCell(grid); // WE're overloading this function
  };

  // ===============================================================================================

  // Grab the cell from the grid array at a given xy-position:
  this.findCell = function(x, y) {
    return this.cells[x * this.numCellsW + y];
  };

  // ===============================================================================================


  // No longer do we want to do this automatically...Or ever, on the client side.
  // this.generateCells();
}


// ===============================================================================================
