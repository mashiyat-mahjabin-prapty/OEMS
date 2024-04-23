import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ThemeM from './studentTheme'

function ExamTable() {
  const [exams, setExams] = useState([]);



  // Define CSS styles for the table headers and table cells
  const tableHeaderStyle = {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  };

  const tableCellStyle = {
    borderBottom: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
  };

  useEffect(() => {
    // Fetch exam data from your API or data source here
    // Replace the URL with your actual API endpoint
    fetch('http://localhost:3001/api/student/exam/getStatistics', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setExams(data.examDetailsWithMarksAndHighestMarks))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);


  return (

    <div>
      <Box sx={{ display: 'flex' }}>
        < ThemeM />
        <Box sx={{ width: '100%' }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Student Exam Results</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Exam Name</th>
                <th style={tableHeaderStyle}>Course Name</th>
                <th style={tableHeaderStyle}>Obtained Marks</th>
                <th style={tableHeaderStyle}>Highest Marks</th>
                <th style={tableHeaderStyle}>Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{exam.exam_name}</td>
                  <td style={tableCellStyle}>{exam.course_name}</td>
                  <td style={tableCellStyle}>{exam.obtained_marks}</td>
                  <td style={tableCellStyle}>{exam.highest_marks}</td>
                  <td style={tableCellStyle}>{exam.total_marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Bar data={chartData} />
      </div> */}
        </Box>
      </Box>
    </div>
  );



}

export default ExamTable;