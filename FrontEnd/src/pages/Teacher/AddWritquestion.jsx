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
  FormLabel,
} from '@mui/material';
import ThemeM from './mainTheme';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import { storage } from '../../firebase'
import { ref, uploadBytes } from 'firebase/storage'
import { useParams } from 'react-router-dom';

const QuestionUploadPage = () => {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [image, setImage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [marks, setMarks] = useState('');
  const { courseId, examId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [render, setRender] = useState(false);

  const difficultyLevels = ['Easy', 'Medium', 'Hard']; // Example difficulty levels

  const handleTextChange = (event) => {
    setQuestionText(event.target.value);
  };
  const handleAnsTextChange = (event) => {
    setAnswerText(event.target.value);
  };
  const handleImageChange = async (event) => {
    document.getElementById('submitButton').disabled = true;
    document.getElementById('submitButton').innerHTML = 'Uploading Image...';

    const uploadedImage = event.target.files[0];
    setImage(uploadedImage);
    console.log(uploadedImage);
    if(uploadedImage == null) return;
    const storageRef = ref(storage, `images/${uploadedImage.name}`);
    try {
      const response = await uploadBytes(storageRef, uploadedImage);
      // const image_retrieved = ref(storage, `images/${uploadedImage.name}`);
      console.log('Image uploaded successfully:', response);
      const firebase_ref_url = `images/${uploadedImage.name}`;
      
      setImageURL(firebase_ref_url);
      console.log(firebase_ref_url);
      document.getElementById('submitButton').disabled = false;
      document.getElementById('submitButton').innerHTML = 'Upload Question';
      
    } catch (error) {
      console.error('Error uploading image:', error);      
    }
  };

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(questionData),
      };
      console.log('Request Options:', requestOptions);

      const response = await axios.post(`http://localhost:2000/api/teacher/courses/${courseId}/exams/${examId}/addQuestion`, questionData, requestOptions);
  
      console.log('Question uploaded successfully:', response.data);
      
  
      setQuestionText('');
      setAnswerText('');
      setImage(null);
      setSelectedLevel('');
      setMarks(''); 

      setIsModalOpen(true);

    } catch (error) {
      console.error('Error uploading question:', error);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddAnotherQuestion = () => {
    window.location.reload();
  };

  const handleGoToExamDetails = () => {
    window.location.href = `/teacher/courses/coursedetails/${courseId}/view-written-question/${examId}`;
  };

  
  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>Question uploaded successfully</p>
            <button onClick={handleAddAnotherQuestion}>Add Another Question</button>
            <button onClick={handleGoToExamDetails}>Go to Exam Details</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
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
          Upload a Written Question
        </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <div>
        <FormControl component="fieldset">
          <FormLabel>Answer</FormLabel>
          <TextField
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            fullWidth
            rows={4}
            multiline
            columns={4}
            margin="normal"
            variant="outlined"
          />
        </FormControl>
        </div>

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

        <div>
        <FormControl fullWidth margin="normal">
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              label="Difficulty Level"
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>

        </div>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <Button id='submitButton' type="submit" variant="contained" color="primary" onClick={()=>handleSubmit}>
          Upload Question
        </Button>
      </form>
    </Container>
    </Box>
    </Box>

    
    </div>
  );
};

export default QuestionUploadPage;
