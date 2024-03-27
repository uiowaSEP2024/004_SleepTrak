import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Typography, FormLabel, Input, Button } from '@mui/joy';
import API_URL from '../util/apiURL';

interface Info {
  email: string;
  password: string;
}

export default function AssignPage() {
  const [loginInfo, setLoginInfo] = useState<Info>({
    email: '',
    password: ''
  });

  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({
      ...loginInfo,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const login = async (loginInfo: Info) => {
      navigate('/');
    };

    login(loginInfo);
  };

  return (
    <>
      <h2>CamilaSleep</h2>
      <h5>For Coaches</h5>

      <Container>
        <Typography level="title-lg">Login</Typography>
        <form onSubmit={handleSubmit}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
            onChange={handleChange}
            required
          />
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            color="primary">
            Submit
          </Button>
        </form>
      </Container>
    </>
  );
}
