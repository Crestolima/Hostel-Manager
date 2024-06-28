// src/main.jsx
import { render } from 'preact'; // Ensure you're using Preact's render method
import App from './app.jsx'; // Import the main App component
import './index.css'; // Import any global styles
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme from Material-UI

// Create a theme instance with any customizations if needed
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#dc004e', // Custom secondary color
    },
  },
  // Add any other custom theme settings here
});

// Wrap the App component with ThemeProvider to provide the theme context
render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app') // Render the application into the 'app' element
);
