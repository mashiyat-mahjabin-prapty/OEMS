import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems } from './sidebar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import { useNavigate } from "react-router-dom";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StyledTableCell from '@mui/material/TableCell';
import StyledTableRow from '@mui/material/TableRow';
import ThemeM from './studentTheme';
// import IconRating from 'react-icon-rating';

const handleAddCourse = () => {
  window.location.href = '/student/addcourse';
  console.log('Add Course button clicked');
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'course_name',
    numeric: true,
    disablePadding: false,
    label: 'Course Name',
  },
  // {
  //   id: 'rating',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Rating',
  // },
  {
    id: 'class',
    numeric: true,
    disablePadding: false,
    label: 'Class',
  },
  {
    id: 'subject',
    numeric: true,
    disablePadding: false,
    label: 'Subject',
  },
  {
    id: 'view exam',
    numeric: false,
    disablePadding: false,
    label: 'View Exam',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  //userID: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (

    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        marginTop: '50px',
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', fontFamily: "Helvetica Neue", fontWeight: "bold" }}
          variant="h4"
          id="tableTitle"
          component="div"
        >
          Enrolled Courses
        </Typography>
      )}
      {/* <div>
        <InputBase
          sx={{ color: 'gray' }}
          placeholder="Search..."
          inputProps={{ 'aria-label': 'search' }}
        />
      </div> */}
      <div>
        <Tooltip title="Add Course">
          <IconButton onClick={handleAddCourse}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>

  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('course_id');
  const [selected, setSelected] = React.useState([]);
  const [rows, setRows] = React.useState([]); // Initialize rows as an empty array
  const [selectedCourseExams, setSelectedCourseExams] = React.useState([]);
  const [viewExam, setViewExam] = React.useState(false, 0);
  const [courseId, setCourseId] = React.useState(0);
  const [takenExams, setTakenExams] = React.useState([]);
  const [marks, setMarks] = React.useState([]);
  const [rating, setRating] = React.useState(1);

  const defaultTheme = createTheme();

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
        setRows(data.coursesWithDetails);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching enrolled courses:', error);
      });
  }, []);


  const fetchMarks = async (examId) => {
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };

    try {
      const response = await fetch(`http://localhost:3001/api/student/courses/${courseId}/exams/${examId}/marks`, requestOptions);
      const data = await response.json();
      return data.examStudentEntry.obtained_marks;
    } catch (error) {
      console.error('Error fetching marks:', error);
      return null;
    }
  };

  const onViewExam = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      };

      const response = await fetch(`http://localhost:3001/api/student/courses/${courseId}/getallExams`, requestOptions);
      const data = await response.json();

      if (viewExam === false) setViewExam(true);
      else setViewExam(false);

      setCourseId(courseId);
      setSelectedCourseExams(data.exams);

      // Fetch marks for all exams and store them in the marks state

      const marksData = [];
      for (const schedule of data.exams) {
          const marks = await fetchMarks(schedule.exam_id);
          marksData[schedule.exam_id] = (marks !== null) ? marks : 0;
      }
      console.log(marksData);
      setMarks(marksData);

    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };
  useEffect(() => {
    // Check if a course is selected (courseId is not null or undefined)
    if (courseId && viewExam) {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      };

      fetch(`http://localhost:3001/api/student/courses/${courseId}/exams/taken`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Update the state variable with the fetched exams for the specific course
          setTakenExams(data.examsAppeared);
          // console.log('takenexams:', takenExams);
        })
        .catch((error) => {
          console.error('Error fetching exams:', error);
        });
    }
  }, [courseId, viewExam]); // Trigger the effect whenever courseId changes

  const hasStudentTakenExam = (examId) => {
    if (takenExams.length == 0) return false;
    for (let i = 0; i < takenExams.length; i++) {
      if (takenExams[i].exam_id == examId) {
        return true;
      }
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const onGiveExam = (courseId, examId, examType) => {
    if (examType == 'Written') {
      window.location.href = `/student/courses/${courseId}/exams/${examId}/written-exam`;
    }
    else
      window.location.href = `/student/courses/${courseId}/exams/${examId}/mcq-exam`;
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  
  const isSelected = (name) => selected.indexOf(name) !== -1;


  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <ThemeM />
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"

              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.course_id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <React.Fragment key={row.id}>
                        <TableRow
                          hover
                          // onClick={(event) => handleClick(event, row.name)}
                          role="checkbox"
                          tabIndex={-1}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell align="left">{row.name}</TableCell>
                           {/* <TableCell align="left">{row.rating} */}
                           {/*<IconRating
                            name="rate1"
                            starCount={5}
                            value={rating}
                            onChange={()=>onStarClick(rating)} 
                            />*/}
                          {/* </TableCell> */}
                          <TableCell align="left">{row.class}</TableCell>
                          <TableCell align="left">{row.subject}</TableCell>
                          <TableCell align="left">
                            <Button onClick={() => onViewExam(row.course_id)}>View Exams</Button>
                          </TableCell>
                        </TableRow>

                        {viewExam && selectedCourseExams.length > 0 && courseId == row.course_id && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Table aria-label="Exam Schedule">
                                <TableHead>

                                  <TableRow>
                                    <StyledTableCell>Exam Name</StyledTableCell>
                                    <StyledTableCell>Type</StyledTableCell>
                                    <StyledTableCell>Duration</StyledTableCell>
                                    <StyledTableCell>Total Marks</StyledTableCell>
                                    <StyledTableCell>Give Exam</StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {selectedCourseExams.map((schedule) => (
                                    <StyledTableRow key={schedule.exam_id}>
                                      <StyledTableCell>{schedule.name}</StyledTableCell>
                                      <StyledTableCell>{schedule.exam_type}</StyledTableCell>
                                      <StyledTableCell>{schedule.duration}</StyledTableCell>
                                      <StyledTableCell>{schedule.total_marks}</StyledTableCell>
                                      <StyledTableCell>
                                        {hasStudentTakenExam(schedule.exam_id) ? (
                                          marks[schedule.exam_id] !== 0 || schedule.exam_type === 'MCQ' ? (
                                            <Typography variant='body1'>Marks: {marks[schedule.exam_id]}</Typography>
                                          ) : (
                                            <Typography variant='body1'>Script submitted</Typography>
                                          )

                                        ) : (
                                          <Button onClick={() => onGiveExam(courseId, schedule.exam_id, schedule.exam_type)}>Give Exam</Button>
                                        )}

                                      </StyledTableCell>
                                    </StyledTableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </div>

  );
}
