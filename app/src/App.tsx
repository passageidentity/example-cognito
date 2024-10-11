import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { DetailsPanel } from './components/DetailsPanel';
import { Col, Container, Row } from 'react-bootstrap';
import passageLogo from './assets/passage-logo.svg';
import flexLogo from './assets/flex-icon.svg';
import cognitoLogo from './assets/cognito.svg';
import { InfoPanel } from './components/InfoPanel';

export default function App() {
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <BrowserRouter>
      <NavBar accessToken={accessToken} setAccessToken={setAccessToken} />

      <Container className="px-0">
        <Row>
          <img src={passageLogo} className="mx-auto mt-5" alt="Passage logo" height="200" />
        </Row>
        <Row className="mt-5 pt-5">
          <Col className="d-flex flex-column align-items-center">
            <div className="d-flex justify-content-center mb-4">
              <img src={flexLogo} className="mx-3" alt="Passage logo" height="100" />
              <img src={cognitoLogo} className="mx-3" alt="Cognito logo" height="100" />
            </div>
            <h1>Passkey Flex + AWS Cognito</h1>

            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn setAccessToken={setAccessToken} />} />
              <Route path="/" element={<SignUp />} />
            </Routes>
          </Col>

          <Col>{accessToken ? <DetailsPanel accessToken={accessToken} /> : <InfoPanel />}</Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
}
