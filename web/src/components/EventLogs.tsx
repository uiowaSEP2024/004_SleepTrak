import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/joy';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import API_URL from '../util/apiURL';
import { useEffect, useState } from 'react';
import { Event } from '@prisma/client';
import { formatDateTo12HourFormat } from '../util/utils';

interface Column {
  id: 'type' | 'date' | 'time' | 'detail' | 'note';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'type', label: 'Type', minWidth: 100 },
  { id: 'date', label: 'Date', minWidth: 100 },
  {
    id: 'time',
    label: 'Time',
    minWidth: 170,
    align: 'right'
  },
  {
    id: 'detail',
    label: 'Detail',
    minWidth: 200,
    align: 'right'
  },
  {
    id: 'note',
    label: 'Note',
    minWidth: 200,
    align: 'right'
  }
];

interface Row {
  type: string;
  date: string;
  time: string;
  detail: string;
  note: string;
}

function convertEventsToRows(events: Event[]) {
  function startEndTimeToString(startTime: Date, endTime: Date | null) {
    return formatDateTo12HourFormat(endTime) === ''
      ? formatDateTo12HourFormat(startTime)
      : formatDateTo12HourFormat(startTime) +
          ' - ' +
          formatDateTo12HourFormat(endTime);
  }

  function detailToString(event: Event) {
    const foodType = event.foodType ?? '';
    const medicineType = event.medicineType ?? '';
    const amount = event.amount ? parseFloat(event.amount.toFixed(1)) : '';
    const unit = event.unit ?? '';

    if (event.type === 'nap' && event.cribStartTime && event.cribStopTime) {
      return (
        'Crib: ' + startEndTimeToString(event.cribStartTime, event.cribStopTime)
      );
    } else if (event.type === 'feed' && event.foodType) {
      return foodType + ': ' + amount + ' ' + unit;
    } else if (event.type === 'medicine' && event.medicineType) {
      return medicineType + ': ' + amount + ' ' + unit;
    }

    return '';
  }

  return events.map((event) => ({
    type: event.type,
    date: new Date(event.startTime).toLocaleDateString('en-US'),
    time: startEndTimeToString(event.startTime, event.endTime),
    detail: detailToString(event),
    note: event.note ?? ''
  }));
}

export default function EventLogs() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Row[]>([]);

  const { getAccessTokenSilently } = useAuth0();
  const { userId } = useParams();

  const fetchEventsData = async () => {
    const token = await getAccessTokenSilently();

    const searchParams = {
      ownerId: userId
    };

    const response = await fetch(`${API_URL}/events/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(searchParams)
    });

    const data = await response.json();
    setRows(convertEventsToRows(data));
  };

  useEffect(() => {
    fetchEventsData();
  }, [getAccessTokenSilently]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Typography
        sx={{ my: 2 }}
        component="div">
        Event Logs
      </Typography>
      <Paper sx={{ width: '75%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            stickyHeader
            aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: Row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
