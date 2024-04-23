import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Home';
import Clipboard from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom'; 
import MenuBookIcon from '@mui/icons-material/MenuBook';

const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  window.location.href = '/';
};

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/teacher/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard"  />
    </ListItemButton>
    <ListItemButton component={Link} to="/teacher/courses"> 
      <ListItemIcon>
        <Clipboard/>
      </ListItemIcon>
      <ListItemText primary="Assigned Courses"  />
    </ListItemButton>
    <ListItemButton component={Link} to="/teacher/examscripts"> 
      <ListItemIcon>
        <MenuBookIcon/>
      </ListItemIcon>
      <ListItemText primary="Exam Scripts"  />
    </ListItemButton>
    <ListItemButton onClick={logOut}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </ListItemButton>
  </React.Fragment>
);

