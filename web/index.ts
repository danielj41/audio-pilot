import { generateSong } from '../src/song-builder'
import { SongPlayer } from '../src/song-player'

(new SongPlayer()).playSong(generateSong());
