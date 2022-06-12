import { HandlerInput } from 'ask-sdk-core';

export async function LoadPersistentAttributesRequestInterceptor(handlerInput: HandlerInput): Promise<void> {
  const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();

  // // Check if user is invoking the skill the first time and initialize preset values
  // if (Object.keys(persistentAttributes).length === 0) {
  //   handlerInput.attributesManager.setPersistentAttributes({
  //     playbackSetting: {
  //       loop: false,
  //       shuffle: false,
  //     },
  //     playbackInfo: {
  //       playOrder: [...Array(constants.audioData.length).keys()],
  //       index: 0,
  //       offsetInMilliseconds: 0,
  //       playbackIndexChanged: true,
  //       token: '',
  //       nextStreamEnqueued: false,
  //       inPlaybackSession: false,
  //       hasPreviousPlaybackSession: false,
  //     },
  //   });
  // }
}
