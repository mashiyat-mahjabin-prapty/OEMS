import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import axios from 'axios';
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import { storage } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useParams } from 'react-router-dom';
import Notification from './Notification'; // Replace with the actual path to your Notification component

const duration = '60 minutes';

const WrittenExam = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [remainingTime, setRemainingTime] = useState(60 * 60); // 60 minutes in seconds
  const [answerScriptUrl, setAnswerScriptUrl] = useState('');
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [examData, setExamData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { courseId, examId } = useParams();
  const fetchImageURLPromises = [];




  const [showNotification, setShowNotification] = useState(false);
  const [isPageVisible, setPageVisible] = useState(true);

  // const [selectedFile, setSelectedFile] = useState(null);
  // const [remainingTime, setRemainingTime] = useState(60 * 60); // 60 minutes in seconds
  // const [answerScriptUrl, setAnswerScriptUrl] = useState('');
  // const [questions, setQuestions] = useState([]);
  // const [timeLeft, setTimeLeft] = useState(null);
  // const [isTimeUp, setIsTimeUp] = useState(false);
  // const [examData, setExamData] = useState(null);
  const [imageUrls, setImageUrls] = useState({}); // To store image URLs
  // const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isTimeUp && !isSubmitted) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  
    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTimeUp, isSubmitted]);


  const sendTabSwitchEvent = () => {
    fetch(`http://localhost:3001/api/student/exam/${examId}/deductMarks`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        eventType: 'tab-switch', // You can customize this event type
        timestamp: Date.now(),   // Include a timestamp if needed
      })
    })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to send tab switch event');
        }
      })
      .catch(error => {
        console.error('Error sending tab switch event:', error);
      });
  };


  const handleVisibilityChange = () => {
    if (document.hidden) {
      // The page is not visible (user switched tabs or opened a new tab)
      setPageVisible(false);
      // setShowNotification(true); // Show the notification
      // Send a request to the backend to record the event
      sendTabSwitchEvent();
    } else {
      // The page is visible again
      setPageVisible(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000); // Hide the notification after 3 seconds
      // setShowNotification(false); // Hide the notification
    }
  };

  const handleFileChange = async (event) => {
    console.log("file changed");
    const file = event.target.files[0];

    try {
      if (file == null) return;

      const storageRef = ref(storage, `answer_scripts/${file.name}`);
      const response = await uploadBytes(storageRef, file);

      const firebase_ref_url = `answer_scripts/${file.name}`;
      setAnswerScriptUrl(firebase_ref_url);

      console.log('File uploaded successfully:', response.data);
      console.log(firebase_ref_url);

      setSelectedFile(file); // Set the selected file first

    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  const handleUpload = async () => {
    if (selectedFile) {
      // make a post request to the backend API with token and passing the token and answer script url and examid
      const requestData = {
        answer_script_url: answerScriptUrl,
        exam_id: examId,
      }
      setIsSubmitted(true);
      console.log(requestData);
      fetch(`http://localhost:3001/api/student/courses/${courseId}/exams/${examId}/submitWrittenAnswer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(requestData),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        }
        )
        .catch((error) => {
          console.error('Error:', error);
        }
      );

    }
  };

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimeUp(true);
    }
    // console.log('Bearer ' + localStorage.getItem('token'));
  }, [timeLeft]);


  useEffect(() => {
    console.log('courseID:', courseId);
    console.log('examID:', examId);

    
    axios.get(`http://localhost:3001/api/student/courses/${courseId}/exams/${examId}/loadWrittenExam`,
      {
        headers: {  
              Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        })
      .then((response) => {
        console.log(response.data.exam);
        setExamData(response.data.exam);
        console.log('Exam Data:', examData);
        const fetchedQuestions = response.data.questions;
        console.log('Questions:', fetchedQuestions);

        // Fetch image URLs for each question
        fetchedQuestions.forEach((question) => {
          if (question.image_url !== null) {
            // console.log('Image URL:', question.image_url);
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
  }, [courseId, examId]);

  return (
    <div style={{ backgroundColor: '#e9e8e9' }}>
      {examData ? (
        <React.Fragment>
          <ArrowCircleLeftTwoToneIcon fontSize='large' />
          <Typography variant="h4" style={{ textAlign: 'center' }}>
            {examData.name}
          </Typography>
          {/* <Typography variant="h6" style={{ textAlign: 'center' }}>
            Course Title: {examData.exam.class}
          </Typography> */}
          {/* <Typography variant="h6" style={{ textAlign: 'center' }}>
            Total Questions: {questions.length}  Total Marks: {questions.length * 10}
          </Typography> */}
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            Duration: {duration}
          </Typography>
          <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', backgroundColor: '#e4d9e2' }}>
              {(!isTimeUp && !isSubmitted) ? (
                questions.map((question, index) => (
                  <div key={question.question_id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
                    <p>{index + 1}. {question.question_stmt}</p>
                    {question.image_url && (
                      <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={question.image_url}
                          alt="Question Image"
                        />
                      </Card>
                    )}
                  </div>
                ))
              ) : (
                // check if submitted or time up
                <div style={{ textAlign: "center" }}>
                  <h2>Exam {isSubmitted ? "submitted" : "time up"}!</h2>
                </div>
              )}
              {(!isTimeUp && !isSubmitted) && (
                <div>
                  <input
                    accept="application/pdf"
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginBottom: '10px' }}
                  />
                  <Typography variant="h8" gutterBottom>
                    Time Remaining: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    style={{ marginTop: '10px' }}
                  >
                    Submit Answer
                  </Button>
                </div>
              )}
            </Paper>
          </Container>
        </React.Fragment>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p>Loading</p>
        </div>
      )}
    </div>
  );
};


export default WrittenExam;