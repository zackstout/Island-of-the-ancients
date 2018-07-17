import {
  Grid
} from '../public/scripts/client_modules/classes/Grid.js';


// This test is now failing because I changed the grid constructor *not* to generate its own array of cells on creation.

var assert = require('assert');

const grid = new Grid(100, 100, 2, 2);

describe("selectedFeature(cell,edgeDistances)", function () {
  it("should return an edge when a click is close to one edge", function () {
    const clickNearEdge = {
      x: 77,
      y: 52
    };
    const cell = grid.getClickedCell(clickNearEdge);
    const distancesNearEdge = grid.distanceToEdges(cell,clickNearEdge);
    assert.deepEqual(grid.selectedFeature(
      cell,
      distancesNearEdge
    ), {
      feature: 'edge',
      location: [ {x: 1, y: 1}, { x: 2, y: 1 } ]
    });
  });
});
