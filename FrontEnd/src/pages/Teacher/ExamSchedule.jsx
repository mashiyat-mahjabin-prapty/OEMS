import React, { useState, useEffect } from 'react';
import {  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  IconButton,
  Box,
  Checkbox,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover, } from '@mui/material';
  import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useParams } from 'react-router-dom';
import _ from 'lodash'; // Import lodash
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
  window.location.href = `/teacher/courses/coursedetails/${courseId}/view-mcq-question/${examId}`;
  else
  window.location.href = `/teacher/courses/coursedetails/${courseId}/view-written-question/${examId}`;
};

const onViewSummary = (courseId, examId) => {
  // console.log('View Summary', courseId, examId);
  window.location.href = `/teacher/courses/coursedetails/${courseId}/view-summary/${examId}`;
};

// function to redirect to add exam page
const handleAddExam = (courseId) => {
  window.location.href = `/teacher/courses/coursedetails/${courseId}/addexam`;
};

const onAddQuestions = (courseId, examId, etype) => {
  if(etype === 'MCQ')
  window.location.href = `/teacher/course-details/${courseId}/add-mcq-question/${examId}`;
  else
  window.location.href = `/teacher/course-details/${courseId}/add-written-question/${examId}`;
};

const ExamSchedule = ({ courseID, examEntries }) => {
  const [examSchedules, setExamEntries] = useState([
    {
      exam_id: 1,
      name: 'Midterm Exam',
      exam_type: 'MCQ',
      duration: '1 hour',
      total_marks: 50,
    },
    {
      exam_id: 2,
      name: 'Final Exam',
      exam_type: 'Written',
      duration: '2 hours',
      total_marks: 100,
    }
  ]);
  const [courseId, setCourseId] = useState('');
  const [selectedExams, setSelectedExams] = useState([]); // For selected exams
  const [selectAll, setSelectAll] = useState(false); // For "Select All"
  const [sortBy, setSortBy] = useState({ column: 'name', order: 'asc' }); // For sorting
  const [filter, setFilter] = useState(''); // For filtering
  const [filterCriteria, setFilterCriteria] = useState(''); // For filterin
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    console.log('Exam Entries', examEntries);
    setExamEntries(examEntries);
    setCourseId(courseID);
  }, [examEntries]);
  const handleRowSelect = (examId) => {
    const selectedIndex = selectedExams.indexOf(examId);
    const newSelectedExams = [...selectedExams];
  
    if (selectedIndex === -1) {
      newSelectedExams.push(examId);
    } else {
      newSelectedExams.splice(selectedIndex, 1);
    }
  
    setSelectedExams(newSelectedExams);
  
    // Check if all exams are selected and toggle the "Select All" checkbox
    if (newSelectedExams.length === examSchedules.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };
  
    // Handle "Select All"
      const allRowsSelected = selectedExams.length === examSchedules.length;
    const handleSelectAll = () => {
      if (selectAll) {
        setSelectedExams([]); // Clear selected exams when unchecking "Select All"
      } else {
        setSelectedExams(examSchedules.map((schedule) => schedule.exam_id));
      }
      setSelectAll(!selectAll);
    };
  
  
   
  
    // Handle sorting
    const handleSort = (column) => {
      if (sortBy.column === column) {
        setSortBy({ ...sortBy, order: sortBy.order === 'asc' ? 'desc' : 'asc' });
      } else {
        setSortBy({ column, order: 'asc' });
      }
    };
  
    // Handle filtering
    const handleFilterChange = (event) => {
      setFilter(event.target.value);
    };
  
    // Handle filtering criteria change
    const handleFilterCriteriaChange = (event) => {
      setFilterCriteria(event.target.value);
    };
  
    // Sorting logic
    const sortedExamSchedules = _.orderBy(
      examSchedules,
      [sortBy.column],
      [sortBy.order]
    );
  
    const filteredAndSortedExamSchedules = sortedExamSchedules.filter((schedule) => {
      if (!filterCriteria) {
        // If no filter criteria is selected, return all schedules
        return true;
      }
  
      // Apply filtering based on selected criteria
      if (filterCriteria === 'name' && schedule.name.toLowerCase().includes(filter.toLowerCase())) {
        return true;
      } else if (filterCriteria === 'type' && schedule.exam_type.toLowerCase() === filter.toLowerCase()) {
        return true;
      }
     else if (filterCriteria === 'duration' && schedule.duration.toString().includes(filter)) {
      return true;
    } else if (filterCriteria === 'total_marks' && schedule.total_marks.toString().includes(filter)) {
      return true;
    }
  
      return false;
    });
  
      // Open filter popover
      const openFilterPopover = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      // Close filter popover
      const closeFilterPopover = () => {
        setAnchorEl(null);
      };
      return (
        <TableContainer component={Paper}>
        <Box display="flex" alignItems="center" marginBottom="10px">
          <h2>Exam List</h2>
          <Box marginLeft="auto" display="flex" alignItems="center">
          <IconButton onClick={openFilterPopover}>
                <FilterListIcon />
              </IconButton>
            <h4>Add Exam</h4>
            <IconButton  onClick= {() => handleAddExam(courseId)}>
              <AddCircleIcon />
            </IconButton>
          </Box>
        </Box>
    
          {/* Filter popover */}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={closeFilterPopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box p={2}>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Filter Criteria</InputLabel>
                <Select
                  value={filterCriteria}
                  onChange={handleFilterCriteriaChange}
                  label="Filter Criteria"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="type">Type</MenuItem>
                  <MenuItem value="duration">Duration</MenuItem>
                  <MenuItem value="marks">Marks</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Filter by Value"
                variant="outlined"
                value={filter}
                onChange={handleFilterChange}
                fullWidth
                margin="normal"
              />
            </Box>
          </Popover>
        <Table aria-label="Exam Schedule">
            <TableHead>
              <TableRow>
              <StyledTableCell>
              <Checkbox
                    checked={allRowsSelected}
                    onChange={handleSelectAll}
                    indeterminate={
                      !allRowsSelected &&
                      selectedExams.length > 0
                    }
                  />
               
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('name')}>
                  Exam Name
                  {sortBy.column === 'name' && (
                    // Display sorting indicator based on the current sorting order
                    sortBy.order === 'asc' ? ' ↑' : ' ↓'
                  )}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('exam_type')}>
                  Type
                  {sortBy.column === 'exam_type' && (
                    // Display sorting indicator based on the current sorting order
                    sortBy.order === 'asc' ? ' ↑' : ' ↓'
                  )}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('duration')}>
                  Duration
                  {sortBy.column === 'duration' && (
                    // Display sorting indicator based on the current sorting order
                    sortBy.order === 'asc' ? ' ↑' : ' ↓'
                  )}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('total_marks')}>
                  Total Marks
                  {sortBy.column === 'total_marks' && (
                    // Display sorting indicator based on the current sorting order
                    sortBy.order === 'asc' ? ' ↑' : ' ↓'
                  )}
                </StyledTableCell>
            <StyledTableCell>Add question</StyledTableCell>
            <StyledTableCell>View Question</StyledTableCell>
            <StyledTableCell>View Summary</StyledTableCell>
           
          </TableRow>
        </TableHead>
        <TableBody>
        {filteredAndSortedExamSchedules.map((schedule, index) => (
            <StyledTableRow key={schedule.exam_id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
            <TableCell>
                <Checkbox
                  checked={selectedExams.includes(schedule.exam_id)}
                  onChange={() => handleRowSelect(schedule.exam_id)}
                />
              </TableCell>
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
