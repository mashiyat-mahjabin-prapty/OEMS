import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container, 
  Stack,
  Avatar,
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import ThemeM from './studentTheme';



export default function Page()  {
  const [values, setValues] = useState(
    {
      stu_id: '',
      name: '',
      class: '',
      password: '',
      email: '',
      date_of_birth: '',
      img: '',
    }
  );

  const getProfile = useCallback(
    async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/student/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(response);
        if (response.status === 200) {
          console.log(response.data.message);
          setValues(response.data);
        } else {
          console.log(response.data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    []
  );

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );
  const handleSave = async (event) => {
    event.preventDefault();
    
    try {
      console.log(values);
      const response = await axios.post(
        'http://localhost:3001/api/student/updateProfile',
        values,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the Bearer token here
          },
        }
      );
      
      console.log('Updated profile:', response.data); 
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };
  return (
  <div>
  <Box sx={{ display: 'flex'  }}>
  < ThemeM />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4" fontFamily={"Helvetica Neue"} fontWeight={"bold"}>
              View and Edit Profile
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
             <Card sx={{backgroundColor:'#ecdbe1'}}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* <Avatar
                    src={values.img}
                    sx={{
                      height: 80,
                      mb: 2,
                      width: 80
                    }}
                  >*/}
                  <Typography
                    gutterBottom
                    variant="h5"
                  >
                    {values.name}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  fullWidth
                  variant="text"
                >
                  Upload picture
                </Button>
              </CardActions>
            </Card>
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
              <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}
              >
                <Card >
                  <CardHeader
                    subheader="The information can be edited"
                    title="Profile"
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ m: -1.5 }}>
                      <Grid
                        container
                        spacing={3}
                      >
                        <Grid
                          xs={12}
                          md={6}
                        >
                          <TextField
                            fullWidth
                            label="Id"
                            name="id"
                            disabled
                          
                            value={values.stu_id}
                          >
              
                          </TextField>
                        </Grid>
                        <Grid
                          xs={12}
                          md={6}
                        >
                          <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            onChange={handleChange}
                            required
                            value={values.name}
                          />
                        </Grid>
                        <Grid
                          xs={12}
                          md={6}
                        >
                          <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            onChange={handleChange}
                            required
                            value={values.password}
                            type="password"

                          />
                        </Grid>
                        <Grid
                          xs={12}
                          md={6}
                        >
                          <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            onChange={handleChange}
                            required
                            value={values.email}
                          />
                        </Grid>
                        <Grid
                          xs={12}
                          md={6}
                        >
                          <TextField
                            fullWidth
                            label="Class"
                            name="class"
                            onChange={handleChange}
                            type="number"
                            value={values.class}
                          />
                        </Grid>                      
                        <Grid
                          xs={12}
                          md={6}
                        >
                          <TextField
                            fullWidth
                            label="Date Of Birth"
                            name="date_of_birth"
                            onChange={handleChange}
                            required
                            value={values.date_of_birth}
                          >
              
                          </TextField>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button variant="contained" onClick={handleSave}>
                      Save details
                    </Button>
                  </CardActions>
                </Card>
              </form>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
    </Box>
    </div>
  );

    };


