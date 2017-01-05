import { SongTransformationCollection }
 from '../../src/song-tree/song-transformation-collection'
import { SongTransformationStack }
 from '../../src/song-player/song-transformation-stack'

import 'mocha'
import { assert } from 'chai'

describe('Transformation', function() {
  describe('absolute', function() {
    it('should run all transformation functions', function() {
      // Create three transformations, starting at 3s at 2x speed.
      let a = new SongTransformationCollection(3, 2);
      let b = new SongTransformationCollection(3, 2);
      let c = new SongTransformationCollection(3, 2);

      // Create a stack with all of the transformations.
      let stack = new SongTransformationStack().add(a).add(b).add(c);

      // 3 + 1.5 + 0.75 since each "child transformation" goes at 2x speed.
      assert.equal(c.time.absolute(stack.getSlice('time')), 5.25);
    });
  });
});
