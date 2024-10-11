import { DefineAuthChallengeTriggerEvent, Handler } from 'aws-lambda';
import { ChallengeResult, CustomChallengeResult } from 'aws-lambda/trigger/cognito-user-pool-trigger/_common';

export const handler: Handler = async (
  event: DefineAuthChallengeTriggerEvent
): Promise<DefineAuthChallengeTriggerEvent> => {
  if (event.request.session.length === 0) {
    return customChallenge(event);
  }

  const nonCustomChallengeExists = event.request.session.some(
    (attempt: ChallengeResult | CustomChallengeResult) => attempt.challengeName !== 'CUSTOM_CHALLENGE'
  );
  if (nonCustomChallengeExists) {
    return deny(event, 'expected CUSTOM_CHALLENGE');
  }

  const lastResponse = event.request.session.at(-1)!;
  return lastResponse.challengeResult === true
    ? allow(event)
    : deny(event, 'failed to authenticate with Passage passkeys');
};

const deny = (event: DefineAuthChallengeTriggerEvent, reason: string): DefineAuthChallengeTriggerEvent => {
  console.log(`Failing authentication because: ${reason}`);

  event.response.issueTokens = false;
  event.response.failAuthentication = true;

  return event;
};

const allow = (event: DefineAuthChallengeTriggerEvent): DefineAuthChallengeTriggerEvent => {
  event.response.issueTokens = true;
  event.response.failAuthentication = false;

  return event;
};

const customChallenge = (event: DefineAuthChallengeTriggerEvent): DefineAuthChallengeTriggerEvent => {
  event.response.issueTokens = false;
  event.response.failAuthentication = false;
  event.response.challengeName = 'CUSTOM_CHALLENGE';

  return event;
};
