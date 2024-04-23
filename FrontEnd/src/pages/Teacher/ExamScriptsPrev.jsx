import React, { useState, useEffect } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer,
  tableCellClasses, TableHead, TableRow, Paper,
  IconButton, TextField, Button, Card, Box, CardContent
} from '@mui/material';
import { Visibility, PictureAsPdf } from '@mui/icons-material';
import axios from 'axios';
import ThemeM from './mainTheme';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function ExamScriptPageprev() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [examData, setExamData] = useState([]);

  // get all courses of a teacher and the written exams of the course
  useEffect(() => {
    const getCourses = async () => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      };

      const response = await axios.get('http://localhost:2000/api/teacher/courses', requestOptions);
      setCourses(response.data);
    }
    getCourses(); 
  }, []);

  

  const getScripts = async (courseId, examId) => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };

    axios.get('http://localhost:2000/api/teacher/courses/${courseId}/exams/${examId}/examscript', requestOptions)
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('');
      setExamData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMarksChange = (id, newValue) => {
    const updatedData = examData.map((item) =>
      item.id === id ? { ...item, givenMarks: newValue } : item
    );
    setExamData(updatedData);
  };

  const handleCommentChange = (id, newValue) => {
    const updatedData = examData.map((item) =>
      item.id === id ? { ...item, comment: newValue } : item
    );
    setExamData(updatedData);
  };

  const handleSave = async () => {
    try {
      await axios.post('', examData);
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  function viewScript(scriptName) {
    // Replace this with actual logic to view the script
    alert(`Viewing script: ${scriptName}`);
    window.open(scriptName, '_blank');
  }

  function openPdfViewer(pdfUrl) {
    window.open(pdfUrl, '_blank');
  }
  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        < ThemeM />
        <Box display="flex" alignItems="center" sx={{ margin: '30px' }} >
          <Card sx={{ width: 'full', marginTop: '50px', backgroundColor: '#e0dada' }}>
            <CardContent>
              <h1>Exam Scripts</h1>

              <TableContainer component={Paper}>
                <Table aria-label="Exam Script Table">
                  <TableHead>
                    <TableRow>
                      < StyledTableCell>Exam Name</ StyledTableCell>
                      < StyledTableCell>Student ID</ StyledTableCell>
                      < StyledTableCell>Subject</ StyledTableCell>
                      < StyledTableCell>Class</ StyledTableCell>
                      < StyledTableCell>Script</ StyledTableCell>
                      < StyledTableCell>Given Marks</ StyledTableCell>
                      < StyledTableCell>Comment</ StyledTableCell>
                      < StyledTableCell></ StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {examData.map((row, index) => (
                      <StyledTableRow key={row.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <StyledTableCell>{row.examName}</StyledTableCell>
                        <StyledTableCell>{row.stu_id}</StyledTableCell>
                        <StyledTableCell>{row.subject}</StyledTableCell>
                        <StyledTableCell>{row.class}</StyledTableCell>

                        <StyledTableCell>
                          <IconButton onClick={() => viewScript(row.script)}>
                            <Visibility />
                          </IconButton>
                          <IconButton onClick={() => openPdfViewer(row.script)}>
                            <PictureAsPdf />
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            value={row.givenMarks}
                            onChange={(e) => handleMarksChange(row.id, e.target.value)}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <TextField
                            value={row.comment}
                            onChange={(e) => handleCommentChange(row.id, e.target.value)}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <Button variant="outlined" onClick={handleSave}>
                            Save
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </div>

  );
}

export default ExamScriptPageprev;