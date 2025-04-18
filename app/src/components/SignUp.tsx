import { FormEvent, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../cognito';
import { AuthContainer } from './AuthContainer';

export function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const signUp = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signUpUser(email, password);
      navigate('/signin');
    } catch (e) {
      alert(`Sign up failed: ${(e as Error).message}`);
    }
  };

  return (
    <Row className='w-100 mt-3'>
      <AuthContainer>
        <h2 className='text-center mb-4'>Sign up a new user</h2>

        <Form onSubmit={signUp}>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Container className='text-center'>
            <Button variant='dark' type='submit'>
              Sign up
            </Button>
          </Container>
        </Form>
      </AuthContainer>
    </Row>
  );
}
