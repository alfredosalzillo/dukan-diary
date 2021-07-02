import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import {
  Button,
  DialogActions,
  DialogContent, Grid, InputAdornment,
  TextField, TextFieldProps,
} from '@material-ui/core';
import { useInsert } from 'react-supabase';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { UserLog, UserLogType } from '../api/user_logs';
import DialogPage from '../layout/DialogPage';

type WightUnit = 'kg';
type WeightFieldProps = Omit<TextFieldProps, 'onChange' | 'value'> & {
  onChange?: (value: string) => void,
  unit?: WightUnit,
  value?: string,
};
const WeightField: React.FC<WeightFieldProps> = ({
  onChange,
  unit = 'kg',
  value,
  ...props
}) => (
  <TextField
    fullWidth
    variant="outlined"
    name="weight"
    label="Weight"
    type="number"
    InputProps={{
      endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
    }}
    value={value?.split(' ')?.[0]}
    onChange={(e) => onChange?.(`${e.target.value} ${unit}`)}
    {...props}
  />
);

const useStyles = makeStyles((theme: Theme) => createStyles({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    paddingTop: theme.spacing(4),
  },
}));

const AddUserLog = () => {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch<{ type: UserLogType }>('/new-log/:type');
  const location = useLocation();
  const [, saveUserLog] = useInsert<UserLog>('user_logs');
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState('');
  useEffect(() => {
    setDate(new Date());
    setValue('');
  }, [location.key]);
  const type = match?.params?.type;
  const handleSave = () => {
    saveUserLog({
      type,
      value,
      date: date.toISOString(),
    }).then(({ error }) => {
      if (!error) history.replace('/');
    });
  };
  return (
    <DialogPage
      path="/new-log/:type"
      title="Add a new log"
    >
      <DialogContent className={classes.content}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <KeyboardDateTimePicker
                margin="normal"
                id="date-picker"
                label="Date"
                fullWidth
                inputVariant="outlined"
                value={date}
                onChange={setDate}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {type === 'weight' && (
                <WeightField
                  fullWidth
                  variant="outlined"
                  value={value}
                  onChange={(v) => setValue(v)}
                />
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          color="primary"
          autoFocus
        >
          Save
        </Button>
      </DialogActions>
    </DialogPage>
  );
};

export default AddUserLog;
