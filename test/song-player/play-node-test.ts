import { NoteSongNode, SongTransformationCollection } from '../../src/song-tree'
import { PlayNode } from '../../src/song-player/play-node'
import { SongTransformationStack }
 from '../../src/song-player/song-transformation-stack'
import { AudioEnv, AudioNodeChain } from '../../src/audio-tree'

import 'mocha'
import { assert } from 'chai'
import * as TypeMoq from 'typemoq'

import { getSongNodeMock, getAudioMock } from './mocks'

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
