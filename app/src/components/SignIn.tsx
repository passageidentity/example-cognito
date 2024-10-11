import { FormEvent, useState } from 'react';
import { Row, Col, Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signInWithPasskey, signInWithPassword } from '../cognito';

interface ISignInProps {
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

export function SignIn({ setAccessToken }: ISignInProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordSignin, setIsPasskeySignin] = useState<boolean>(true);

  const passwordSignIn = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const authResult = await signInWithPassword(email, password);
      setAccessToken(authResult.accessToken);
    } catch (e) {
      alert(`Password sign in failed: ${e}`);
    }
  };

  const passkeySignIn = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const authResult = await signInWithPasskey(email);
      setAccessToken(authResult.accessToken);
    } catch (e) {
      alert(`Passkey sign in failed: ${e}`);
    }
  };

  return (
    <Row className='mt-5'>
      <Col>
        <h2 className='text-center mb-4'>{isPasswordSignin ? 'Sign in with password' : 'Sign in with passkey'}</h2>

        <Form onSubmit={isPasswordSignin ? passwordSignIn : passkeySignIn}>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          {isPasswordSignin && (
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
          )}

          <Container className='text-center mb-3'>
            <Button variant='dark' type='submit'>
              Sign in
            </Button>
          </Container>
        </Form>

        <p>
          {'Try signing in with a '}
          <Link to='#' onClick={() => setIsPasskeySignin(!isPasswordSignin)}>
            {isPasswordSignin ? 'passkey' : 'password'}
          </Link>
        </p>
      </Col>
    </Row>
  );
}
