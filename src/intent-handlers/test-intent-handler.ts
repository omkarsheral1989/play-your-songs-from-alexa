import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import * as Alexa from 'ask-sdk-core';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { S3PersistenceAdapter } from 'ask-sdk-s3-persistence-adapter';
import { getSongTags } from './play-intent-handler';


export const s3PersistentAdapter = new S3PersistenceAdapter({
  bucketName: process.env.S3_PERSISTENCE_BUCKET!,
  pathPrefix: 'perssistent-attribute-',
});

export const TestIntentHandler: CustomSkillRequestHandler = {
  canHandle(handlerInput: HandlerInput): Promise<boolean> | boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TestIntent';
  },
  async handle(handlerInput: HandlerInput): Promise<Response> {

    const songTags = getSongTags(handlerInput.requestEnvelope);

    return handlerInput.responseBuilder
      .speak(`handling test intent, ${songTags.join(' ')}`)
      .withShouldEndSession(false)
      .getResponse();
  },
};

