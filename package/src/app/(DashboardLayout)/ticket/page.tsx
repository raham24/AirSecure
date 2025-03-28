'use client';
import React from 'react';
import { Box, Typography, TextField, Button} from '@mui/material';
import { useTheme } from '@mui/material/styles';
//import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const TicketPage = () => {
  const theme = useTheme();
  const username = 'John'; // This can be dynamically fetched if needed

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Hi {username}, what do you need help with?
      </Typography>

      <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>
          Write a Descriptive Title
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="e.g. The router not tracking since for the last 24 hours"
          inputProps={{ maxLength: 100 }}
        />
      </Box>

      <Box mt={4}>
        <Typography variant="subtitle1" gutterBottom>
          Explain the Problem
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={6}
          placeholder="Provide as much detail as possible so we can better assist you."
        />
      </Box>
      <Box mt={4}>
        <Button variant="contained" color="primary">
          Submit Ticket
        </Button>
      </Box>
    </Box>
  );
};

export default TicketPage;

