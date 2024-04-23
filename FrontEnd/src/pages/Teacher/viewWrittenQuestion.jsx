import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, List, ListItem, ListItemText, Button, FormControl, InputLabel, Select, MenuItem, Grid, TextField, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { storage } from '../../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import BackIcon from '@mui/icons-material/ArrowBack';

const ViewQuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({});
  const [image, setImage] = useState(null);
  const courseID = useParams().courseId;
  const examID = useParams().examId;
  const fetchImageURLPromises = [];

  useEffect(() => {
    console.log('Course ID:', courseID);
    console.log('Exam ID:', examID);

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };
    // Fetch questions data from the backend
    axios
      .get(`http://localhost:2000/api/teacher/courses/${courseID}/exams/${examID}/questions`, requestOptions)
      .then((response) => {
        const fetchedQuestions = response.data.questions;

        // Fetch image URLs for each question
        fetchedQuestions.forEach((question) => {

          if (question.image_url !== null) {
            console.log('Image URL:', question.image_url);
            // Create a reference to the file in Firebase Storage
            const storageRef = ref(storage, question.image_url);

            // Fetch the download URL for the image
            const promise = getDownloadURL(storageRef).then((url) => {
              // Assign the URL to the question object
              question.image_url = url;
              return url;
            });

            // Add the promise to the array
            fetchImageURLPromises.push(promise);
          }
        });

        // Wait for all image URL fetch requests to complete
        Promise.all(fetchImageURLPromises)
          .then(() => {
            // Set the state with the modified questions array
            setQuestions([...fetchedQuestions]);
            console.log('Questions:', fetchedQuestions);
          })
          .catch((error) => {
            console.error('Error fetching image URLs:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, [courseID, examID]);

  const handleEditToggle = () => {
    // Find the selected question from the original questions array
    const selectedOriginalQuestion = questions.find(q => q.question_id === selectedQuestion);

    // Set the editedQuestion state to the original question data
    setEditedQuestion(selectedOriginalQuestion);

    setIsEditing(!isEditing);
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestion(questionId);
    setIsEditing(false);
  };

  const handleQuestionChange = (event) => {
    setEditedQuestion({ ...editedQuestion, question_stmt: event.target.value });
  };

  const handleImageChange = async (event) => {
    const uploadedImage = event.target.files[0];
    setImage(uploadedImage);
    if (uploadedImage == null) return;

    const storageRef = ref(storage, `images/${uploadedImage.name}`);
    try {
      const response = await uploadBytes(storageRef, uploadedImage);
      console.log('Image uploaded successfully:', response);

      // Use the correct URL path based on your storage structure
      const firebase_ref_url = `images/${uploadedImage.name}`;

      setEditedQuestion({ ...editedQuestion, image_url: firebase_ref_url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDifficultyChange = (event) => {
    setEditedQuestion({ ...editedQuestion, difficulty: event.target.value });
  };

  const handleAnswerChange = (event) => {
    setEditedQuestion({ ...editedQuestion, answer: event.target.value });
  };

  const handleMarksChange = (event) => {
    setEditedQuestion({ ...editedQuestion, marks: event.target.value });
  };

  const handleSave = (questionID) => {
    console.log(courseID, examID, questionID);
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(editedQuestion),
    };
    // Send updated question data to the backend
    axios.put(`http://localhost:2000/api/teacher/courses/${courseID}/exams/${examID}/updateQuestion/${questionID}`, editedQuestion, requestOptions)
      .then(response => {
        console.log('Question updated:', response.data);
        // Update the question in the local 'questions' state
        const updatedQuestions = questions.map(question => {
          if (question.id === selectedQuestion) {
            return { ...question, ...editedQuestion };
          }
          return question;
        });
        setQuestions(updatedQuestions);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating question:', error);
      });
  };

  return (
    <div>
      <IconButton href={`/teacher/courses/coursedetails/${courseID}`} style={{ marginTop: '20px' }}>
        <BackIcon />
      </IconButton>

      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h5" gutterBottom>
            {isEditing ? 'Edit Question' : 'View Question'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <List>
                {questions.map((question, index) => (
                  <ListItem
                    key={question.question_id}
                    button
                    onClick={() => handleQuestionSelect(question.question_id)}
                    selected={selectedQuestion === question.question_id}
                  >
                    <ListItemText primary={`${index + 1}. ${question.question_stmt}`} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={8}>
              {selectedQuestion !== null && (
                <div>
                  <Typography variant="subtitle1">Question:</Typography>
                  {isEditing ? (
                    <TextField
                      multiline
                      fullWidth
                      value={editedQuestion.question_stmt || ''}
                      onChange={handleQuestionChange}
                      variant="outlined"
                      rows={6}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {questions.find(q => q.question_id === selectedQuestion)?.question_stmt}
                    </Typography>
                  )}

                  <div>
                    <Typography variant="subtitle1">Image:</Typography>

                    {isEditing ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ marginBottom: '16px' }}
                        />
                        {editedQuestion.image && (
                          <img
                            src={editedQuestion.image_url}
                            alt="Question"
                            style={{ maxWidth: '100%', marginBottom: '16px' }}
                          />
                        )}
                      </div>
                    ) : (
                      <div>
                        {questions.find((q) => q.question_id === selectedQuestion)?.image_url && (
                          <img
                            src={questions.find((q) => q.question_id === selectedQuestion)?.image_url}
                            alt={`Question ${selectedQuestion}`}
                            style={{ maxWidth: '100%' }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Typography variant="subtitle1">Difficulty Level:</Typography>
                    {isEditing ? (
                      <FormControl fullWidth>
                        {/* <InputLabel>Difficulty</InputLabel> */}
                        <Select
                          value={editedQuestion.difficulty || ''}
                          onChange={handleDifficultyChange}
                        >
                          <MenuItem value="easy">Easy</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="hard">Hard</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography variant="body1">
                        {questions.find(q => q.question_id === selectedQuestion)?.difficulty}
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Typography variant="subtitle1">Answer:</Typography>
                    {isEditing ? (
                      <TextField
                        multiline
                        fullWidth
                        value={editedQuestion.answer || ''}
                        onChange={handleAnswerChange}
                        variant="outlined"
                        rows={4}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {questions.find(q => q.question_id === selectedQuestion)?.answer}
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Typography variant="subtitle1">Marks:</Typography>
                    {isEditing ? (
                      <TextField
                        multiline
                        fullWidth
                        value={editedQuestion.marks || ''}
                        onChange={handleMarksChange}
                        variant="outlined"
                        rows={4}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {questions.find(q => q.question_id === selectedQuestion)?.marks}
                      </Typography>
                    )}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                    onClick={isEditing ? () => handleSave(selectedQuestion) : handleEditToggle}
                    sx={{ marginTop: 2 }}
                  >
                    {isEditing ? 'Save Changes' : 'Edit'}
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default ViewQuestionPage;
