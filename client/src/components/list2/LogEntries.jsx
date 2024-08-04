import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const LogEntryTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const PaginationButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  '& > *': {
    margin: theme.spacing(1),
  },
}));

const LogEntries = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/logs?page=${page}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data.logs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Log Entries
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <LogEntryTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Reg No</strong></TableCell>
                  <TableCell><strong>Room No</strong></TableCell>
                  <TableCell><strong>Out Time</strong></TableCell>
                  <TableCell><strong>In Time</strong></TableCell>
                  <TableCell><strong>Remarks</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{log.regNo}</TableCell>
                    <TableCell>{log.roomNo}</TableCell>
                    <TableCell>{new Date(log.outTime).toLocaleString()}</TableCell>
                    <TableCell>{log.inTime ? new Date(log.inTime).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>{log.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </LogEntryTableContainer>
          <PaginationButtons>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </PaginationButtons>
        </>
      )}
    </Box>
  );
};

export default LogEntries;
