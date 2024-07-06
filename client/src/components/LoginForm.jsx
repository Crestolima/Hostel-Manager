import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box, makeStyles } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/path/to/your/image.png)', // Add your background image here
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  loginCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradient background
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: theme.shadows[5],
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
  },
}));

const LoginForm = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
    setError('');
    try {
      const endpoint = role === 'user' ? 'http://localhost:5000/api/user/login' : 'http://localhost:5000/api/admin/login';
      const res = await axios.post(endpoint, { username, password });
      localStorage.setItem('token', res.data.token);
      login(res.data.token, role); // Update the auth state
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError('Invalid credentials or role mismatch');
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
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            {error && <Typography color="error">{error}</Typography>}
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
    </div>
  );
};

export default LoginForm;
