import { Button } from 'react-bootstrap';
import { signOutUser } from '../cognito';
import { useNavigate } from 'react-router-dom';

interface ISignOutProps {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
}

export function SignOutButton({ accessToken, setAccessToken }: ISignOutProps) {
  const navigate = useNavigate();

  const signOut = async () => {
    if (!accessToken) {
      return;
    }

    try {
      await signOutUser(accessToken);
      setAccessToken('');
      navigate('/signin');
    } catch (e) {
      alert(`Sign out failed ${e}`);
    }
  };

  return (
    <Button variant="outline-dark" className="m-1" onClick={signOut}>
      Sign out
    </Button>
  );
}
