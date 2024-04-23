import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import ThemeAd from './adminTheme';

const AddCourse = () => {
  const [course, setCourse] = useState({
    name: '',
    duration: '',
    cls: '',
    subject: '',
    instructors: [],
  });

  const [errors, setErrors] = useState({
    name: false, // Update this property name to "name" to match your form field
    duration: false,
    cls: false,
    subject: false,
    instructors: false,
  });

  const [instructorList, setInstructorList] = useState([]); // State for storing instructors
  const [subjects, setSubjects] = useState([]); // State for storing subjects
  const [selectedInstructors, setSelectedInstructors] = useState([]); // State for storing selected instructors
  
  useEffect(() => {

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };
    axios.get('http://localhost:2000/api/admin/teachers', requestOptions)
      .then(response => {
        setInstructorList(response.data.teachers);

        console.log('teachers:', instructorList);
      })
      .catch((error) => {
        console.error('Error fetching instructors:', error);
      });

    // fetch all subject names
    axios.get('http://localhost:2000/api/admin/courses/subjects', requestOptions)
      .then(response => {
        // console.log('response:', response.data);
        setSubjects(response.data.subjectNames);
        // console.log('subjects:', subjects);
      }
      )
      .catch((error) => {
        console.error('Error fetching subjects:', error);
      }
      );
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: value,
    });
  };

  const handleInstructorsChange = (event) => {
    setSelectedInstructors(event.target.value);
    setCourse({
      ...course,
      instructors: event.target.value,
    });
  };




  const handleSubmit = async (e) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(course),
    };
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2000/api/admin/courses/createCourse', course, requestOptions);
      console.log('Course added successfully:', response);
      window.location.href = '/admin/all-courses-admin';
    } catch (error) {
      console.error('Error adding course:', error);
      if (error.response.status === 404) {
        alert('Course name already exists!');
      }
      else if (error.response.status === 400) {
        alert('Please fill all the fields!');
      }
      
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        < ThemeAd />
        <Container maxWidth="sm" >
          <Typography variant="h4" marginTop={'80px'} sx={{ marginLeft: '20px', fontFamily: 'Helvetica Neue', fontWeight: 'Bold' }}>
            Add Course
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="name"
                  value={course.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={errors.title}
                />
                {errors.title && (
                  <FormControl error>
                    <FormHelperText>Please enter a title.</FormHelperText>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  name="duration"
                  value={course.duration}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={errors.duration}
                />
                {errors.duration && (
                  <FormControl error>
                    <FormHelperText>Please enter a valid numeric duration.</FormHelperText>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Class"
                  name="cls"
                  value={course.cls}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={errors.cls}
                />
                {errors.cls && (
                  <FormControl error>
                    <FormHelperText>Please enter a class.</FormHelperText>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="subject-label">Subject</InputLabel>
                  <Select
                    labelId="subject-label"
                    id="subject"
                    name="subject"
                    value={course.subject}
                    onChange={handleChange}
                    margin="normal"
                    required
                    error={errors.subject}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.subject && (
                    <FormControl error>
                      <FormHelperText>Please select a subject.</FormHelperText>
                    </FormControl>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="instructors-label">Instructors</InputLabel>
                  <Select
                    labelId="instructors-label"
                    id="instructors"
                    name="instructors"
                    multiple
                    value={selectedInstructors}
                    onChange={handleInstructorsChange}
                    MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }} // Allow the menu to have a fixed height
                    inputProps={{ tabIndex: -1 }} // Disable keyboard focus on the menu
                  >
                    {instructorList.map((instructor) => (
                      <MenuItem key={instructor.teacher_id} value={instructor.teacher_id}>
                        <Checkbox checked={selectedInstructors.indexOf(instructor.teacher_id) !== -1} />
                        {instructor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
            <Box mt={2} textAlign="center">
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                Add Course
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </div>
  );
};

export default AddCourse;
