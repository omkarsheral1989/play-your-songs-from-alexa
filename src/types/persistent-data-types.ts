import { ISong } from '../types/song-types';

export interface IPersistentData {
  audioData: IPersistentAudioData;
}

export interface IPersistentAudioData {
  songs: ISong[];
  currentSongToken: string | null;
  // isPlaying: boolean,
  shuffle: boolean,
  repeat: boolean,
  offsetInMilliseconds: number,
}
