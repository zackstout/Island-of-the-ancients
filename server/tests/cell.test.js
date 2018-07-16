
import { Cell } from '../public/scripts/client_modules/Cell.js';

var assert = require('assert');

describe('getVertices', function() {
  it('should have four vertices', function() {
    assert.equal(new Cell(1, 1, 'iron').computeVertices().length, 4);
  });

});
