import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import { Dialog } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const Transition = React.forwardRef((
  props: TransitionProps,
  ref: React.Ref<unknown>,
) => <Slide direction="left" ref={ref} {...props} />);

const useStyles = makeStyles((theme: Theme) => createStyles({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

type DialogPageProps = {
  path: string,
  title?: string | React.ReactNode,
};
const DialogPage: React.FC<DialogPageProps> = ({
  path,
  title,
  children,
}) => {
  const match = useRouteMatch(path);
  const open = !!match;
  const classes = useStyles();
  const history = useHistory();
  const handleClose = () => {
    history.goBack();
  };
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar} color="transparent" variant="outlined">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};

export default DialogPage;
