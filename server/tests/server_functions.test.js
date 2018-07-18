
var helpers = require('../modules/helper_functions.js');
var helper_helpers = require('../modules/helper_helpers.js');

var assert = require('assert');

describe('computeCosts', function() {
  it('should return an object with sum of costs', function() {
    // Must use deepEqual because objects with same property values are not identical:
    assert.deepEqual(helpers.computeCosts([{x:0, y:0}, {x:1, y:0}],
      [[{x:0, y:0}, {x:1, y: 2}], [{x:1, y:0}, {x: 0, y:13}]]),
      {
        iron: 2 * helpers.BUILD_COSTS.sentry.iron + 2 * helpers.BUILD_COSTS.connector.iron,
        stone: 2 * helpers.BUILD_COSTS.sentry.stone + 2 * helpers.BUILD_COSTS.connector.stone
      });
  });
});

describe('computeVertices', function() {
  it('should return an array of four vertices', function() {
    // Must use deepEqual because objects with same property values are not identical:
    assert.deepEqual(helper_helpers.computeVertices({x:10, y:8}),
      [{pos: 'UL', x: 10, y: 8},
      {pos: 'UR', x: 11, y: 8},
      {pos: 'BL', x: 10, y: 9},
      {pos: 'BR', x: 11, y: 9}]);
  });
});

describe('checkForNexus', function() {
  it('should return true when match', function() {
    // Must use deepEqual because objects with same property values are not identical:
    assert.equal(helpers.checkForNexus({x: 1, y: 2}, {x: 1, y:2}), true);
  });

  it('should return false when no match', function() {
    // Must use deepEqual because objects with same property values are not identical:
    assert.equal(helpers.checkForNexus({x: 1, y: 2}, {x: 10, y:2}), false);
  });
});
