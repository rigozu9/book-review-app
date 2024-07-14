// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Old Standard TT", serif',
  },
  palette: {
    primary: {
      main: '#2E7D32', // Dark green color
    },
    secondary: {
      main: '#A5D6A7', // Lighter green color for secondary elements
    },
    background: {
      default: '#003319', // Dark green background
      paper: '#white',   // Even darker green for paper elements
    },
    text: {
      primary: '#FFFFFF', // White text for contrast
      secondary: '#B2DFDB', // Light green text for secondary contrast
    },
  },
});

export default theme;
