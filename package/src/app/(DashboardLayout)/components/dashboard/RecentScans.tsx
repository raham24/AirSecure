'use client';

import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';

type Scan = {
  id: number;
  timestamp: string;
  apn: string;
  status: string;
  device: {
    name: string;
  };
};

const RecentTransactions = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/scans');
        if (!res.ok) throw new Error('Failed to fetch scans');
        const scanData = await res.json();
        setScans(scanData);
      } catch (err) {
        console.error(err);
        setError('Failed to load scan data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string): 'primary' | 'error' | 'success' | 'warning' => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'primary';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatScanMessage = (status: string, deviceName: string) => {
    return `${status.charAt(0).toUpperCase() + status.slice(1)} scan in ${deviceName}`;
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert
          severity="error"
          sx={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            width: '300px',
            textAlign: 'center',
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <DashboardCard title="Recent Scans">
      <Timeline
        sx={{
          p: 0,
          mb: '-1',
          '& .MuiTimelineConnector-root': {
            width: '1px',
            backgroundColor: '#efefef',
          },
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.5,
            paddingLeft: 0,
          },
        }}
      >
        {scans.map((scan) => (
          <TimelineItem key={scan.id}>
            <TimelineOppositeContent>{formatTime(scan.timestamp)}</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={getStatusColor(scan.status)} variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography fontWeight="600">
                {formatScanMessage(scan.status, scan.device.name)}
              </Typography>
              <Typography variant="caption">Status: {scan.status}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </DashboardCard>
  );
};

export default RecentTransactions;
