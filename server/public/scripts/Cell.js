
import { computeVertices, computeEdges } from './functions.js';

export function Cell(x, y, resource) {
  this.x = x;
  this.y = y;
  this.resource = resource;

  // ===============================================================================================

  this.vertices = computeVertices(this);
  this.edges = computeEdges(this);
}
