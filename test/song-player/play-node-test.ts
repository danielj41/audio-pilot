import { NoteSongNode, SongTransformationCollection } from '../../src/song-tree'
import { PlayNode } from '../../src/song-player/play-node'
import { SongTransformationStack }
 from '../../src/song-player/song-transformation-stack'
import { AudioEnv, AudioNodeChain } from '../../src/audio-tree'

import 'mocha'
import { assert } from 'chai'
import * as TypeMoq from 'typemoq'

describe('PlayNode', () => {
  describe('traverse', () => {
    it('should return a new PlayNode tree', () => {
      // Create a small tree.
      let root = getSongNodeMock();
      let node1 = getSongNodeMock();
      let node2 = getSongNodeMock();

      root.addChild(node1);
      root.addChild(node2);

      let playTree = new PlayNode(root, null);

      // Create an audio player that will schedule the first two nodes, but
      // not the third one.
      let audio = getAudioMock([true, true, false]);

      // Traverse the tree.
      let playTreeAfter = playTree.traverse(new SongTransformationStack(),
       audio);

      // Check that we returned a new tree and didn't mutate the original.
      assert.notEqual(playTree, playTreeAfter);
      // We started with two children.
      assert.equal(playTree.children.length, 2);

      if (playTreeAfter === null) {
        throw new Error('playTreeAfter should not be null');
      }

      // One of them got scheduled and deleted.
      assert.equal(playTreeAfter.children.length, 1);
      // The second child is now the first child.
      assert.equal(playTree.children[1], playTreeAfter.children[0])
    });
  });
});

/**
 * Return a SongNode object that returns a mocked no-op AudioNodeChain object.
 */
function getSongNodeMock() : NoteSongNode {
  let audioNodeChainMock: TypeMoq.IMock<AudioNodeChain> =
   TypeMoq.Mock.ofInstance(new AudioNodeChain(<any>1));

  audioNodeChainMock.setup(x => x.schedule(TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny()));

  let songNode = new NoteSongNode(new SongTransformationCollection(0));
  songNode.getAudioNodeChain = () => audioNodeChainMock.object;

  return songNode;
}

/**
 * Returns a mocked Audio object that returns a sequence of booleans for
 * `shouldSchedule`. All other methods are no-ops.
 * Example:
 *   let a = getAudioMock([true, false]);
 *   a.shouldSchedule(0) // true
 *   a.shouldSchedule(0) // false
 */
function getAudioMock(returnValues: boolean[]) : AudioEnv {
  let audioMock: TypeMoq.IMock<AudioEnv> = TypeMoq.Mock.ofInstance(
   new AudioEnv());

  for (let i in returnValues) {
    let value = returnValues[i];
    audioMock.setup(x => x.shouldSchedule(TypeMoq.It.isAnyNumber()))
             .returns(() => value);
  }

  return audioMock.object;
}
