import { NoteSongNode, SongTransformationCollection } from '../../src/song-tree'
import { PlayNode } from '../../src/song-player/play-node'
import { SongTransformationStack }
 from '../../src/song-player/song-transformation-stack'
import { AudioEnv, AudioNodeChain } from '../../src/audio-tree'
import * as TypeMoq from 'typemoq'

type ScheduleParams = {
  start: number,
  end: number,
  steps: number
};

/**
 * Return a SongNode object that returns a mocked no-op AudioNodeChain object.
 */
export function getSongNodeMock(songNode: NoteSongNode | null = null,
 audioNodeChainMock: TypeMoq.IMock<AudioNodeChain> | null = null) :
 NoteSongNode {

  let chainMock = audioNodeChainMock || getAudioNodeChainMock();

  songNode = songNode || new NoteSongNode(new SongTransformationCollection(0));
  songNode.getAudioNodeChain = () => chainMock.object;

  return songNode;
}

/**
 * Create a AudioNodeChain object that treats `schedule()` as a no-op. If
 * If specified, the mock will verify that AudioNodeChain's `schedule` gets
 * called with the right parameters and called the right number of times. To
 * do this, the caller must call `verifyAll()` on the mock at the end of the
 * test.
 */
export function getAudioNodeChainMock(
 paramsList: ScheduleParams[] | null = null) : TypeMoq.IMock<AudioNodeChain> {
  let audioNodeChainMock: TypeMoq.IMock<AudioNodeChain> =
   TypeMoq.Mock.ofInstance(new AudioNodeChain(<any>1));

  if (paramsList !== null) {
    paramsList.forEach((params) => {
      audioNodeChainMock.setup(x => x.schedule(
       TypeMoq.It.isAny(),
       TypeMoq.It.isValue(params.start),
       TypeMoq.It.isValue(params.end),
       TypeMoq.It.isValue(params.steps),
       TypeMoq.It.isAny())).verifiable(TypeMoq.Times.once());
    });
  } else {
    audioNodeChainMock.setup(x => x.schedule(
     TypeMoq.It.isAny(),
     TypeMoq.It.isAny(),
     TypeMoq.It.isAny(),
     TypeMoq.It.isAny(),
     TypeMoq.It.isAny()));
  }

  return audioNodeChainMock;
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
