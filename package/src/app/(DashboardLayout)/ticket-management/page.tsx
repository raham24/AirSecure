'use client';

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';

type Ticket = {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created: string;
  user: {
    name: string | null;
    email: string;
  };
};

export default function TicketAdminPage() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'open' | 'closed' | 'all'>('open');

  const fetchTickets = async (status: 'open' | 'closed' | 'all') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets?status=${status}`);
      if (!res.ok) throw new Error('Unauthorized or server error');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(filter);
  }, [filter]);

  const handlePriorityChange = async (id: number, newPriority: string) => {
    await fetch(`/api/tickets/${id}/priority`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority: newPriority }),
    });
    fetchTickets(filter);
  };

  const toggleTicketStatus = async (id: number, status: 'open' | 'closed') => {
    await fetch(`/api/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchTickets(filter);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Ticket Management
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter Tickets</InputLabel>
        <Select
          value={filter}
          label="Filter Tickets"
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Stack spacing={3}>
          {tickets?.map((ticket) => (
            <Card key={ticket.id} sx={{ position: 'relative', minHeight: 120 }}>
              <CardContent sx={{ pb: 10, pr: 20 }}>
                {/* Status label (top-right) */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: ticket.status === 'open' ? '#d4edda' : '#f8d7da',
                    color: ticket.status === 'open' ? '#155724' : '#721c24',
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.8rem',
                  }}
                >
                  {ticket.status.toUpperCase()}
                </Box>

                <Typography variant="h6">{ticket.title}</Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {ticket.description}
                </Typography>

                {/* Bottom-left metadata */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    color: '#6c757d',
                  }}
                >
                  <Typography variant="caption">
                    Submitted by: {ticket.user.name ?? ticket.user.email}
                  </Typography>
                  <Typography variant="caption">
                    Created: {new Date(ticket.created).toLocaleString()}
                  </Typography>
                </Box>

                {/* Priority + Action (top-right control group) */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    position: 'absolute',
                    top: 60,
                    right: 16,
                  }}
                >
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={ticket.priority}
                      label="Priority"
                      onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    color={ticket.status === 'open' ? 'error' : 'primary'}
                    onClick={() =>
                      toggleTicketStatus(ticket.id, ticket.status === 'open' ? 'closed' : 'open')
                    }
                    sx={{ height: '40px' }}
                  >
                    {ticket.status === 'open' ? 'Close' : 'Re-open'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
