import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getPersistentAudioData, savePersistentData } from '../data/persistent-data';
import { ISong, Song_Tag } from '../types/song-types';
import { IPersistentAudioData } from '../types/persistent-data-types';
import { getSongsBySongNumber, getSongsByTag } from '../data/songs-list';

export class AudioController {
  static async playDefault(handlerInput: HandlerInput): Promise<Response> {
    const persistentAudioData = await getPersistentAudioData(handlerInput);
    let {
      songs,
      currentSongIndex,
      offsetInMilliseconds,
    } = extractSongsFromPersistentAudioData(persistentAudioData);

    console.log('&& currentSongIndex', currentSongIndex);
    console.log('&& offsetInMilliseconds', offsetInMilliseconds);
    console.log('&& songs', songs.length);

    // play previously paused / stopped song
    if (songs.length > 0 && currentSongIndex !== -1) {
      const songToPlay = songs[currentSongIndex];
      return buildAudioResponse(handlerInput, songs, songToPlay);
    }

    // else play some default songs
    // todo this needs to be changed
    songs = getSongsByTag('marathi');
    const songToPlay = songs[0];

    return buildAudioResponse(handlerInput, songs, songToPlay);
  }

  static playSongsByTags(handlerInput: HandlerInput, ...tags: Song_Tag[]) {
    const songs = getSongsByTag(tags[0]);
    const tagsStr = tags.join(' ');
    if (songs.length === 0) {
      return handlerInput.responseBuilder
        .speak(`Unable to find ${tagsStr} songs`)
        .reprompt('Try, Sing marathi songs')
        .withShouldEndSession(false)
        .getResponse();
    }

    const songToPlay = songs[0];
    const speakOutput = `${tagsStr} songs. `;
    return buildAudioResponse(handlerInput, songs, songToPlay, 0, true, speakOutput);
  }

  static async playSongNumber(handlerInput: HandlerInput, songNumber: number): Promise<Response> {
    const { songs, index } = await getSongsBySongNumber(songNumber);
    if (index === -1) {
      return handlerInput.responseBuilder
        .speak(`Unable to find song number ${songNumber}`)
        .reprompt('Try some other song number')
        .withShouldEndSession(false)
        .getResponse();
    }

    const songToPlay = songs[index];
    return buildAudioResponse(handlerInput, songs, songToPlay);
  }

  static async resume(handlerInput: HandlerInput): Promise<Response> {
    const persistentAudioData = await getPersistentAudioData(handlerInput);
    let {
      songs,
      currentSongIndex,
      offsetInMilliseconds,
    } = extractSongsFromPersistentAudioData(persistentAudioData);

    console.log('&& currentSongIndex', currentSongIndex);
    console.log('&& offsetInMilliseconds', offsetInMilliseconds);
    console.log('&& songs', songs.length);

    // play previously paused / stopped song
    if (songs.length > 0 && currentSongIndex !== -1) {
      const songToPlay = songs[currentSongIndex];
      return buildAudioResponse(handlerInput, songs, songToPlay, offsetInMilliseconds, false);
    }

    // else play some default songs
    songs = getSongsByTag('marathi');
    const songToPlay = songs[0];

    return buildAudioResponse(handlerInput, songs, songToPlay);
  }

  static async enqueueNextSong(handlerInput: HandlerInput, currentSongToken: string): Promise<Response> {
    const persistentAudioData = await getPersistentAudioData(handlerInput);
    const {
      songs,
      currentSongIndex,
      nextSongIndex,
    } = extractSongsFromPersistentAudioData(persistentAudioData, currentSongToken);

    if (currentSongIndex === -1) {
      console.log('Error enqueuing next song: unable to find current song');
      return handlerInput.responseBuilder
        .withShouldEndSession(true)
        .getResponse();
    }

    if (nextSongIndex === songs.length) {
      console.log('Cannot enqueuing next song: reached end of the playlist');
      return handlerInput.responseBuilder
        .withShouldEndSession(true)
        .getResponse();
    }

    const nextSong = songs[nextSongIndex];

    console.log('going to enqueue song ', nextSong.token);

    return handlerInput.responseBuilder
      .addAudioPlayerPlayDirective(
        'ENQUEUE',
        nextSong.url,
        nextSong.token,
        0,
        currentSongToken,
        { title: nextSong.name },
      )
      .withShouldEndSession(true)
      .getResponse();
  }

  static async next(handlerInput: HandlerInput): Promise<Response> {
    const persistentAudioData = await getPersistentAudioData(handlerInput);
    const {
      songs,
      currentSongIndex,
      nextSongIndex,
    } = extractSongsFromPersistentAudioData(persistentAudioData);

    if (currentSongIndex === -1) {
      return handlerInput.responseBuilder
        .speak('Unable to find the current song')
        .withShouldEndSession(true)
        .getResponse();
    }

    if (nextSongIndex === songs.length) {
      return handlerInput.responseBuilder
        .speak('You have reached the end of the playlist')
        .withShouldEndSession(true)
        .getResponse();
    }

    const nextSong = songs[nextSongIndex];

    return buildAudioResponse(
      handlerInput,
      songs,
      nextSong,
    );
  }

  static async previous(handlerInput: HandlerInput): Promise<Response> {
    const persistentAudioData = await getPersistentAudioData(handlerInput);
    const {
      songs,
      currentSongIndex,
      previousSongIndex,
    } = extractSongsFromPersistentAudioData(persistentAudioData);

    if (currentSongIndex === -1) {
      return handlerInput.responseBuilder
        .speak('Unable to find the current song')
        .withShouldEndSession(true)
        .getResponse();
    }

    if (previousSongIndex === -1) {
      return handlerInput.responseBuilder
        .speak('You have reached the start of the playlist')
        .withShouldEndSession(true)
        .getResponse();
    }

    const previousSong = songs[previousSongIndex];

    return buildAudioResponse(
      handlerInput,
      songs,
      previousSong,
    );
  }

  static async onPlaybackStarted(handlerInput: HandlerInput, currentSongToken: string): Promise<Response> {
    const persistentAudioData: IPersistentAudioData = await getPersistentAudioData(handlerInput);
    persistentAudioData.currentSongToken = currentSongToken;
    await savePersistentData(handlerInput);

    console.log('currentSongToken', currentSongToken);

    return handlerInput.responseBuilder
      .withShouldEndSession(true)
      .getResponse();
  }

  static async onPlaybackStopped(handlerInput: HandlerInput, stoppedSongToken: string, offsetInMilliseconds: number) {
    const persistentAudioData: IPersistentAudioData = await getPersistentAudioData(handlerInput);
    persistentAudioData.currentSongToken = stoppedSongToken;
    persistentAudioData.offsetInMilliseconds = offsetInMilliseconds;
    await savePersistentData(handlerInput);

    return handlerInput.responseBuilder.getResponse();
  }
}

async function buildAudioResponse(
  handlerInput: HandlerInput,
  songs: ISong[],
  songToPlay: ISong,
  offsetInMilliseconds: number = 0,
  speak: boolean = true,
  preSpeakOutput = '',
): Promise<Response> {

  const persistentAudioData: IPersistentAudioData = await getPersistentAudioData(handlerInput);
  persistentAudioData.songs = songs;
  persistentAudioData.currentSongToken = songToPlay.token;
  persistentAudioData.offsetInMilliseconds = offsetInMilliseconds;
  await savePersistentData(handlerInput);

  const speakOutput = `${preSpeakOutput} Playing song number ${songToPlay.number}. ${songToPlay.nameLocal || songToPlay.name}`;

  console.log('Going to play song with token ', songToPlay.token);

  return handlerInput.responseBuilder
    .speak(speak ? speakOutput : '')
    .addAudioPlayerPlayDirective(
      'REPLACE_ALL',
      songToPlay.url,
      songToPlay.token,
      offsetInMilliseconds,
      undefined,
      { title: songToPlay.name },
    )
    .withShouldEndSession(true)
    .getResponse();
}

function extractSongsFromPersistentAudioData(persistentAudioData: IPersistentAudioData, currentSongToken?: string|null) {
  currentSongToken = currentSongToken || persistentAudioData.currentSongToken;
  const songs = persistentAudioData.songs;
  const currentSongIndex = songs.findIndex(
    song => song.token === currentSongToken,
  );
  let nextSongIndex = currentSongIndex + 1;
  if (nextSongIndex === songs.length && persistentAudioData.repeat) {
    nextSongIndex = 0;
  }
  let previousSongIndex = currentSongIndex - 1;
  if (previousSongIndex === -1 && persistentAudioData.repeat) {
    previousSongIndex = songs.length - 1;
  }
  const offsetInMilliseconds = persistentAudioData.offsetInMilliseconds || 0;
  return {
    songs,
    currentSongIndex,
    nextSongIndex,
    previousSongIndex,
    offsetInMilliseconds,
  };
}
