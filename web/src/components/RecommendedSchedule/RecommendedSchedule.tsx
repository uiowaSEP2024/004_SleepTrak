import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import ScheduleDeleteRowButton from './ScheduleDeleteRowButton';
import ScheduleEditRowButton from './ScheduleEditRowButton';
import ScheduleDeleteButton from './ScheduleDeleteButton';
import Box from '@mui/joy/Box';

export interface Reminder {
  reminderId: string;
  planId: string;
  description: string;
  startTime: string;
  endTime: string | null;
}
export interface Plan {
  planId: string;
  clientId: string;
  coachId: string;
  reminders: Reminder[];
}

interface RecommendedScheduleProps {
  name: string;
  schedule: Plan;
  onChange: () => void;
}

export default function RecommendedSchedule(props: RecommendedScheduleProps) {
  const { name, schedule, onChange } = props;

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between">
        <h4>{name}</h4>
        <ScheduleDeleteButton
          schedule={schedule}
          onSubmit={onChange}
        />
      </Box>
      <Sheet
        variant="outlined"
        sx={{
          '--TableCell-height': '40px',
          // the number is the amount of the header rows.
          '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
          '--Table-firstColumnWidth': '60px',
          '--Table-lastColumnWidth': '47px',
          // background needs to have transparency to show the scrolling shadows
          '--TableRow-stripeBackground': 'rgba(0 0 0 / 0.04)',
          '--TableRow-hoverBackground': 'rgba(0 0 0 / 0.08)',
          overflow: 'auto',
          background: (
            theme
          ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 0 50%,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 100% 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
              0 100%`,
          backgroundSize:
            '40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'local, local, scroll, scroll',
          backgroundPosition:
            'var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)',
          backgroundColor: 'background.surface'
        }}>
        <Table
          borderAxis="bothBetween"
          stripe="odd"
          hoverRow
          sx={{
            '& tr > *:first-child': {
              position: 'sticky',
              left: 0,
              boxShadow: '1px 0 var(--TableCell-borderColor)',
              bgcolor: 'background.surface'
            },
            '& tr > *:last-child': {
              position: 'sticky',
              right: 0,
              bgcolor: 'var(--TableCell-headBackground)'
            }
          }}>
          <thead>
            <tr>
              <th style={{ width: 'var(--Table-firstColumnWidth)' }}>Event</th>
              <th style={{ width: 150 }}>Time</th>
              <th
                aria-label="last"
                style={{
                  width: 'var(--Table-lastColumnWidth)'
                }}></th>
            </tr>
          </thead>
          <tbody>
            {schedule.reminders.map((reminder) => (
              <tr key={reminder.reminderId}>
                <td>{reminder.description}</td>
                <td>{reminder.startTime + ' - ' + reminder.endTime}</td>
                <td>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1
                    }}>
                    <ScheduleEditRowButton
                      reminder={reminder}
                      onSubmit={onChange}
                    />
                    <ScheduleDeleteRowButton
                      reminder={reminder}
                      onSubmit={onChange}
                    />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
}
