import { NoteSongNode, SongTransformationCollection } from '../../src/song-tree'
import { PlayNode } from '../../src/song-player/play-node'
import { SongTransformationStack }
 from '../../src/song-player/song-transformation-stack'
import { AudioEnv, AudioNodeChain } from '../../src/audio-tree'
import * as TypeMoq from 'typemoq'

/**
 * Return a SongNode object that returns a mocked no-op AudioNodeChain object.
 */
export function getSongNodeMock(songNode: NoteSongNode | null = null) :
 NoteSongNode {
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
export function getAudioMock(returnValues: boolean[]) : AudioEnv {
  let audioMock: TypeMoq.IMock<AudioEnv> = TypeMoq.Mock.ofInstance(
   new AudioEnv());

  for (let i in returnValues) {
    let value = returnValues[i];
    audioMock.setup(x => x.shouldSchedule(TypeMoq.It.isAnyNumber()))
             .returns(() => value);
  }

  return audioMock.object;
}
