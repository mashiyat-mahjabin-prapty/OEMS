import React, { useState } from 'react';
import { Button, Container,  MenuItem,   InputLabel,Select,TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,Typography } from '@mui/material';
import ThemeM from './mainTheme';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import { storage } from '../../firebase'
import { ref, uploadBytes } from 'firebase/storage'
import { useParams } from 'react-router-dom';
import './modal.css'


const UploadQuestionPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [marks, setMarks] = useState('');
  const { courseId, examId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleImageUpload = async (event) => {
    document.getElementById('submitButtonMcq').disabled = true;
    document.getElementById('submitButtonMcq').innerHTML = 'Uploading Image...';

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
      // console.log(url);
      document.getElementById('submitButtonMcq').disabled = false;
      document.getElementById('submitButtonMcq').innerHTML = 'Upload Question';
      
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const questionData = {
      question_stmt: question,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      answer: options[correctOption],
      type: 'MCQ',
      difficulty: difficultyLevel,
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
      
  
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectOption('');
      setImage(null);
      setDifficultyLevel('');
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
    window.location.href = `/teacher/courses/coursedetails/${courseId}/view-mcq-question/${examId}`;
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
          Upload a MCQ Question
        </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <div>
        {options.map((option, index) => (
          <FormControl key={index} sx={{marginRight:'20px'}}>
            <FormLabel>Option {index + 1}</FormLabel>
            <TextField
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </FormControl>
        ))}          
        </div>

        <div style={{marginBottom:'20px'}}>
        <FormControl component="fieldset">
          <FormLabel>Correct Option</FormLabel>
          <RadioGroup
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
          >
            {options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={`Option ${index + 1}`}
              />
            ))}
          </RadioGroup>
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
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              label="Difficulty Level"
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>

        </div>

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <Button id='submitButtonMcq' type="submit" variant="contained" color="primary" onClick={()=>handleSubmit}>
          Upload Question
        </Button>
      </form>
    </Container>
    </Box>
    </Box>

    
    </div>
  );
};

export default UploadQuestionPage;
