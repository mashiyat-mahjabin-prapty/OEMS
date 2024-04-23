import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom'; 
import MenuBookIcon from '@mui/icons-material/MenuBook';

const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  window.location.href = '/';
};

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/admin/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard"  />
    </ListItemButton>
    <ListItemButton component={Link} to="/admin/all-teachers"> 
      <ListItemIcon>
        <PersonIcon/>
      </ListItemIcon>
      <ListItemText primary="Teachers' List"  />
    </ListItemButton>
    <ListItemButton component={Link} to="/admin/all-students"> 
      <ListItemIcon>
        <SchoolIcon/>
      </ListItemIcon>
      <ListItemText primary="Students' List"  />
    </ListItemButton>
    <ListItemButton component={Link} to="/admin/all-courses-admin"> 
      <ListItemIcon>
        <MenuBookIcon/>
      </ListItemIcon>
      <ListItemText primary="Courses' List"  />
    </ListItemButton>
    <ListItemButton onClick={logOut}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </ListItemButton>
  </React.Fragment>
);

