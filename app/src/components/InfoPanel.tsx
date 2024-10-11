import { Col, Row } from 'react-bootstrap';

export function InfoPanel() {
  return (
    <Row className="mt-5">
      <Col>
        <h2 className="text-center mb-4">Welcome!</h2>
        <p className="fs-5">
          This is an example web application that demonstrates how to use Passage Passkey Flex and Amazon Cognito for
          user authentication.
        </p>
        <p className="fs-5">
          You can sign up a new user, sign in with an existing user, and view the details of the access token that is
          returned after a successful sign in.
        </p>
        <p className="fs-5">Be sure to try adding a passkey and signing in with it!</p>
        <p className="fs-5">
          For more information, check out our{' '}
          <a href="https://docs.passage.id/docs/guides/passkey-flex/aws-cognito">guide</a>.
        </p>
      </Col>
    </Row>
  );
}
