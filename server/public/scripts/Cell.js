
export function Cell(x, y, resource) {
  this.x = x;
  this.y = y;
  this.resource = resource;
  this.vertices = [];
  this.edges = [];

  // ===============================================================================================

  // These need an occupant slot. Or maybe we don't need this at all.
  this.computeVertices = function() {
    const UL = {pos: 'UL', x: this.x    , y: this.y    };
    const UR = {pos: 'UR', x: this.x + 1, y: this.y    };
    const BL = {pos: 'BL', x: this.x    , y: this.y + 1};
    const BR = {pos: 'BR', x: this.x + 1, y: this.y + 1};
    this.vertices = [UL, UR, BL, BR];
    return this.vertices;
  };

  // ===============================================================================================

  // Is it going to become important to have a convention for ordering vertices in an edge? Always L to R and U to D? That would be arduous, should automate it.
  this.computeEdges = function() {
    const top    = [this.vertices[0], this.vertices[1]];
    const right  = [this.vertices[1], this.vertices[3]];
    const bottom = [this.vertices[2], this.vertices[3]];
    const left   = [this.vertices[0], this.vertices[2]];
    this.edges   = [top, right, bottom, left];
    return this.edges;
  };

  // ===============================================================================================

  this.computeVertices();
  this.computeEdges();
}

// module.exports = Cell;
