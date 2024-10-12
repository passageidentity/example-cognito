import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DetailsPanel } from './components/DetailsPanel';
import { InfoPanel } from './components/InfoPanel';
import { NavBar } from './components/NavBar';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import cognitoLogo from './assets/cognito.svg';
import flexLogo from './assets/flex-icon.svg';
import passageLogo from './assets/passage-logo.svg';

export default function App() {
  const [accessToken, setAccessToken] = useState<string>('');

  return (
    <BrowserRouter>
      <NavBar accessToken={accessToken} setAccessToken={setAccessToken} />

      <Container className='px-0 d-flex flex-column justify-content-center align-items-center'>
        <Row>
          <img src={passageLogo} className='mx-auto mt-5' alt='Passage logo' height='75' />
        </Row>
        <Row>
          <div className='d-flex justify-content-center mt-5'>
            <img src={flexLogo} className='mx-3' alt='Passage logo' height='50' />
            <img src={cognitoLogo} className='mx-3' alt='Cognito logo' height='50' />
            <div>
              <h1 className='fw-bold'>Passkey Flex + AWS Cognito</h1>
            </div>
          </div>
        </Row>
        <Row className='mt-4 w-75 d-flex flex-column flex-md-row mt-md-4'>
          <Col className='d-flex align-items-center'>
            {accessToken ? <DetailsPanel accessToken={accessToken} /> : <InfoPanel />}
          </Col>
          <Col className='d-flex align-items-center'>
            <Routes>
              <Route path='/signup' element={<SignUp />} />
              <Route path='/signin' element={<SignIn setAccessToken={setAccessToken} />} />
              <Route path='/' element={<SignUp />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  );
}
