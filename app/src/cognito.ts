import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Passage } from './passage';

export const cognitoClient = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_AWS_COGNITO_REGION,
});

export const signUpUser = async (email: string, password: string): Promise<void> => {
  const result = await cognitoClient.send(
    new SignUpCommand({
      ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    })
  );

  if (!result.UserSub) {
    throw new Error('Error creating user with Cognito');
  }

  const response = await fetch(`http://localhost:${import.meta.env.VITE_SERVER_PORT}/signup/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
};

export type AuthResult = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export const signInWithPassword = async (email: string, password: string): Promise<AuthResult> => {
  const result = await cognitoClient.send(
    new InitiateAuthCommand({
      ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })
  );

  if (!result.AuthenticationResult) {
    throw new Error('Error logging in with password');
  }

  const { AccessToken, IdToken, RefreshToken, TokenType, ExpiresIn } = result.AuthenticationResult;
  return {
    accessToken: AccessToken!,
    idToken: IdToken!,
    refreshToken: RefreshToken!,
    tokenType: TokenType!,
    expiresIn: ExpiresIn!,
  };
};

export const signInWithPasskey = async (email: string): Promise<AuthResult> => {
  const initAuthResult = await cognitoClient.send(
    new InitiateAuthCommand({
      ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
      AuthFlow: AuthFlowType.CUSTOM_AUTH,
      AuthParameters: {
        USERNAME: email,
      },
    })
  );

  if (!initAuthResult.ChallengeParameters?.passageTransactionId) {
    throw new Error('Error starting passkey login');
  }

  const transactionId = initAuthResult.ChallengeParameters.passageTransactionId;
  const nonce = await Passage.passkey.authenticate({ transactionId });

  const authChallengeResult = await cognitoClient.send(
    new RespondToAuthChallengeCommand({
      ClientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID,
      Session: initAuthResult.Session,
      ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
      ChallengeResponses: {
        USERNAME: email,
        ANSWER: nonce,
      },
    })
  );

  if (!authChallengeResult.AuthenticationResult) {
    throw new Error('Error finishing passkey login');
  }

  const { AccessToken, IdToken, RefreshToken, TokenType, ExpiresIn } = authChallengeResult.AuthenticationResult;
  return {
    accessToken: AccessToken!,
    idToken: IdToken!,
    refreshToken: RefreshToken!,
    tokenType: TokenType!,
    expiresIn: ExpiresIn!,
  };
};

export const signOutUser = async (accessToken: string): Promise<void> => {
  const result = await cognitoClient.send(
    new GlobalSignOutCommand({
      AccessToken: accessToken,
    })
  );

  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error('Error signing out of Cognito');
  }
};
