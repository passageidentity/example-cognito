import { PassageConfig, PassageFlex } from '@passageidentity/passage-flex-node';
import { Handler, VerifyAuthChallengeResponseTriggerEvent } from 'aws-lambda';

export const handler: Handler = async (
  event: VerifyAuthChallengeResponseTriggerEvent
): Promise<VerifyAuthChallengeResponseTriggerEvent> => {
  if (!event.request.challengeAnswer) {
    throw new Error('Missing challengeAnswer');
  }

  if (!process.env.PASSAGE_APP_ID || !process.env.PASSAGE_API_KEY) {
    throw new Error('Missing Passage credentials');
  }

  const updatedEvent = await verifyChallengeAnswer({
    event,
    passageConfig: {
      appId: process.env.PASSAGE_APP_ID,
      apiKey: process.env.PASSAGE_API_KEY,
    },
  });

  return updatedEvent;
};

const verifyChallengeAnswer = async ({
  event,
  passageConfig,
}: {
  event: VerifyAuthChallengeResponseTriggerEvent;
  passageConfig: PassageConfig;
}): Promise<VerifyAuthChallengeResponseTriggerEvent> => {
  try {
    const nonce = event.request.challengeAnswer;
    const passage = new PassageFlex(passageConfig);

    await passage.verifyNonce(nonce);

    event.response.answerCorrect = true;
    return event;
  } catch (e) {
    console.error('Failed to verify the nonce', e);
    throw e;
  }
};
