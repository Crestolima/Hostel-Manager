import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Typography, Divider, Box } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, AccountCircle as AccountCircleIcon, Settings as SettingsIcon, Logout as LogoutIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { styled } from '@mui/system';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const MainContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100vh',
}));

const DrawerContainer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedDrawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: open ? drawerWidth : collapsedDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

const AppBarContainer = styled(AppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  marginLeft: open ? drawerWidth : collapsedDrawerWidth,
  width: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
}));

const MainContent = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? drawerWidth : collapsedDrawerWidth,
  marginTop: theme.spacing(8),
}));

const ToggleButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '64px', // Same as the height of AppBar
  backgroundColor: theme.palette.background.default,
}));

const AdminDashboard = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <MainContainer>
      <CssBaseline />
      <DrawerContainer variant="permanent" open={open}>
        <ToggleButtonContainer>
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </ToggleButtonContainer>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItem>
          <ListItem button>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            {open && <ListItemText primary="Profile" />}
          </ListItem>
          <ListItem button>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            {open && <ListItemText primary="Settings" />}
          </ListItem>
          <ListItem button>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </DrawerContainer>
      <AppBarContainer position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle} edge="start">
            
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBarContainer>
      <MainContent open={open}>
        <Typography variant="h4">Welcome, Admin!</Typography>
        {/* Additional content can be added here */}
      </MainContent>
    </MainContainer>
  );
};

export default AdminDashboard;
