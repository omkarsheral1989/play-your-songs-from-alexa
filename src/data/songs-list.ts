import { ISong, Song_Tag } from '../types/song-types';
import songsListJson from './songs-list.json';


const songsList: ISong[] = songsListJson as ISong[];

export function getSongsByTag(...tags: Song_Tag[]): ISong[] {
  return songsList.filter(
    song => intersection(song.tags, tags).length > 0,
  );
}

export async function getSongsBySongNumber(number: number) {
  const index = songsList.findIndex(song => song.number === number);
  return {
    songs: songsList,
    index,
  };
}

const intersection = <T>(a: T[], b: T[]) => a.filter((i) => b.includes(i));
