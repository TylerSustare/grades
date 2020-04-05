import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
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
  },
});

export default theme;
