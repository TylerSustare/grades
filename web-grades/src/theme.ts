import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import { dark } from '@material-ui/core/styles/createPalette';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#002952',
    },
    // secondary: {
    // main: '#19857b',
    // },
    // error: {
    // main: red.A400,
    // },
    // background: {
    // default: '#000',
    // },
    type: 'dark',
  },
});

export default theme;
