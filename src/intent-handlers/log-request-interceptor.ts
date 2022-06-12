import * as Alexa from 'ask-sdk-core';
import { HandlerInput } from 'ask-sdk-core';

export async function LogRequestInterceptor(handlerInput: HandlerInput): Promise<void> {
  try {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    console.log('**** requestType: ', requestType);
    console.log('**** request: ', JSON.stringify(handlerInput.requestEnvelope.request));
  } catch (e) {
    console.log('error in request interceptor: ', e);
  }
}
