'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { set } from 'lodash';

type AuthUser = {
  id: number;
  name: string | null;
  email: string;
};

const TicketPage = () => {
  const theme = useTheme();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/basic') 
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || 'Unauthorized');
          setStatusCode(res.status);
          setLoading(false);
          return;
        }
        const userData = await res.json();
        setUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to verify user.');
        console.error(err);
        setLoading(false);
      });
  }, []);
  

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    let alertWidth = '400px';
  
    if (statusCode === 401) {
      alertWidth = '210px';
    }
    if (statusCode === 403) {
      alertWidth = '300px';
    }
  
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={4}
      >
        <Alert
          severity="error"
          sx={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            width: alertWidth,
            textAlign: 'center',
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }
  
  
  

  // if (error) {
  //   return (
  //     <Box p={4}>
  //       <Alert severity="error">{error}</Alert>
  //     </Box>
  //   );
  // }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Hi {user?.name ?? 'User'}, what do you need help with?
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
