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

const StudentList= ({ courseID, studentEntries }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setStudents(studentEntries);
  }, [studentEntries]);
  
  return (
    <TableContainer component={Paper}>
      <h2>Students:</h2>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Class</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => (
            <StyledTableRow
              key={student.stu_id}
              className={index % 2 === 0 ? 'even-row' : 'odd-row'}
            >
              <StyledTableCell>{student.name}</StyledTableCell>
              <StyledTableCell>{student.class}</StyledTableCell>
              <StyledTableCell>{student.email}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default StudentList;
