import React, { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import ThemeM from './adminTheme';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import { storage } from '../../firebase'
import { ref, uploadBytes } from 'firebase/storage'

const QuestionUploadPage = () => {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [marks, setMarks] = useState('');

  //const subjects = ['Math', 'Science', 'History', 'English']; // Example subjects
  const difficultyLevels = ['Easy', 'Medium', 'Hard']; // Example difficulty levels

  const handleTextChange = (event) => {
    setQuestionText(event.target.value);
  };
  const handleAnsTextChange = (event) => {
    setAnswerText(event.target.value);
  };
  const handleImageChange = async (event) => {
    const uploadedImage = event.target.files[0];
    setImageFile(uploadedImage);
    if(uploadedImage == null) return;
    const storageRef = ref(storage, `images/${uploadedImage.name}`);
    try {
      const response = await uploadBytes(storageRef, uploadedImage);
      // const image_retrieved = ref(storage, `images/${uploadedImage.name}`);
      console.log('Image uploaded successfully:', response);
      const firebase_ref_url = `image/${uploadedImage.name}`;
      

      setImageURL(firebase_ref_url);
      // console.log(url);
      
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // const handleSubjectChange = (event) => {
  //   setSelectedSubject(event.target.value);
  // };

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const handleUpload = async () => {
    const questionData = {
      question_stmt: questionText,
      option1: answerText,
      option2: '',
      option3: '',
      option4: '',
      answer: answerText,
      type: 'Written',
      difficulty: selectedLevel,
      marks: marks,
      image_url: imageURL,
    };
    try {
      const response = await axios.post('http://localhost:2000/api/admin/courses/${CourseID}/exams/${examId}/addQuestion', questionData);
      
  
      console.log('Question uploaded successfully:', response.data);
  
      setQuestionText('');
      setAnswerText('');
      setImageFile(null);
      setSelectedLevel('');
      setImageURL('');
      setMarks('');
    } catch (error) {
      console.error('Error uploading question:', error);
    }
  };

  return (
    <div>
    <Box sx={{ display: 'flex'  }}>
      < ThemeM />
      

     
      <Box
          component="main"
          sx={{
            backgroundColor: '#f7edef',
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>

        <Typography variant="h4"  sx={{ marginLeft: '20px', fontFamily:'Helvetica Neue', fontWeight:'Bold'}}>
          Upload a Question
        </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="level-select-label">Difficulty Level</InputLabel>
        <Select
          labelId="level-select-label"
          id="level-select"
          value={selectedLevel}
          onChange={handleLevelChange}
        >
          {difficultyLevels.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Question Text"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={questionText}
        onChange={handleTextChange}
        margin="normal"
      />
      <input type="file" accept="image/*" onChange={handleImageChange} />

      <TextField
        label="Answer Text"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={answerText}
        onChange={handleAnsTextChange}
        margin="normal"
      /> 
       <div>
        <TextField
          label="Question Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />         
        </div> 
      <Button variant="contained" color="primary" onClick={handleUpload}>
      Upload Question
      </Button>
    </Container>
    </Box>
    </Box>
    </div>
  );
};

export default QuestionUploadPage;
