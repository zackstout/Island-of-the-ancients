
var helpers = require('../modules/helper_functions.js');
var assert = require('assert');

describe('getDifferenceVertices', function() {
  it('should return the vertex NOT in the subarray', function() {
    // Must use deepEqual because objects with same property values are not identical:
    assert.deepEqual(helpers.getDifferenceVertices([{x:0, y:0}, {x:1, y:0}], [{x:0, y:0}, {x:1, y: 2}, {x:1, y:0}]), [{x:1, y:2}]);
  });

  it('should return an array', function() {
    assert.equal(Array.isArray(helpers.getDifferenceVertices([{x:0, y:0}, {x:1, y:0}], [{x:0, y:0}, {x:1, y: 2}, {x:1, y:0}])), true);
  });
});
