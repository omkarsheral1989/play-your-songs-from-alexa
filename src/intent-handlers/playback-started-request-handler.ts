import * as Alexa from 'ask-sdk-core';
import { HandlerInput } from 'ask-sdk-core';
import { interfaces, Response } from 'ask-sdk-model';
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import { AudioController } from '../controllers/audio-controller';
import PlaybackStartedRequest = interfaces.audioplayer.PlaybackStartedRequest;

export const PlaybackStartedRequestHandler: CustomSkillRequestHandler = {
  canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput: HandlerInput): Promise<Response> | Response {
    const currentSongToken = (handlerInput.requestEnvelope.request as PlaybackStartedRequest).token!;
    return AudioController.onPlaybackStarted(handlerInput, currentSongToken);
  },
};
