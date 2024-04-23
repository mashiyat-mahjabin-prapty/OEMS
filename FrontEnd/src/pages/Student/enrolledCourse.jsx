import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CoursePage.css';

function CoursePage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEnrollConfirmationOpen, setIsEnrollConfirmationOpen] = useState(false);
  const [isUnenrollConfirmationOpen, setIsUnenrollConfirmationOpen] = useState(false);

  // Fetch enrolled courses from the API
  useEffect(() => {
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };

    fetch('http://localhost:3001/api/student/courses/getallEnrolledCourses', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setEnrolledCourses(data.coursesWithDetails);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching enrolled courses:', error);
      });

    fetch('http://localhost:3001/api/student/courses/getallCoursesbyclass', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setAvailableCourses(data.courses);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching available courses:', error);
      });
  }, []);
  // Function to enroll in a course
  const enrollCourse = (course) => {
    setSelectedCourse(course);
    console.log("from enrollCourse" ,course);
    setIsEnrollConfirmationOpen(true);
  };

  // Function to unenroll from a course
  const unenrollCourse = (course) => {
    setSelectedCourse(course);
    setIsUnenrollConfirmationOpen(true);
  };

  // Function to confirm enrollment
  const confirmEnroll = () => {
    const token = localStorage.getItem('token');
    // cons
    const courseId = selectedCourse.course_id;
    console.log(courseId);
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ courseId }), // Assuming your server expects the body to be in JSON format
    };
  
    fetch('http://localhost:3001/api/student/courses/enroll', requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        // Enrollment successful, update your UI or state as needed
        setIsEnrollConfirmationOpen(false);
      })
      .catch((error) => {
        console.error('Error enrolling in the course:', error);
      });
  };
  

  // Function to confirm unenrollment
  const confirmUnenroll = () => {
    axios.post(`http://localhost:3001/course/unenroll-course/${selectedCourse.id}`, null, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(() => {
       
        setIsUnenrollConfirmationOpen(false);
      })
      .catch((error) => {
        console.error('Error unenrolling from the course:', error);
      });
  };

  return (
    <div className="course-container">
      <h1>Enrolled Courses</h1>
      <ul className="course-list">
        {(enrolledCourses.length === 0) ? (
          <p>Loading...</p>
        ) : (
          enrolledCourses.map((course) => (
            <li key={course.id} className="course-item">
              <div>
                <span className="course-name">{course.name}</span>
                <button className="unenroll-button" onClick={() => unenrollCourse(course)}>
                  Unenroll
                </button>
                <Link to={`/course-details/${course.id}`} className="details-link">
                  See Details
                </Link>
              </div>
            </li>
          )
          ))}
      </ul>

      <h1>Available Courses</h1>
      <ul className="course-list">
        {(availableCourses.length === 0) ? (
          <p>Loading...</p>
        ) : (
          availableCourses.map((course) => (
            <li key={course.id} className="course-item">
              <div>
                <span className="course-name">{course.name}</span>
                <button className="enroll-button" onClick={() => enrollCourse(course)}>
                  Enroll
                </button>
                <Link to={`/course-details/${course.id}`} className="details-link">
                  See Details
                </Link>
              </div>
            </li>
            )))}
      </ul>

      <Link to="/dashboard" className="dashboard-link">
        Go back to dashboard
      </Link>

      {selectedCourse && (
        <>
          {isEnrollConfirmationOpen && (
            <div className="confirmation-modal">
              <p>Are you sure you want to enroll in {selectedCourse.name}?</p>
              <button onClick={confirmEnroll} className="confirmation-button">Yes</button>
              <button onClick={() => setIsEnrollConfirmationOpen(false)} className="confirmation-button">No</button>
            </div>
          )}

          {isUnenrollConfirmationOpen && (
            <div className="confirmation-modal">
              <p>Are you sure you want to unenroll from {selectedCourse.name}?</p>
              <button onClick={confirmUnenroll} className="confirmation-button">Yes</button>
              <button onClick={() => setIsUnenrollConfirmationOpen(false)} className="confirmation-button">No</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CoursePage;