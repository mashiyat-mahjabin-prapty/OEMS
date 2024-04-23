import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';


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


const InstructorList = ({ courseID }) => {
  const handleViewDetails = (instructor) => {
    // Implement the logic to show instructor details
    console.log('View Details clicked for:', instructor);
  };
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    };

    axios.get(`http://localhost:2000/api/teacher/courses/${courseID}/teachers`, requestOptions)
      .then(response => {
        console.log(response.data);
        setInstructors(response.data.teachers);
      })
      .catch(error => {
        console.error('Error fetching instructors:', error);
      });
  }, [courseID]);
  
  return (
    <TableContainer component={Paper}>
      <h2>Instructors:</h2>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Expertise</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructors.map((instructor, index) => (
            <StyledTableRow
              key={instructor.teacher_id}
              className={index % 2 === 0 ? 'even-row' : 'odd-row'}
            >
              <StyledTableCell>{instructor.name}</StyledTableCell>
              <StyledTableCell>{instructor.expertise}</StyledTableCell>
              <StyledTableCell>{instructor.email}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default InstructorList;
