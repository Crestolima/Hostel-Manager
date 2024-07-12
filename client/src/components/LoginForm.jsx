import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  makeStyles
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect fill='%23a0c4ff' width='1200' height='800'/%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='400' cy='200' r='50'/%3E%3Ccircle cx='800' cy='600' r='100'/%3E%3Crect x='100' y='300' width='150' height='100' rx='20'/%3E%3Crect x='900' y='100' width='200' height='200' rx='30'/%3E%3Cpath d='M 700,500 C 800,400 900,400 1000,500' stroke='%23ffffff' stroke-width='20' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: '$fadeIn 1s ease-in-out',
  },
  loginCard: {
    background: 'linear-gradient()', // Gradient background
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: theme.shadows[5],
    animation: '$fadeIn 2s ease-in-out',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: 'white',
    color: '#764ba2',
    '&:hover': {
      backgroundColor: '#764ba2',
      color: 'white',
    },
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1),
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
  link: {
    color: 'white',
  },
  typography: {
    color: 'white',
  },
  toggleButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  toggleButton: {
    color: 'white',
    borderColor: 'white',
    '&.Mui-selected': {
      backgroundColor: '#764ba2',
      color: 'white',
    },
    borderRadius: theme.spacing(1),
  },
}));

const LoginForm = () => {
  const classes = useStyles();
  const [usernameOrRegNo, setUsernameOrRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Toggle state for role
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use the login function from AuthContext

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === 'user' ? 'http://localhost:5000/api/user/login' : 'http://localhost:5000/api/admin/login';
      const payload = role === 'user' ? { regNo: usernameOrRegNo, password } : { username: usernameOrRegNo, password };
      const res = await axios.post(endpoint, payload);
      const username = role === 'user' ? res.data.regNo : res.data.username; // Adjust based on your API response
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', username); // Save username in local storage
      login(res.data.token, role, username); // Update the auth state
      toast.success(`${role === 'user' ? 'User' : 'Admin'} login successful!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      toast.error('Invalid credentials or role mismatch', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xs">
        <Box className={classes.loginCard}>
          <Typography variant="h4" className={classes.typography}>
            {role === 'user' ? 'User' : 'Admin'} Log In
          </Typography>
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            className={classes.toggleButtons}
            aria-label="role selection"
          >
            <ToggleButton value="user" className={classes.toggleButton}>
              User
            </ToggleButton>
            <ToggleButton value="admin" className={classes.toggleButton}>
              Admin
            </ToggleButton>
          </ToggleButtonGroup>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label={role === 'user' ? 'Registration Number' : 'Username'}
              value={usernameOrRegNo}
              onChange={(e) => setUsernameOrRegNo(e.target.value)}
              className={classes.textField}
              InputProps={{
                style: { color: 'white' },
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={classes.textField}
              InputProps={{
                style: { color: 'white' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
