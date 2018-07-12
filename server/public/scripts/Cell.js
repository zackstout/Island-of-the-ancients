
export function Cell(x, y, resource) {
  this.x = x;
  this.y = y;
  this.resource = resource;
  this.vertices = [];
  this.edges = [];

  this.computeVertices = function() {
    const UL = {x: this.x    , y: this.y    };
    const UR = {x: this.x + 1, y: this.y    };
    const LL = {x: this.x    , y: this.y + 1};
    const LR = {x: this.x + 1, y: this.y + 1};
    return [UL, UR, LL, LR];
  };

  this.computeEdges = function() {

  };
}
