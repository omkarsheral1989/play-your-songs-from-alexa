import * as Alexa from 'ask-sdk-core';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';

export const PlaybackFinishedRequestHandler: CustomSkillRequestHandler = {
  canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackFinished';
  },
  handle(handlerInput: HandlerInput): Promise<Response> | Response {
    return handlerInput.responseBuilder
      .getResponse();
  },
};
