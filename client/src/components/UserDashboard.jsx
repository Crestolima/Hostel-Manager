import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Typography,
  Divider,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const MainContent = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? drawerWidth : collapsedDrawerWidth,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(8),
}));

const ToggleButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '64px',
  backgroundColor: theme.palette.primary.main,
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#fff',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const UserDashboard = () => {
  const [open, setOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <MainContainer>
      <CssBaseline />
      <DrawerContainer variant="permanent" open={open}>
        <ToggleButtonContainer onClick={handleDrawerToggle}>
          {open ? 'HostelManager' : <ChevronRightIcon />}
        </ToggleButtonContainer>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/home')}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItem>
          <ListItem button onClick={() => navigate('/profile')}>
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            {open && <ListItemText primary="Profile" />}
          </ListItem>
          <ListItem button onClick={() => navigate('/settings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            {open && <ListItemText primary="Settings" />}
          </ListItem>
        </List>
      </DrawerContainer>
      <AppBarContainer position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            User Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={handleLogoutClick}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBarContainer>
      <MainContent open={open}>
        <Outlet />
      </MainContent>
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default UserDashboard;
