import React, { useCallback, useEffect } from 'react';
import {
  CircularProgress,
  Container,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, Paper, Slide,
  SwipeableDrawer,
  SwipeableDrawerProps,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import KitchenIcon from '@material-ui/icons/Kitchen';
import { useHistory, useLocation } from 'react-router-dom';
import { BooleanParam, useQueryParam } from 'use-query-params';
import {
  Timeline,
  TimelineConnector, TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Page from '../layout/Page';
import { UserLogType, useUserLogInfinite } from '../api/user_logs';
import OnIntersect from '../components/OnIntersect';

type AddLogMenuProps = Pick<SwipeableDrawerProps, 'open' | 'onClose' | 'onOpen'>;
const AddLogMenu: React.FC<AddLogMenuProps> = (props) => {
  const history = useHistory();
  return (
    <SwipeableDrawer
      anchor="bottom"
      {...props}
    >
      <Container style={{ paddingTop: 20 }}>
        <Typography variant="h6">
          What do you want to log?
        </Typography>
        <List>
          <ListItem button onClick={() => history.push('/new-log/weight')}>
            <ListItemIcon>
              <LineWeightIcon />
            </ListItemIcon>
            <ListItemText primary="weight" />
          </ListItem>
          <ListItem button onClick={() => history.push('/new-log/meal')}>
            <ListItemIcon>
              <KitchenIcon />
            </ListItemIcon>
            <ListItemText primary="meal" />
          </ListItem>
        </List>
      </Container>
    </SwipeableDrawer>
  );
};

const AddLogButton = () => {
  const [opened = false, setOpened] = useQueryParam<boolean>('add_log', BooleanParam);
  return (
    <>
      <Fab
        color="primary"
        aria-label="add log"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 1,
        }}
        size="large"
        onClick={() => setOpened(true, 'replaceIn')}
      >
        <AddIcon />
      </Fab>
      <AddLogMenu
        open={opened}
        onClose={() => setOpened(undefined, 'replaceIn')}
        onOpen={() => setOpened(true, 'replaceIn')}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

type WeightTimelineLogProps = {
  id: string,
  type: UserLogType,
  value: string,
  date: string,
  last?: boolean,
};
const WeightTimelineLog: React.FC<WeightTimelineLogProps> = ({ date, value, last }) => {
  const classes = useStyles();
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot>
          <LineWeightIcon />
        </TimelineDot>
        {!last && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineOppositeContent style={{ display: 'none' }} />
      <TimelineContent>
        <Typography variant="body2" color="textSecondary">
          {new Date(date).toLocaleDateString()}
          {' '}
          {new Date(date).toLocaleTimeString()}
        </Typography>
        <Paper elevation={3} className={classes.paper} variant="outlined">
          <Typography variant="h6" component="h1">
            weight
          </Typography>
          <Typography>
            Your weight was
            {' '}
            <b>
              {value}
            </b>
          </Typography>
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
};

const Loader = () => (
  <Slide in>
    <Container style={{ paddingTop: 20 }}>
      <CircularProgress color="primary" style={{ margin: 'auto', display: 'block' }} />
    </Container>
  </Slide>
);

const Home = () => {
  const location = useLocation();
  const {
    data = [], isValidating, setSize, revalidate, size,
  } = useUserLogInfinite();
  const hasMore = data[size - 1]?.length >= 10;
  const onIntersect = useCallback((intersecting: boolean) => {
    if (!intersecting) return;
    if (isValidating) return;
    if (!hasMore) return;
    setSize((current) => current + 1);
  }, [isValidating, hasMore]);
  useEffect(() => {
    if (!location.search) revalidate();
  }, [location.key]);
  return (
    <Page>
      <AddLogButton />
      <Timeline align="left">
        {data
          .flat()
          .map((userLog, i, all) => {
            if (userLog.type === 'weight') {
              return (
                <WeightTimelineLog
                  key={userLog.id}
                  {...userLog}
                  last={!hasMore && i === all.length - 1}
                />
              );
            }
            return <></>;
          })}
      </Timeline>
      {
        (!isValidating && hasMore) && (
          <OnIntersect
            onChange={onIntersect}
          />
        )
      }
      {(isValidating) && (
        <Loader />
      )}
    </Page>
  );
};

export default Home;
