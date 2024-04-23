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
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import InputBase from '@mui/material/InputBase';
import ThemeM from './studentTheme';

const headCells = [
  {
    id: 'course_name',
    numeric: true,
    disablePadding: false,
    label: 'Course Name',
  },
  {
    id: 'rating',
    numeric: true,
    disablePadding: false,
    label: 'Rating',
  },
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
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  const { selected } = props;
  const { onAddSelectedCourses } = props;
  const { onSearch } = props;
  const [searchText, setSearchText] = React.useState('');

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
          All Courses
        </Typography>
      )}
      <div>          
          <InputBase
            sx={{ color: 'gray' }}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
            value = {searchText}
            onChange={(e) => onSearch(e.target.value)}
          />
       </div>
      {numSelected > 0 ? (
        <Tooltip title="Add">
          <IconButton>
            <AddIcon onClick={onAddSelectedCourses} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>

  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  onAddSelectedCourses: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchText: PropTypes.string.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { userID } = useParams();
  const [render, setRender] = React.useState(true);
  const [rows, setRows] = React.useState([]); // Initialize rows as an empty array
  const [filteredRows, setFilteredRows] = React.useState([]); // Initialize rows as an empty array

  const defaultTheme = createTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };

    fetch('http://localhost:3001/api/student/courses/getallCoursesbyclass', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setRows(data.coursesNotEnrolled);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching available courses:', error);
      });
  }, []);

  // Updated handleClick function to manage selected course IDs
  const handleClick = (event, course_id) => {
    const selectedIndex = selected.indexOf(course_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, course_id];
    } else if (selectedIndex >= 0) {
      newSelected = selected.filter((id) => id !== course_id);
    }

    setSelected(newSelected);
  };

  // Function to confirm enrollment
  const handleAddSelectedCourses = () => {
    const token = localStorage.getItem('token');
    console.log(selected);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ selected }), // Assuming your server expects the body to be in JSON format
    };

    fetch('http://localhost:3001/api/student/courses/enroll', requestOptions)
      .then((response) => {
        if(response.ok)
        {
          window.location.reload();
          return response.json();
        } 
      })
      .catch((error) => {
        console.error('Error enrolling in the course:', error);
      });
  };
  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
  
    const filteredRows = rows.filter((row) =>
      row.name.toLowerCase().includes(searchText) ||
      row.subject.toLowerCase().includes(searchText)
    );
    
    setRows(filteredRows);
  };
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.course_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <ThemeM />
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar
              numSelected={selected.length}
              selected={selected}
              onAddSelectedCourses={handleAddSelectedCourses}
              onSearch={handleSearch}
            />
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
                  rowCount={filteredRows.length}
                />
                <TableBody>
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.course_id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.course_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.course_id}
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
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.rating}</TableCell>
                        <TableCell align="left">{row.class}</TableCell>
                        <TableCell align="left">{row.subject}</TableCell>
                      </TableRow>
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
