import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/app';
import { storage, app } from '../../firebase'
import { ref, getDownloadURL } from 'firebase/storage';
import Notification from './Notification'; // Replace with the actual path to your Notification component
import { useParams } from 'react-router-dom';

const MCQExam = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isPageVisible, setPageVisible] = useState(true);
  const [examData, setExamData] = useState(null);
  const [imageUrls, setImageUrls] = useState({}); // To store image URLs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {courseId, examId} = useParams();

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
  


  useEffect(() => {
    fetch(`http://localhost:3001/api/student/courses/${courseId}/exams/${examId}/loadMcqExam`,
    {
      headers: {  
            Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
    })
      .then(response => response.json())
      .then(data => {
        setExamData(data);
        setTimeLeft(data.exam.duration * 1); // initialize timer
        console.log(data.exam);

        // Fetch image URLs from Firebase for each question with an image_url

        const promises = data.mcqQuestions.map(question =>
          question.image_url
            ? getDownloadURL(ref(storage, question.image_url))
            : null
        );

        // Return both the promises and the data for the next step in the chain
        return { urlsPromises: Promise.all(promises), data };
      })
      .then(({ urlsPromises, data }) => urlsPromises.then(urls => ({ urls, data })))
      .then(({ urls, data }) => {
        const newImageUrls = urls.reduce((acc, url, index) => {
          if (url) {
            acc[data.mcqQuestions[index].question_id] = url;
          }
          return acc;
        }, {});
        setImageUrls(newImageUrls);
        setLoading(false);
        console.log('Bearer ' + localStorage.getItem('token'));

      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsTimeUp(true);
    }
  }, [timeLeft]);

  const handleSubmit = () => {

    setIsSubmitted(true);
    const submission = {
      examId: examData.exam.exam_id,
      answers: studentAnswers
    };

    console.log('Submitting exam:', JSON.stringify(submission));
    console.log('Bearer ' + localStorage.getItem('token'));

    fetch(`http://localhost:3001/api/student/courses/${courseId}/exams/${examId}/submitMcqAnswer`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(submission)
    })
      .then(response => response.json())
      .then(data => {
        setScore(data.final_score);
      })
      .catch(error => {
        console.error('Error submitting exam:', error);
      });
  };

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


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!examData) return null;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ borderBottom: "2px solid black", paddingBottom: "10px" }}>{examData.exam.name}</h1>
      {/* <p>{`Class: ${examData.exam.class}`}</p> */}
      <p>{`Total Marks: ${examData.exam.total_marks}`}</p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {showNotification && (
        <Notification message="You have switched tabs or minimized the window. -2 has been deducted." />
      )}


      <div style={{ margin: "20px 0", fontWeight: "bold" }}>
        Time Remaining: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
      </div>

      {(!isTimeUp && !isSubmitted) ? (
        examData.mcqQuestions.map((question, index) => (
          <div key={question.question_id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
            <p>{index + 1}. {question.question_stmt}</p>

            {imageUrls[question.question_id] && (
              <img src={imageUrls[question.question_id]} alt="Question image" style={{ maxWidth: "100%", marginBottom: "10px" }} />
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              {question.option1 && <label style={{ margin: "5px 0" }}>
                <input
                  type="radio"
                  name={`question_${question.question_id}`}
                  onChange={() => setStudentAnswers(prevAnswers => ({ ...prevAnswers, [question.question_id]: question.option1 }))}
                />

                {question.option1}
              </label>}
              {question.option2 && <label style={{ margin: "5px 0" }}>
                <input
                  type="radio"
                  name={`question_${question.question_id}`}
                  onChange={() => setStudentAnswers(prevAnswers => ({ ...prevAnswers, [question.question_id]: question.option2 }))}
                />

                {question.option2}</label>}

              {question.option3 && <label style={{ margin: "5px 0" }}>


                <input
                  type="radio"
                  name={`question_${question.question_id}`}
                  onChange={() => setStudentAnswers(prevAnswers => ({ ...prevAnswers, [question.question_id]: question.option3 }))}
                />


                {question.option3}</label>}
              {question.option4 && <label style={{ margin: "5px 0" }}>

                <input
                  type="radio"
                  name={`question_${question.question_id}`}
                  onChange={() => setStudentAnswers(prevAnswers => ({ ...prevAnswers, [question.question_id]: question.option4 }))}
                />

                {question.option4}</label>}

            </div>

          </div>
        ))
      ) : (
        // check if submitted or time up
        <div style={{ fontSize: "20px" }}>
          {isSubmitted ? "You have submitted the exam." : "Time is up!"}
        </div>
        // check for times up


      )}

      {(!isSubmitted && !isTimeUp) && (
        <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "#007BFF", color: "#FFF", border: "none", borderRadius: "5px" }}>
          Submit Exam
        </button>)

      }


      {score !== null && (
        <div style={{ marginTop: "20px", fontSize: "20px" }}>
          Your score: {score}
        </div>
      )}

    </div>
  );
};

export default MCQExam;