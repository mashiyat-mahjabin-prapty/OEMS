import React from 'react';
import { useState } from 'react';
import { Box, margin } from '@mui/system';
import { useParams } from 'react-router-dom';
import THemeM from './adminTheme';
import TextField from '@mui/material/TextField';
import axios from 'axios'; 
import { Button, Typography, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';


function AddExamPage() {
  const { courseId } = useParams();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [marks, setMarks] = useState('');
  const [examtype, setExamtype] = useState('');
  
    const handleAddExam = async () => {
      console.log(courseId);
        try {
            const examData = {
              name: name,
              duration: duration,
              total_marks: marks,
              exam_type: examtype,
            };
          // Send the exam data to the backend
          const response = await axios.post(`http://localhost:2000/api/admin/courses/${courseId}/createExam`, examData);
          console.log('Exam added successfully:', response);
          window.location.href = `/teacher/courses/coursedetails/${courseId}`;
        } catch (error) {
          console.error('Error adding exam:', error);
          if(error.response.status === 404) {
            alert('Exam name already exists!');
          }
        }
      };
    
  return (
    <div>
    <Box sx={{ display: 'flex'  }}>
       <THemeM /> 
    <Box sx={{ display: 'flex', flexDirection: 'column'  ,margin:'20px' }}>
      
      <Typography variant="h4" marginTop='70px' fontFamily={"Helvetica Neue"} fontWeight={"bold"}>
        Add Exam
      </Typography>
      <Typography marginTop='20px'>
        Course ID: {courseId}
      </Typography>

      <TextField
        label="Name"
        variant="outlined"
        margin="normal"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Duration"
        variant="outlined"
        margin="normal"
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 minute intervals
        }}
      />
     <TextField
        label="Marks"
        variant="outlined"
        margin="normal"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
      />
      <FormControl variant="outlined" sx={{ margin: '8px', minWidth: 120 }}>
        <InputLabel>Exam Type</InputLabel>
        <Select
          value={examtype}
          onChange={(e) => setExamtype(e.target.value)}
          label="Type"
        >
          <MenuItem value="MCQ">MCQ</MenuItem>
          <MenuItem value="Written">Written</MenuItem>
        </Select>
      </FormControl>
      <Button variant='contained' sx={{ mt: 2, maxWidth: '200px' }} onClick={handleAddExam}>
        Add Exam
      </Button>
    </Box>
    </Box>
    </div>
  );
}

export default AddExamPage;
