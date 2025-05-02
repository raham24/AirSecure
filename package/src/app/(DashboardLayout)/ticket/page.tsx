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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSubmitError(data.error || 'Submission failed');
    } else {
      setSubmitSuccess(true);
      setTitle('');
      setDescription('');
    }

    setSubmitLoading(false);
  };

  if (loading) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    let alertWidth = '400px';
    if (statusCode === 401) alertWidth = '210px';
    if (statusCode === 403) alertWidth = '300px';

    return (
      <Box display="flex" justifyContent="center" mt={4}>
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide as much detail as possible so we can better assist you."
        />
      </Box>

      {submitError && (
        <Box mt={3}>
          <Alert severity="error">{submitError}</Alert>
        </Box>
      )}

      {submitSuccess && (
        <Box mt={3}>
          <Alert severity="success">Ticket submitted successfully.</Alert>
        </Box>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          disabled={submitLoading}
          onClick={handleSubmit}
        >
          {submitLoading ? <CircularProgress size={24} /> : 'Submit Ticket'}
        </Button>
      </Box>
    </Box>
  );
};

export default TicketPage;
