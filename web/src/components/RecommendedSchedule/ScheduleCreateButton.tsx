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

interface WakeWindowInputFieldProps {
  label: string;
  val: number;
}

function WakeWindowInputField(props: WakeWindowInputFieldProps) {
  const { val, label } = props;

  return (
    <TextField
      id="outlined-number"
      label={label}
      type="number"
      defaultValue={val}
      sx={{ my: '10px' }}
      inputProps={{
        step: 0.25,
        min: 0
      }}
      InputLabelProps={{
        shrink: true
      }}
    />
  );
}

export default function ScheduleCreateButton() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [desiredBedTime, setDesiredBedTime] =
    React.useState<dayjs.Dayjs | null>(dayjs('2023-07-18T19:30'));
  const [earliestGetReadyTime, setEarliestGetReadyTime] =
    React.useState<dayjs.Dayjs | null>(dayjs('2023-07-18T20:00'));
  const [wakeUpTime, setWakeUpTime] = React.useState<dayjs.Dayjs | null>(
    dayjs('2023-07-18T06:00')
  );
  const [numOfNaps, setnumOfNaps] = React.useState<number>(1);
  const [wakeWindows, setWakeWindows] = React.useState([6, 6]);

  const { babyId } = useParams();

  const { getAccessTokenSilently } = useAuth0();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const fetchRecommendedPlan = async () => {
      const token = await getAccessTokenSilently();

      const clientResponse = await fetch(
        `http://localhost:3000/recommended_plans/${babyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const recommendedPlan = await clientResponse.json();
      console.log(recommendedPlan);

      if (recommendedPlan !== null) {
        setnumOfNaps(recommendedPlan.numOfNaps);
        setWakeWindows(
          Array(recommendedPlan.numOfNaps + 1).fill(recommendedPlan.wakeWindow)
        );
      }
    };

    fetchRecommendedPlan();
  }, [getAccessTokenSilently, babyId]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setWakeWindows(Array.from({ length: (newValue as number) + 1 }, () => 3));
  };

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
            // TODO: handle submitting the schedule
            console.log(desiredBedTime);
            console.log(earliestGetReadyTime);
            console.log(wakeUpTime);
            console.log(wakeWindows);

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
                label="Desired Bed Time"
                defaultValue={desiredBedTime}
                onChange={setDesiredBedTime}
              />
              <TimePickerField
                label="Earliest Get Ready Time for Bed"
                defaultValue={earliestGetReadyTime}
                onChange={setEarliestGetReadyTime}
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
              {wakeWindows.map((elem, index) => (
                <WakeWindowInputField
                  key={index}
                  label={`Window ${index + 1}`}
                  val={elem}
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
