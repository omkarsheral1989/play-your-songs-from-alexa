import { HandlerInput } from 'ask-sdk-core';
import { IPersistentAudioData, IPersistentData } from '../types/persistent-data-types';

export async function getPersistentAudioData(handlerInput: HandlerInput): Promise<IPersistentAudioData> {
  const persistentData = await getPersistentData(handlerInput);
  persistentData.audioData = persistentData.audioData || defaultPersistentAudioData;
  const audioData = persistentData.audioData;
  audioData.offsetInMilliseconds = audioData.offsetInMilliseconds || defaultPersistentAudioData.offsetInMilliseconds;
  return persistentData.audioData;
}

export async function savePersistentData(handlerInput: HandlerInput): Promise<void> {
  await handlerInput.attributesManager.savePersistentAttributes();
}

async function getPersistentData(handlerInput: HandlerInput): Promise<IPersistentData> {
  // noinspection UnnecessaryLocalVariableJS
  const persistentData: IPersistentData = await handlerInput.attributesManager.getPersistentAttributes() as IPersistentData;
  return persistentData;
}

const defaultPersistentAudioData: IPersistentAudioData = {
  songs: [],
  currentSongToken: null,
  repeat: true,
  shuffle: false,
  offsetInMilliseconds: 0,
};
