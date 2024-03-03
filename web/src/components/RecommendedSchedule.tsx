import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import ScheduleDeleteRowButton from './ScheduleRowDeleteButton';
import ScheduleCreateButton from './ScheduleCreateButton';
import ScheduleDeleteButton from './ScheduleDeleteButton';

function createData(name: string, time: string) {
  return { name, time };
}

const rows = [
  createData('Morning Rise', '6:30 AM'),
  createData('Morning Nap', '9:15AM - 10:45 AM'),
  createData('Afternoon Nap', '2:15PM - 3:45 PM'),
  createData('Get Ready for bed', '6:45 PM'),
  createData('Asleep', '7:15 PM')
];

export default function RecommendedSchedule() {
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        display="flex"
        justifyContent="space-between">
        <h2>Recommended Schedule</h2>
        <ScheduleCreateButton />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between">
        <h4>Schedule 1</h4>
        <ScheduleDeleteButton />
      </Box>
      <Sheet
        variant="outlined"
        sx={{
          '--TableCell-height': '40px',
          // the number is the amount of the header rows.
          '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
          '--Table-firstColumnWidth': '60px',
          '--Table-lastColumnWidth': '27px',
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
              <th style={{ width: 200 }}>Time</th>
              <th
                aria-label="last"
                style={{
                  width: 'var(--Table-lastColumnWidth)'
                }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.time}</td>
                <td>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1
                    }}>
                    <Button
                      size="sm"
                      variant="plain"
                      color="neutral">
                      Edit
                    </Button>
                    <ScheduleDeleteRowButton />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
