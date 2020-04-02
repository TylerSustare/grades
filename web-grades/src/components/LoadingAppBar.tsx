import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';

const LoadingAppBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar></Toolbar>
    </AppBar>
  );
};

export default LoadingAppBar;
