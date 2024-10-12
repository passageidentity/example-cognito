import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AddPasskeyButton } from './AddPasskeyButton';
import { SignOutButton } from './SignOutButton';

interface INavBarProps {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

export function NavBar({ accessToken, setAccessToken }: INavBarProps) {
  const Authenticated = (
    <>
      <AddPasskeyButton accessToken={accessToken} />
      <SignOutButton accessToken={accessToken} setAccessToken={setAccessToken} />
    </>
  );
  const Unauthenticated = (
    <>
      <Link to='/signin'>
        <Button variant='outline-dark' className='m-1'>
          Sign in
        </Button>
      </Link>
      <Link to='/signup'>
        <Button variant='dark' className='m-1'>
          Sign up
        </Button>
      </Link>
    </>
  );

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
      <Container fluid className='gap-4'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse className='justify-content-end'>
          {accessToken ? Authenticated : Unauthenticated}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
