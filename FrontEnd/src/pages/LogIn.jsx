import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { useState } from 'react';
import bgstu from './background/studentbg.jpg';
import bgteach from './background/teacherbg.webp';

const StudentSignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log('Email:', email);
      console.log('Password:', password);
        try {
          const response = await axios.post('http://localhost:3001/api/student/signin', {
            email,
            password
            
          });
          console.log(response);
   
          if (response.status === 200) {
            console.log(response.data.message);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', "student");
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // localStorage.setItem('role', response.data.user.role);
            window.location.href = '/student/dashboard';
  
          } else {
            setErrorMessage(response.data.error);
          }
        } catch (error) {
           console.log('error');
          console.error('Error:', error);
        }
      };
    return (
      <Grid
        container
        item
        xs={12}
        sm={6}
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: 'url('+bgstu+')',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
        }}
      >
        <Paper elevation={3} sx={{ p:3, background: 'rgba(255, 255, 255, 0.8)' ,height: '400px', width: '400px' }}>
          <Typography component="h1" variant="h5" align='center'>Student Sign In</Typography>
          {/* Add your student sign-in form here */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleEmailChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  {/* <Grid item xs>
                    <Link href="/reset-password" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid> */}
                  <Grid item>
                    <Link href="/student/register" variant="body2" onClick={()=>localStorage.setItem('role', "student")}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
      </Paper>
    </Grid>
  );
};

const TeacherSignIn = () => {
  // Add your student sign-in content here
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    if (newValue !== email) {
      setEmail(newValue); // Update only if there's a change
    }
  };

  const handlePasswordChange = (event) => {
    const newValue = event.target.value;
    if (newValue !== password) {
      setPassword(newValue); // Update only if there's a change
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const response = await axios.post('http://localhost:2000/api/teacher/signin', {
        email,
        password
        
      });
      console.log(response);

      if (response.status === 200) {
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', "teacher");
        window.location.href = '/teacher/dashboard';
      }
        else {
            setErrorMessage(response.data.error);
          }
        } catch (error) {
          console.error('Error:', error);
          setErrorMessage('An error occurred during sign-in. Please try again.'); // Set a generic error message
        }
  };
  return (
    <Grid
      container
      item
      xs={12}
      sm={6}
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: '#f0e49d',
        backgroundImage: 'url('+bgteach+')',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
      }}
    >
      <Paper elevation={3}  sx={{p:3, background: 'rgba(255, 255, 255, 0.8)' ,height: '400px', width: '400px' }}>
        <Typography component="h1" variant="h5" align='center'>Teacher Sign In</Typography>
        {/* Add your student sign-in form here */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
               // Bind the input value to the email state
              onChange={handleEmailChange} // Call this function when the input changes
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="password"
               // Bind the input value to the password state
              onChange={handlePasswordChange} // Call this function when the input changes
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
              
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/teacher/signup" variant="body2" onClick={()=>localStorage.setItem('role', "teacher")}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Paper>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} {/* Moved inside the return JSX */}
    </Grid>
  );
};


const AdminLoginButton = () => {
    // You can add your logic for admin login here and style the button as needed
    return (
      <Button
        variant="outlined"
        color="primary"
        href="/admin/login"
        sx={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1, 
          
        }}    
        onClick={()=>localStorage.setItem('role', "admin")}
      >
        Admin Login
      </Button>
    );
  };
const SignInPage = () => {
  return (
    <Grid container spacing={0}>
      
      <StudentSignIn />
      <TeacherSignIn />
      <AdminLoginButton />
    </Grid>
  );
};

export default SignInPage;
