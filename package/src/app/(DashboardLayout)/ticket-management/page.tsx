'use client';

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

type Ticket = {
  id: number;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "New" | "Acknowledged" | "In progress" | "Closed" | "Archived";
  assignee: string;
  created: string;
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/tickets") // replace with your real route
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Unauthorized");
          return;
        }
        const data = await res.json();
        setTickets(data);
      })
      .catch((err) => {
        setError("Failed to fetch tickets.");
        console.error(err);
      });
  }, []);

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!tickets) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Submitted Tickets
      </Typography>

      <Stack spacing={2}>
        {tickets.map((ticket) => (
          <Card key={ticket.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <BugReportIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {ticket.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Assignee:</strong> {ticket.assignee}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Created:</strong> {ticket.created}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label={ticket.priority} color={
                      ticket.priority === "High"
                        ? "error"
                        : ticket.priority === "Medium"
                        ? "warning"
                        : "default"
                    } size="small" />
                    <Chip label={ticket.status} variant="outlined" size="small" />
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
