import { Col } from 'react-bootstrap';

import { ReactNode } from 'react';

interface AuthContainerProps {
  children: ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  return <Col className='border border-secondary rounded p-4'>{children}</Col>;
}
