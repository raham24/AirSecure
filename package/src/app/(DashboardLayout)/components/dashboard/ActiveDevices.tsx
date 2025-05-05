'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab, CircularProgress, Alert } from '@mui/material';
import { IconArrowDownRight, IconDevices } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MonthlyEarnings = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';

  const [activeCount, setActiveCount] = useState<number>(0);
  const [scanData, setScanData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/devices', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to fetch device data');
        }
        const data = await res.json();
        setActiveCount(data.activeCount);
        setScanData(data.scanCounts);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 90,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: { size: 0 },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const seriescolumnchart: any = [
    {
      name: '',
      color: secondary,
      data: scanData,
    },
  ];

  if (loading) {
    return (
      <DashboardCard title="Active Devices">
        <CircularProgress />
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Active Devices">
        <Alert severity="error">{error}</Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Active Devices"
      action={
        <Link href="/devices">
          <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
            <IconDevices width={24} />
          </Fab>
        </Link>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height={90}
          width="100%"
        />
      }
    >
      <Typography variant="h3" fontWeight="700" mt="-20px">
        {activeCount}
      </Typography>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
