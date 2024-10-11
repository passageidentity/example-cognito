import { Col, Row, Table } from 'react-bootstrap';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { useEffect, useState } from 'react';

interface IDetailsPanelProps {
  accessToken: string;
}

export function DetailsPanel({ accessToken }: IDetailsPanelProps) {
  const [jwtData, setJwtData] = useState<object>();

  const jwtVerifier = CognitoJwtVerifier.create({
    region: import.meta.env.VITE_AWS_COGNITO_REGION as string,
    userPoolId: import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID as string,
    clientId: import.meta.env.VITE_AWS_COGNITO_APP_CLIENT_ID as string,
    tokenUse: 'access',
  });

  useEffect(() => {
    jwtVerifier
      .verify(accessToken)
      .then((jwt) => setJwtData(jwt))
      .catch((e) => setJwtData({ Error: e.message }));
  });

  return (
    <Row className="mt-5">
      <Col>
        <h2 className="text-center mb-4">Access token details</h2>

        <Table striped bordered hover>
          <tbody>
            {jwtData &&
              Object.entries(jwtData).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <strong>{key}</strong>
                  </td>
                  <td>{value as string}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
