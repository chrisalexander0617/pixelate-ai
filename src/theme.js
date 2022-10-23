import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

/*  Manage your theme and color 
pallete to match your brand */
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;