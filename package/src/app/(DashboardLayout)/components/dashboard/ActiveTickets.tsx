'use client';

import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';

type Ticket = {
  id: number;
  title: string;
  priority: string;
  status: string;
  user: {
    name: string | null;
    email: string;
  };
};

type AuthUser = {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
};

const ProductPerformance = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/users/admin', {
          credentials: 'include',
        });
        if (!userRes.ok) {
          const err = await userRes.json();
          throw new Error(err.error || 'Unauthorized');
        }

        const userData = await userRes.json();
        setAuthUser(userData);

        if (!userData.isAdmin) {
          throw new Error('Not authorized to view this content.');
        }

        const ticketRes = await fetch('/api/dashboard/tickets', {
          credentials: 'include',
        });
        if (!ticketRes.ok) throw new Error('Failed to fetch tickets');
        const ticketData = await ticketRes.json();
        setTickets(ticketData);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'primary.main';
      case 'medium':
        return 'secondary.main';
      case 'high':
        return 'error.main';
      case 'critical':
        return 'success.main';
      default:
        return 'grey.500';
    }
  };

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'open') return 'green';
    if (normalized === 'closed') return 'red';
    return 'gray';
  };

  if (loading) {
    return (
      <DashboardCard title="Active Tickets">
        <CircularProgress />
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Active Tickets">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Active Tickets">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Table aria-label="ticket table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Id</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Submitted By</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Title</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>Priority</Typography></TableCell>
              <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>Status</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>
                  <Typography fontSize="15px" fontWeight="500">
                    {ticket.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {ticket.user.name ?? ticket.user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize="15px" fontWeight="500">
                    {ticket.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    size="small"
                    sx={{
                      px: '4px',
                      backgroundColor: getPriorityColor(ticket.priority),
                      color: '#fff',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    fontSize="15px"
                    fontWeight="500"
                    color={getStatusColor(ticket.status)}
                  >
                    {ticket.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default ProductPerformance;
