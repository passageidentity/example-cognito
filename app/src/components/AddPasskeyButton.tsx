import { Button } from 'react-bootstrap';
import { Passage } from '../passage';

interface IAddPasskeyProps {
  accessToken: string;
}

export function AddPasskeyButton({ accessToken }: IAddPasskeyProps) {
  const addPasskey = async () => {
    if (!accessToken) {
      throw new Error('Need to sign in first');
    }

    const response = await fetch(`http://localhost:${import.meta.env.VITE_SERVER_PORT}/users/add-passkey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error adding passkey');
    }

    const { transactionId } = await response.json();
    await Passage.passkey.register(transactionId);
  };

  return (
    <Button className="m-1" onClick={addPasskey}>
      Add passkey
    </Button>
  );
}
