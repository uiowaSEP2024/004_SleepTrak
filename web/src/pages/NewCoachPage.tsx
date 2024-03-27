import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Input, FormLabel, Button } from '@mui/joy';
import API_URL from '../util/apiURL';

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

function NewCoachPage() {
  const [coach, setCoach] = useState<User>({
    first_name: '',
    last_name: '',
    email: ''
  });

  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setCoach({
      ...coach,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const createCoach = async (coach: User) => {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://${API_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...coach,
          role: 'coach'
        })
      });

      const data = await response.json();
      console.log(data);

      navigate('/admin');
    };

    createCoach(coach);
  };

  return (
    <>
      <h2>Authorize New Coach</h2>

      <Container>
        <Typography level="title-lg">Enter Coach Details</Typography>
        <form onSubmit={handleSubmit}>
          <FormLabel htmlFor="first_name">First Name</FormLabel>
          <Input
            id="first_name"
            name="first_name"
            onChange={handleChange}
            required
          />
          <FormLabel htmlFor="last_name">Last Name</FormLabel>
          <Input
            id="last_name"
            name="last_name"
            onChange={handleChange}
            required
          />
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
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

export default NewCoachPage;
