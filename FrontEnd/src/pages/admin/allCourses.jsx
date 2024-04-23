import React, { useState } from 'react';
import _ from 'lodash'; // Import lodash
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
TextField } from '@mui/material';
import ThemeM from './adminTheme';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';  
import AddIcon from '@mui/icons-material/Add';



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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
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
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Course Name',
  },
  {
    id: 'Cls',
    numeric: false,
    disablePadding: false,
    label: 'Class',
  },
  {
    id: 'subject',
    numeric: false,
    disablePadding: false,
    label: 'Subject',
  },
  {
    id: 'rating',
    numeric: false,
    disablePadding: false,
    label: 'Rating',
  },
  {
    id: 'duration',
    numeric: false,
    disablePadding: false,
    label: 'Duration(weeks)',
  },
  {
    id: 'details',
    numeric: false,
    disablePadding: false,
    label: 'View Details',
  }
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
              'aria-label': 'select all courses',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
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
  userID: PropTypes.string.isRequired,
};


function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  const { handleFilterIconClick } = props;
  const handleAddCourse = () => {
    // Navigate to the "Add Course" page when the icon is clicked
    window.location.href = '/admin/add-course'; // Replace with your actual URL
  };
const handleDeleteCourse = () => {
  console.log('Delete button clicked!');
  
  // Delete the selected courses
}

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'space-between', // To align the icon to the right
        alignItems: 'center', // To vertically center the icon
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
          sx={{ flex: '1 1 100%', fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}
          variant="h4"
          id="tableTitle"
          component="div"
        >
          All Courses
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon  onClick={handleDeleteCourse} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Course"> 
          <IconButton onClick={handleAddCourse}>
            <AddIcon /> 
          </IconButton>
        </Tooltip>
        
      )}
        <Tooltip title="Filter list">
        <IconButton onClick={handleFilterIconClick}>
          <FilterListIcon />
        </IconButton>

        </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [render, setRender] = React.useState(true); 
  const { userID } = useParams();
  const [rows, setRows] = React.useState([]); 

  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const handleFilterIconClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterPopoverOpen(true);
  };
  const handleFilterPopoverClose = () => {
    setFilterPopoverOpen(false);
  };

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers:
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    };
    axios.get('http://localhost:2000/api/admin/courses/', requestOptions)
      .then(response => {
        //console.log('Response data:', response.data);
        console.log('data:', response.data.courses);
        setRows(response.data.courses);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, [render]);

    useEffect(() => {
      console.log('Rows:', rows);
    }, [rows]);

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
   
  
    
    // Sorting logic
    const sortedCourses = _.orderBy(
      rows,
      [orderBy],
      [order]
    );
  
    const filteredCourses = sortedCourses.filter((course) => {
      if (!filterCriteria || !filterValue) {
        return true; // Return all courses if no criteria or value is selected
      }
    
      // Apply filtering based on the selected criteria and value
      if (filterCriteria === 'name' && course.name.toLowerCase().includes(filterValue.toLowerCase())) {
        return true;
      } else if (filterCriteria === 'subject' && course.subject.toLowerCase().includes(filterValue.toLowerCase())) {
        return true;
      } else if (filterCriteria === 'rating' && course.rating.toString() === filterValue) {
        return true;
      } else if (filterCriteria === 'Cls' && course.Cls.toString() === filterValue) {
        return true;
      }
    
      return false;
    });
    
  
    const isSelected = (name) => selected.indexOf(name) !== -1;
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
      const handleFilterCriteriaChange = (event) => {
        setFilterCriteria(event.target.value);
      };
      
      const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
      };
    const handleButtonClick = (course_id) => {
      console.log('Button clicked!');
      console.log('Course ID:', course_id);
      window.location.href = `/admin/all-courses-admin/coursedetails/${course_id}`;
    };
    
    return (
      <div>
      <Box sx={{ display: 'flex'  }}>
      < ThemeM />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 4 , display:'flex', flexDirection:'column' }}>
          <EnhancedTableToolbar numSelected={selected.length}
          handleFilterIconClick={handleFilterIconClick} />
          <TableContainer>
            <Table
              sx={{ minWidth: 600 }}
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
              <Popover
                open={filterPopoverOpen}
                anchorEl={filterAnchorEl}
                onClose={handleFilterPopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <div style={{ padding: '16px' }}>
                  <Typography variant="h6">Filter Courses</Typography>
                  <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
                    <InputLabel>Filter by</InputLabel>
                    <Select
                      value={filterCriteria}
                      onChange={handleFilterCriteriaChange}
                      label="Filter by"
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="subject">Subject</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="Cls">Class</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label={`Enter ${filterCriteria}`}
                    variant="outlined"
                    fullWidth
                    value={filterValue}
                    onChange={handleFilterValueChange}
                  />
                  <Button variant="contained" onClick={handleFilterPopoverClose}>
                    Apply Filters
                  </Button>
                </div>
              </Popover>
  
              <TableBody>
                {filteredCourses.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
  
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
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
  
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.class}</TableCell>
                      <TableCell align="center">{row.subject}</TableCell>
                      <TableCell align="center">{row.rating}</TableCell>
                    <TableCell align='center'>{row.duration}</TableCell>
                      <TableCell align="center"><button onClick={()=>handleButtonClick(row.course_id)}>View Details</button></TableCell>
                    </TableRow>
                  );
                })}
                {/* {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={7} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      </Box>
      </div>
      
    );
  }
  