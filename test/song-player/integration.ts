import { NoteSongNode, SongTransformationCollection, SongTree }
 from '../../src/song-tree'
import { SongPlayer, PlayNode } from '../../src/song-player'
import { AudioEnv, AudioNodeChain } from '../../src/audio-tree'

import 'mocha'
import { assert } from 'chai'
import * as TypeMoq from 'typemoq'

import { getSongNodeMock, getAudioMock, getAudioNodeChainMock } from './mocks'

/**
 * Build a SongTree with several types of transformations. Verify that
 * the nodes are played at the correct times.
 */
describe('song-player integration test', () => {
  it('should play the correct notes at the correct times', () => {

    let t0 = new SongTransformationCollection(1, 1, 0, 1);

    let t1 = new SongTransformationCollection(0, 1, 0, 1);
    let t2 = new SongTransformationCollection(3, 2, 6, 1);

    let t3 = new SongTransformationCollection(0, 1, 0, 1);
    let t4 = new SongTransformationCollection(1, 1, 6, 1);
    let t5 = new SongTransformationCollection(2, 1, 0, 1);

    let e0 = getAudioNodeChainMock([{
      start: 1, // These are expected values for AudioNodeChain's `schedule`.
      end: 5.5,
      steps: 0
    }]);

    let e1 = getAudioNodeChainMock([{
      start: 1,
      end: 4,
      steps: 0
    }]);

    let e2 = getAudioNodeChainMock([{
      start: 4,
      end: 5.5,
      steps: 6
    }]);

    let e3 = getAudioNodeChainMock([{
      start: 1,
      end: 2,
      steps: 0
    }, {
      start: 4, // This is attached to two parents, so it will get played twice.
      end: 4.5,
      steps: 6
    }]);

    let e4 = getAudioNodeChainMock([{
      start: 2,
      end: 3,
      steps: 6
    }, {
      start: 4.5,
      end: 5,
      steps: 12
    }]);

    let e5 = getAudioNodeChainMock([{
      start: 3,
      end: 4,
      steps: 0
    }, {
      start: 5,
      end: 5.5,
      steps: 6
    }]);

    let s0 = getSongNodeMock(new NoteSongNode(t0), e0);

    let s1 = getSongNodeMock(new NoteSongNode(t1), e1);
    let s2 = getSongNodeMock(new NoteSongNode(t2), e2);

    let s3 = getSongNodeMock(new NoteSongNode(t3, 1), e3);
    let s4 = getSongNodeMock(new NoteSongNode(t4, 1), e4);
    let s5 = getSongNodeMock(new NoteSongNode(t5, 1), e5);

    s1.addChild(s3);
    s1.addChild(s4);
    s1.addChild(s5);

    s2.addChild(s3);
    s2.addChild(s4);
    s2.addChild(s5);

    s0.addChild(s1);
    s0.addChild(s2);

    let songTree = new SongTree(s0);
    let playTree = new PlayNode(songTree.root);
    let songPlayer = new SongPlayer(
     getAudioMock([true])); // Schedule all notes immediately.

    songPlayer.playInterval(playTree);

    e0.verifyAll();
    e1.verifyAll();
    e2.verifyAll();
    e3.verifyAll();
    e4.verifyAll();
    e5.verifyAll();
  });
});
