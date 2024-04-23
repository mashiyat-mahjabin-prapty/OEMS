import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useCallback } from 'react';
import Input from '@mui/material/Input';
import { useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const current = new Date().toISOString().split("T")[0]
  const [values, setValues] = useState(
    {
      name: '',
      password: '',
      email: '',
      contact_number: '',
      educational_qualification: '',
      address: '',
      date_of_birth: '',
      expertise: '',
      confirm_password: '',
    }
  );
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
    // fetch subject list from backend
    try {
      const response = await axios.get('http://localhost:2000/api/teacher/signup/subjects');
      // console.log(response);
      setSubjects(response.data.subjectNames);
    } catch (error) {
      console.log(error);
    }
  }
  fetchSubjects();
  }, [])

  const handleChange = (event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
    console.log(values);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubjects(event.target.value);
    // set the expertise as a single string from selectedSubjects
    let tempExpertise='';
    for(let i = 0; i < selectedSubjects.length; i++)
    {
      tempExpertise += selectedSubjects[i] + ',';
    }

    setValues({
      ...values,
      expertise: tempExpertise,
    });
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
      // const requestOptions = {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // };
      const response = await axios.post('http://localhost:2000/api/teacher/signup', values);


      if (response.status === 200) {
        alert("Teacher Registered Successfully");
        localStorage.setItem('token', response.data.token);
        window.location.href = "/teacher/dashboard";
      } else if (response.status === 404) {
        alert("Teacher already exists");
      }
      else {
        alert("Teacher Registration Failed");
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
            Sign up as Teacher
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
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
                <Input type='date'
                  placeholder='BirthDate'
                  value={values.date_of_birth} onChange={handleChange}
                  name='date_of_birth'
                  max={current}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="contact_number"
                  label="Contact Number"
                  name="contact_number"
                  autoComplete="contact_number"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="educational_qualification"
                  label="Educational Qualification"
                  name="educational_qualification"
                  autoComplete="educational_qualification"
                  onChange={handleChange}
                />
              </Grid>
              {/* <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="expertise"
                  label="Expertise"
                  name="expertise"
                  autoComplete="expertise"
                  onChange={handleChange}
                />
              </Grid> */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="subject-label">Expertise</InputLabel>
                  <Select
                    labelId="subject-label"
                    id="subjects"
                    name="Subjects"
                    multiple
                    value={selectedSubjects}
                    onChange={handleSubjectChange}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }} // Allow the menu to have a fixed height
                    inputProps={{ tabIndex: -1 }} // Disable keyboard focus on the menu
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        <Checkbox checked={selectedSubjects.indexOf(subject) !== -1} />
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/teacher-login" variant="body2">
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