import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses,IconButton ,Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams } from 'react-router-dom';

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
const onViewQuestions = (courseId, examId, etype) => {
  if(etype === 'MCQ')
  window.location.href = `/admin/all-courses-admin/coursedetails/${courseId}/view-mcq-question/${examId}`;
  else
  window.location.href = `/admin/all-courses-admin/coursedetails/${courseId}/view-written-question/${examId}`;
};

const onViewSummary = (courseId, examId) => {
  // console.log('View Summary', courseId, examId);
  window.location.href = `/admin/all-courses-admin/coursedetails/${courseId}/view-summary/${examId}`;
};

// function to redirect to add exam page
const handleAddExam = (courseId) => {
  window.location.href = `/admin/all-courses-admin/coursedetails/${courseId}/addexam`;
};

const onAddQuestions = (courseId, examId, etype) => {
  if(etype === 'MCQ')
  window.location.href = `/admin/coursedetails/${courseId}/add-mcq-question/${examId}`;
  else
  window.location.href = `/admin/coursedetails/${courseId}/add-written-question/${examId}`;
};

const ExamSchedule = ({ courseID, examEntries }) => {
  const [examSchedules, setExamEntries] = useState([]);
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    console.log('Exam Entries', examEntries);
    setExamEntries(examEntries);
    setCourseId(courseID);
  }, [examEntries]);

  return (
    <TableContainer component={Paper}>
      <Box display="flex" alignItems="center" marginBottom="10px">
        <h2>Exam List</h2>
        <Box marginLeft="auto" display="flex" alignItems="center">
          <h4>Add Exam</h4>
          <IconButton onClick= {() => handleAddExam(courseId)}>
            <AddCircleIcon />
          </IconButton>
        </Box>
      </Box>
      <Table aria-label="Exam Schedule">
        <TableHead>
          <TableRow>
            < StyledTableCell>Exam Name</StyledTableCell>  
            < StyledTableCell>Type</StyledTableCell> 
            < StyledTableCell>Duration</StyledTableCell>
            <StyledTableCell>Total Marks</StyledTableCell> 
            <StyledTableCell>Add question</StyledTableCell>
            <StyledTableCell>View Question</StyledTableCell>
            <StyledTableCell>View Summary</StyledTableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
          {examSchedules.map((schedule, index) => (
            <StyledTableRow key={schedule.exam_id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <StyledTableCell>{schedule.name}</StyledTableCell>
              <StyledTableCell>{schedule.exam_type}</StyledTableCell>
              <StyledTableCell>{schedule.duration}</StyledTableCell>
              <StyledTableCell>{schedule.total_marks}</StyledTableCell>
              <StyledTableCell>
                <IconButton onClick={() => onAddQuestions(courseId, schedule.exam_id, schedule.exam_type)}>
                  <AddCircleIcon />
                </IconButton>
                </StyledTableCell>
                <StyledTableCell>
                <IconButton onClick={() => onViewQuestions(courseId, schedule.exam_id, schedule.exam_type)}>
                  <VisibilityIcon />
                </IconButton>
              </StyledTableCell>
              <StyledTableCell>
                <IconButton onClick={() => onViewSummary(courseId, schedule.exam_id)}>
                  <VisibilityIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExamSchedule;
