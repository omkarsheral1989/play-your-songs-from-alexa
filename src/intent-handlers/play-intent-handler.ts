import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import * as Alexa from 'ask-sdk-core';
import { HandlerInput } from 'ask-sdk-core';
import { RequestEnvelope, Response, Slot } from 'ask-sdk-model';
import { AudioController } from '../controllers/audio-controller';
import { Song_Tag } from '../types/song-types';
import { get } from 'lodash';


export const PlayIntentHandler: CustomSkillRequestHandler = {
  canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SingIntent';
  },
  async handle(handlerInput: HandlerInput): Promise<Response> {
    const songNumberStr = Alexa.getSlotValue(handlerInput.requestEnvelope, 'songNumber');
    if (songNumberStr) {
      const songNumber = parseInt(songNumberStr, 10);
      return AudioController.playSongNumber(handlerInput, songNumber);
    }

    const songTags = getSongTags(handlerInput.requestEnvelope);
    if (songTags.length > 0) {
      return AudioController.playSongsByTags(handlerInput, ...songTags);
    }

    return AudioController.playDefault(handlerInput);
  },
};


export function getSongTags(requestEnvelope: RequestEnvelope): Song_Tag[] {
  const songTags: Song_Tag[] = [];
  const songTagSlot1 = Alexa.getSlot(requestEnvelope, 'songTag');
  const songTagSlot2 = Alexa.getSlot(requestEnvelope, 'songTagg');
  const songTagSlot3 = Alexa.getSlot(requestEnvelope, 'songTaggg');

  const songTag1 = getSlotId(songTagSlot1);
  const songTag2 = getSlotId(songTagSlot2);
  const songTag3 = getSlotId(songTagSlot3);

  if (songTag1) {
    songTags.push(songTag1);
  }
  if (songTag2) {
    songTags.push(songTag2);
  }
  if (songTag3) {
    songTags.push(songTag3);
  }
  return songTags;
}

function getSlotId(slot: Slot) {
  return get(slot, 'resolutions.resolutionsPerAuthority.0.values.0.value.id', undefined);
}
