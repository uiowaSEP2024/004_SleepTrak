import * as React from 'react';
import Button from '@mui/joy/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slider from '@mui/joy/Slider';
import Grid from '@mui/joy/Grid';
import TimePickerField from '../TimePickerField';
import dayjs from 'dayjs';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { createSleepPlan } from '../../util/utils';
import API_URL from '../../util/apiURL';

interface WakeWindowInputFieldProps {
  index: number;
  label: string;
  wakeWindows: number[];
  onChange: React.Dispatch<React.SetStateAction<number[]>>;
}

export function WakeWindowInputField(props: WakeWindowInputFieldProps) {
  const { index, label, wakeWindows, onChange } = props;
  const [hours, setHours] = React.useState<number>(wakeWindows[index]);

  const handleOnChange = (newHours: string) => {
    const newHoursNum = Number(newHours);
    wakeWindows[index] = newHoursNum;
    onChange(wakeWindows);
    setHours(newHoursNum);
  };
  return (
    <TextField
      id="outlined-number"
      label={label}
      type="number"
      defaultValue={hours}
      sx={{ my: '10px' }}
      inputProps={{
        step: 0.25,
        min: 0
      }}
      InputLabelProps={{
        shrink: true
      }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        handleOnChange(event.target.value);
      }}
    />
  );
}

interface ScheduleCreateButtonProps {
  onSubmit: () => Promise<void>;
}

export default function ScheduleCreateButton(props: ScheduleCreateButtonProps) {
  const { onSubmit } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [earliestGetReadyTime, setEarliestGetReadyTime] =
    React.useState<dayjs.Dayjs | null>(dayjs('2023-01-01T19:30'));
  const [desiredBedTime, setDesiredBedTime] =
    React.useState<dayjs.Dayjs | null>(dayjs('2023-01-01T20:00'));
  const [wakeUpTime, setWakeUpTime] = React.useState<dayjs.Dayjs | null>(
    dayjs('2023-01-01T08:00')
  );
  const [numOfNaps, setnumOfNaps] = React.useState<number>(2);
  const [wakeWindows, setWakeWindows] = React.useState([3, 3, 3]);
  // TODO: Add total hours of sleep

  const { userId, babyId } = useParams();

  const { getAccessTokenSilently, user } = useAuth0();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setWakeWindows(Array.from({ length: (newValue as number) + 1 }, () => 3));
  };

  React.useEffect(() => {
    const fetchRecommendedPlan = async () => {
      const token = await getAccessTokenSilently();

      const clientResponse = await fetch(
        `http://${API_URL}/recommended_plans/${babyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const recommendedPlan = await clientResponse.json();

      if (recommendedPlan !== null) {
        setnumOfNaps(recommendedPlan.numOfNaps);
        setWakeWindows(
          Array(recommendedPlan.numOfNaps + 1).fill(recommendedPlan.wakeWindow)
        );
      }
    };
    fetchRecommendedPlan();
  }, [getAccessTokenSilently, babyId]);

  return (
    <div>
      <Button
        size="sm"
        variant="soft"
        color="primary"
        onClick={handleClickOpen}
        sx={{ m: 2 }}>
        Add Schedule
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 1100
        }}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const postSleepPlan = async () => {
              const token = await getAccessTokenSilently();

              await fetch(`http://${API_URL}/plans/create`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(
                  createSleepPlan(
                    wakeUpTime,
                    earliestGetReadyTime,
                    desiredBedTime,
                    wakeWindows,
                    numOfNaps,
                    userId,
                    user
                  )
                )
              });

              await onSubmit();
            };
            postSleepPlan();
            handleClose();
          }
        }}>
        <DialogTitle>Create a new schedule</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={3}
            sx={{ flexGrow: 1 }}>
            <Grid xs>
              <DialogContentText>Number of Naps</DialogContentText>
              <Slider
                defaultValue={numOfNaps}
                marks
                max={5}
                valueLabelDisplay="auto"
                onChange={handleSliderChange}
              />
              <TimePickerField
                label="Earliest Get Ready Time for Bed"
                defaultValue={earliestGetReadyTime}
                onChange={setEarliestGetReadyTime}
              />
              <TimePickerField
                label="Desired Bed Time"
                defaultValue={desiredBedTime}
                onChange={setDesiredBedTime}
              />
              <TimePickerField
                label="Wake Up Time"
                defaultValue={wakeUpTime}
                onChange={setWakeUpTime}
              />
            </Grid>
            <Grid xs>
              <DialogContentText sx={{ fontSize: 14 }}>
                Wake Windows (Hours Between Sleep)
              </DialogContentText>
              {wakeWindows.map((_, index) => (
                <WakeWindowInputField
                  index={index}
                  label={`Window ${index + 1}`}
                  wakeWindows={wakeWindows}
                  onChange={setWakeWindows}
                />
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
