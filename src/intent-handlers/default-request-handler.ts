import * as Alexa from 'ask-sdk-core';

export const DefaultRequestHandler = {
  canHandle(handlerInput) {
    return true;
  },
  handle(handlerInput) {
    const requestType = Alexa.getRequestType(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered type. ${requestType}`;

    console.log('*************');
    console.log('DefaultRequestHandler');
    console.log(speakOutput);
    console.log('************');
    return handlerInput.responseBuilder.getResponse();
  },
};
