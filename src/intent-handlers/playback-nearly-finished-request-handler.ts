import * as Alexa from 'ask-sdk-core';
import { HandlerInput } from 'ask-sdk-core';
import { interfaces, Response } from 'ask-sdk-model';
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import { AudioController } from '../controllers/audio-controller';

export const PlaybackNearlyFinishedRequestHandler: CustomSkillRequestHandler = {
  canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackNearlyFinished';
  },
  handle(handlerInput: HandlerInput): Promise<Response> | Response {
    const currentSongToken = (handlerInput.requestEnvelope.request as interfaces.audioplayer.PlaybackNearlyFinishedRequest).token!;
    return AudioController.enqueueNextSong(handlerInput, currentSongToken);
  },
};
