<div align="center">
  <img src="https://cdn.prod.website-files.com/64516fef70e3c53e580425b7/6452c674d3feab2edbe19fc3_Passage%20by%201Password.svg" alt="Passage logo" style="height:100px;"/>
</div>
<br/>

# Passage Passkey Flex + AWS Cognito Example

A demo of how to integrate passkeys via [Passage Passkey Flex](https://passage.1password.com/product/passkey-flex) into your AWS Cognito stack.

By using the native AWS User Pool integration with Lambdas via the [Custom Auth flow](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html),
we can add additional steps to Cognito's authentication process.

# Getting started

Follow the official [guide](https://docs.passage.id/docs/guides/passkey-flex/integration-guides/aws-cognito) to setup Passage and AWS. Once you're ready, run the server and app!

Install the dependencies

```sh copy
npm install
```

Build the Lambdas and follow the guide to upload them to AWS

```sh copy
npm run build:lambdas
```

Start the .env setup and follow the guide to populate the env vars

```sh copy
npm run env
```

Start the server and app

```sh copy
npm start
```
