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

      let playTree = new PlayNode(root);

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

  describe('duration', () => {
    it('should infer parent durations from children', () => {
      let root = new NoteSongNode(new SongTransformationCollection(0));
      let node1 = new NoteSongNode(new SongTransformationCollection(1));
      let node2 = new NoteSongNode(new SongTransformationCollection(0), 2);
      let node3 = new NoteSongNode(new SongTransformationCollection(0), 4);

      root.addChild(node1);
      root.addChild(node2);

      node1.addChild(node3);

      let playTree = new PlayNode(root);

      assert.equal(playTree.duration, 5);
      assert.equal(playTree.children[0].duration, 4);
      assert.equal(playTree.children[1].duration, 2);
    });
  })
});

/**
 * Return a SongNode object that returns a mocked no-op AudioNodeChain object.
 */
function getSongNodeMock(songNode: NoteSongNode | null = null) : NoteSongNode {
  let audioNodeChainMock: TypeMoq.IMock<AudioNodeChain> =
   TypeMoq.Mock.ofInstance(new AudioNodeChain(<any>1));

  audioNodeChainMock.setup(x => x.schedule(TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny(),
                                           TypeMoq.It.isAny()));

  songNode = songNode || new NoteSongNode(new SongTransformationCollection(0));
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
