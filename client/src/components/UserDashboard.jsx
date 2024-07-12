import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AuthContext } from './AuthContext';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import RememberMeIcon from '@mui/icons-material/RememberMe';
import BookIcon from '@mui/icons-material/Book';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const MainContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
});

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
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
}));

const AppBarContainer = styled(AppBar)(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? drawerWidth : collapsedDrawerWidth,
  width: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
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
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#000',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
}));

const UserDashboard = () => {
  const [open, setOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { authState, logout } = useContext(AuthContext);

  // Fetch regNo from auth context
  const regNo = authState.regNo;

  useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  useEffect(() => {
    console.log('Logged in regNo:', authState.regNo);
  }, [authState.regNo]);

  const handleDrawerToggle = useCallback(() => {
    setOpen(prevOpen => !prevOpen);
  }, []);

  const handleLogoutClick = useCallback(() => {
    setLogoutDialogOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setLogoutDialogOpen(false);
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleLogoutCancel = useCallback(() => {
    setLogoutDialogOpen(false);
  }, []);

  const menuItems = useMemo(() => [
    { text: 'Home', icon: <RememberMeIcon />, path: '/user-dashboard/dash' },
    { text: 'Log Entry', icon: <DoorSlidingIcon />, path: '/user-dashboard/logform' },
    { text: 'Access Log', icon: <BookIcon />, path: '/user-dashboard/log' },
  ], []);

  return (
    <MainContainer>
      <CssBaseline />
      <DrawerContainer variant="permanent" open={open}>
        <ToggleButtonContainer onClick={handleDrawerToggle}>
          {open ? 'HostelManager' : <ChevronRightIcon />}
        </ToggleButtonContainer>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem button component={Link} to={item.path} key={index}>
              <ListItemIcon style={{ color: '#000' }}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} style={{ color: '#000' }} />}
            </ListItem>
          ))}
        </List>
      </DrawerContainer>
      <AppBarContainer position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            User Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="subtitle1" noWrap>
            {regNo}
          </Typography>
          <IconButton color="inherit" onClick={handleLogoutClick}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBarContainer>
      <MainContent open={open}>
        <Outlet />
      </MainContent>
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
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
