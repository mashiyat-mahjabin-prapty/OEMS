import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses,IconButton ,Box, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams } from 'react-router-dom';
import ThemeM from './mainTheme';
import ChartStat from './BarChart';
import Pie from './pieChart';

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

const ViewSummary = () => {
  const [summaryEntries, setSummaryEntries] = useState([]);
  const [examStudentsCount, setExamStudentsCount] = useState(0);
  const courseID = useParams().courseId;
  const examID = useParams().examId;

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
    const response = axios.get(`http://localhost:2000/api/teacher/courses/${courseID}/exams/${examID}/summary`, requestOptions)
      .then((response) => {
        console.log('response', response.data);
        setSummaryEntries(response.data.exam);
        setExamStudentsCount(parseInt(response.data.total));
        // console.log('Summary Entries:', summaryEntries);
        // console.log('Count:', examStudentsCount);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box sx={{ display: 'flex'  }}>
    < ThemeM /> 
    <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop:'50px' }}>
    <Typography variant="h4" component="h4" sx={{ fontFamily:'Helvetica Neue', fontWeight:'Bold'}} >
    Exam Summary
    </Typography> 
    <Grid  marginTop={'40px'} container spacing={2} sx={{ p: 3 }}>
    {/* <Grid item xs={12} sm={6} md={6}  >
      <Box alignContent={'center'} boxShadow={'inherit'}>
       < Pie SummaryEntries="summaryEntries" count1="examStudentsCount" marginTop="50px"/> 
      </Box>
    
  </Grid>  */}
    {/* <Grid item xs={12} sm={6} md={6} >
    <ChartStat SummaryEntries="summaryEntries"  />
    </Grid>  */}

    
   
    <TableContainer component={Paper}>
      <Box display="flex" alignItems="center" marginTop="50px"  marginBottom="10px">
      <h2> Exam Details </h2>
      </Box>
      <Table aria-label="Exam History">
        <TableHead>
          <TableRow>
            < StyledTableCell>Student ID</StyledTableCell>  
            < StyledTableCell>Student Name</StyledTableCell> 
            < StyledTableCell>Class</StyledTableCell>
            <StyledTableCell>Obtained Marks</StyledTableCell> 
           
          </TableRow>
        </TableHead>
        <TableBody>
          {summaryEntries.map((studentEntry, index) => (
            <StyledTableRow key={studentEntry.studentId} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <StyledTableCell>{studentEntry.studentId}</StyledTableCell>
              <StyledTableCell>{studentEntry.studentName}</StyledTableCell>
              <StyledTableCell>{studentEntry.studentClass}</StyledTableCell>
              <StyledTableCell>{studentEntry.obtainedMarks}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    </Box>
    </Box>

  );
};

export default ViewSummary;
