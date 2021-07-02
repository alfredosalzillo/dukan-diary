import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { Avatar, IconButton } from '@material-ui/core';
import { useAuth } from '../auth';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppBar = () => {
  const classes = useStyles();
  const history = useHistory();
  const { session } = useAuth();
  return (
    <div className={classes.root}>
      <MuiAppBar position="static" color="transparent" variant="outlined">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Dukan Diary
          </Typography>
          {
            !session && (
              <Button
                color="inherit"
                onClick={() => history.push('login')}
              >
                Login
              </Button>
            )
          }
          {
            session && (
              <IconButton>
                <Avatar />
              </IconButton>
            )
          }
        </Toolbar>
      </MuiAppBar>
    </div>
  );
};

export default AppBar;
