import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useCallback } from 'react';
import axios from 'axios';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const [values, setValues] = useState(
    {
      Name: '',
      password: '',
      email: '',
      confirm_password: '',
    })

    const handleChange = (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
      console.log(values);
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // check if password and confirm password are same
    if (values.password !== values.confirm_password) {
      alert("Password and Confirm Password don't match");
      return;
    }

    // check if all fields are filled
    for (const [key, value] of Object.entries(values)) {
      if (value === '') {
        alert("Please fill all the fields");
        return;
      }
    }

    try {
      console.log(values);
      
      const response = await axios.post('http://localhost:2000/api/admin/signup', values);

      if (response.status === 200) {
        alert("Admin Registered Successfully");
        localStorage.setItem('token', response.data.token);
        window.location.href = "/admin/dashboard";
      } else if (response.status === 400) {
        alert("Admin already exists");
      }
      else {
        alert("Admin Registration Failed");
      }

    } catch (error) {
      console.log(error);

    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="Name"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}sm={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm_password"
                  label="Confirm-Password"
                  type="password"
                  id="confirm_password"
                  autoComplete="new-password"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}