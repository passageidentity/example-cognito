import { PassageConfig, PassageFlex } from '@passageidentity/passage-flex-node';
import { CreateAuthChallengeTriggerEvent, Handler } from 'aws-lambda';

export const handler: Handler = async (
  event: CreateAuthChallengeTriggerEvent
): Promise<CreateAuthChallengeTriggerEvent> => {
  if (event.request.challengeName !== 'CUSTOM_CHALLENGE') {
    return event;
  }

  if (event.request.session.length !== 0) {
    // unexpected state; define-auth-challenge should avoid this
    throw new Error('Internal Server Error');
  }

  if (!event.request.userAttributes.sub) {
    throw new Error('Missing sub in userAttributes');
  }

  if (!process.env.PASSAGE_APP_ID || !process.env.PASSAGE_API_KEY) {
    throw new Error('Missing Passage credentials');
  }

  const updatedEvent = await setPassageTransaction({
    event,
    passageConfig: {
      appId: process.env.PASSAGE_APP_ID,
      apiKey: process.env.PASSAGE_API_KEY,
    },
  });

  return updatedEvent;
};

const setPassageTransaction = async ({
  event,
  passageConfig,
}: {
  event: CreateAuthChallengeTriggerEvent;
  passageConfig: PassageConfig;
}): Promise<CreateAuthChallengeTriggerEvent> => {
  try {
    const passage = new PassageFlex(passageConfig);

    const externalId = event.request.userAttributes.sub;
    const passageTransactionId = await passage.createAuthenticateTransaction({ externalId });

    event.response.publicChallengeParameters = { passageTransactionId };

    return event;
  } catch (e) {
    console.error('Failed to create an authentication transaction', e);
    throw e;
  }
};
