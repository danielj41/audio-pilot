import { generateSong, toSongTree } from '../src/song-builder'
import { SongPlayer } from '../src/song-player'

(new SongPlayer()).playSong(toSongTree(generateSong().getState()));
