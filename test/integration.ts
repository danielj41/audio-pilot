import { SongTransformationCollection }
 from '../src/song-tree/song-transformation-collection'
import { SongTransformationStack }
 from '../src/song-player/song-transformation-stack'

import 'mocha'
import assert = require('assert');

// TODO: Make this test more useful and add unit tests later. It pulls a lot
// of dependencies across directories, which seems a bit unreliable.
describe('integration test', function() {
  describe('player with transformation stack', function() {
    it('should run all transformation functions', function() {
      let a = new SongTransformationCollection(3, 2, 4, 2);
      let b = new SongTransformationCollection(3, 2, 4, 2);
      let c = new SongTransformationCollection(3, 2, 4, 2);
      let stack = new SongTransformationStack();
      stack.push(a);
      stack.push(b);
      stack.push(c);
      assert.equal(b.time.absolute(stack.getSlice('time')), 5.25);
      assert.equal(b.time.absolute(stack.getSlice('steps')), 7);
    });
  });
});
