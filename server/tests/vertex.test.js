
import { getDistance } from '../public/scripts/Vertex.js';

var assert = require('assert');

describe('getDistance', function() {
  it('should return 1 for adjacent points', function() {
    assert.equal(getDistance({x:0, y:0}, {x:1, y:0}), 1);
  });

  it('should have three digits after decimal', function() {
    assert.equal(getDistance({x:0, y:0}, {x:1, y:1}), Math.pow(2, 0.5).toFixed(3));
  });
});
