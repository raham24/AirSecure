'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, CircularProgress, Alert } from '@mui/material';
import { IconCalendar } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const YearlyBreakup = () => {
  const theme = useTheme();
  const primarylight = '#ecf2ff';
  const resolvedColor = '#4CAF50';
  const unresolvedColor = '#FF5252';

  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnresolved] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/ticket-summary', { credentials: 'include' })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch ticket data');
        }
        const data = await res.json();
        setResolved(data.resolved);
        setUnresolved(data.unresolved);
        setTotal(data.total);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const options: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 155,
    },
    colors: [resolvedColor, unresolvedColor],
    labels: ['Resolved', 'Unresolved'],
    stroke: { show: false },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: { width: 120 },
        },
      },
    ],
  };

  const series = [resolved, unresolved];

  if (loading) {
    return (
      <DashboardCard title="Ticket Summary">
        <CircularProgress />
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Ticket Summary">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Ticket Summary (This Year)">
      <Grid container spacing={3}>
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight={700}>
            {total} Tickets
          </Typography>
          <Stack direction="row" spacing={1} mt={3} alignItems="center">
            <Avatar sx={{ bgcolor: primarylight, width: 27, height: 27 }}>
              <IconCalendar width={20} color="#1976D2" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight={600}>
              {new Date().getFullYear()}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              year to date
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: resolvedColor, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Resolved
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: unresolvedColor, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Unresolved
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={5} sm={5}>
          <Chart options={options} series={series} type="donut" height={150} width="120%" />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
