import * as Alexa from 'ask-sdk-core';
import { HandlerInput } from 'ask-sdk-core';
import { interfaces, Response } from 'ask-sdk-model';
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import { AudioController } from '../controllers/audio-controller';
import PlaybackStoppedRequest = interfaces.audioplayer.PlaybackStoppedRequest;

export const PlaybackStoppedRequestHandler: CustomSkillRequestHandler = {
  canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput: HandlerInput): Promise<Response> | Response {
    const request = handlerInput.requestEnvelope.request as PlaybackStoppedRequest;
    const stoppedSongToken = request.token!;
    const offsetInMilliseconds = request.offsetInMilliseconds!;
    return AudioController.onPlaybackStopped(handlerInput, stoppedSongToken, offsetInMilliseconds);
  },
};
