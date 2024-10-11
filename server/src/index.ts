import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { TypedRequestBody } from 'zod-express-middleware';
import {
  AdminConfirmSignUpCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { validateRequest } from './middleware';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { JwtBaseError } from 'aws-jwt-verify/error';
import { PassageFlex } from '@passageidentity/passage-flex-node';
import { z } from 'zod';

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const jwtVerifier = CognitoJwtVerifier.create({
  region: process.env.AWS_COGNITO_REGION!,
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
  clientId: process.env.AWS_COGNITO_APP_CLIENT_ID!,
  tokenUse: 'access',
});

const passage = new PassageFlex({
  appId: process.env.PASSAGE_APP_ID!,
  apiKey: process.env.PASSAGE_API_KEY!,
});

const app: Express = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const RegistrationVerificationSchema = z.object({
  email: z.string(),
});

app.post(
  '/signup/confirm',
  validateRequest(RegistrationVerificationSchema),
  async (req: TypedRequestBody<typeof RegistrationVerificationSchema>, res: Response) => {
    const { email } = req.body;

    try {
      let response = await cognitoClient.send(
        new AdminConfirmSignUpCommand({
          UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
          Username: email,
        })
      );

      if (response.$metadata.httpStatusCode !== 200) {
        return res.status(response.$metadata.httpStatusCode!).send();
      }

      response = await cognitoClient.send(
        new AdminUpdateUserAttributesCommand({
          UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
          Username: email,
          UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
        })
      );

      return res.status(response.$metadata.httpStatusCode!).send();
    } catch (e) {
      console.error('Error confirming user signup:', e);
      return res.status(500).json({ error: (e as Error).message });
    }
  }
);

app.post('/users/add-passkey', async (req: Request, res: Response) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const jwtPayload = await jwtVerifier.verify(token);

    const { sub, username } = jwtPayload;

    const response = await cognitoClient.send(
      new AdminGetUserCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        Username: username,
      })
    );

    if (response.$metadata.httpStatusCode !== 200) {
      return res.status(response.$metadata.httpStatusCode!).send();
    }

    const email = response.UserAttributes?.find((attr) => attr.Name === 'email')?.Value;

    if (!email) {
      return res.status(500).json({ error: 'User does not have an email' });
    }

    const transactionId = await passage.createRegisterTransaction({
      externalId: sub,
      passkeyDisplayName: email,
    });

    return res.json({ transactionId });
  } catch (e) {
    switch (e) {
      case e instanceof JwtBaseError:
        console.error('Error verifying JWT:', e);
        return res.status(401).json({ error: 'Invalid JWT' });
      default:
        console.error('Error adding passkey:', e);
        return res.status(500).json({ error: 'Error adding passkey' });
    }
  }
});
