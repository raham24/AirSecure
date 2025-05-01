'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TimeSeriesData {
  x: string;
  y: number;
}

interface DeviceEfficiency {
  id: number;
  name: string;
  serialNumber: string;
  efficiency: number;
  totalScans: number;
}

interface ApnsByDevice {
  name: string;
  scanCount: number;
}

interface StatsData {
  timeSeriesData: TimeSeriesData[];
  deviceEfficiency: DeviceEfficiency[];
  apnsByDevice: ApnsByDevice[];
}

interface User {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
}

const StatsPage = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const handleChange = (event: any) => setTimeframe(event.target.value);

  const theme = useTheme();
  const router = useRouter();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  // Fetch user info
  useEffect(() => {
      fetch('/api/users/me') 
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

  // Fetch stats data
  useEffect(() => {
    if (!user) return;
    
    setStatsLoading(true);
    fetch(`/api/stats?timeframe=${timeframe}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || 'Failed to fetch stats data');
          setStatsLoading(false);
          return;
        }
        const data = await res.json();
        setStatsData(data);
        setStatsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch stats data');
        setStatsLoading(false);
      });
  }, [user, timeframe]);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
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

  // Area Chart: Scans Over Time
  const areaOptions: any = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'datetime',
      categories: statsData?.timeSeriesData.map(item => item.x) || [],
    },
    tooltip: {
      x: { format: 'yyyy-MM-dd' },
    },
    colors: [primary],
  };

  const areaSeries: any = [
    {
      name: 'Scans',
      data: statsData?.timeSeriesData.map(item => item.y) || [],
    },
  ];

  // Bar Chart: APNs by Device
  const trafficOptions: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: statsData?.apnsByDevice.map(item => item.name) || [],
    },
    yaxis: {
      title: { text: 'APNs' },
    },
    fill: { opacity: 1 },
    colors: [primary],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} APNs`,
      },
    },
  };

  const trafficSeries: any = [
    {
      name: 'APNs Scanned',
      data: statsData?.apnsByDevice.map(item => item.scanCount) || [],
    },
  ];

  const timeframeLabels: Record<string, string> = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Concurrent Visits */}
      <DashboardCard
        title={`Scans ${timeframeLabels[timeframe]}`}
        subtitle="Total Scans"
        action={
          <Select
            labelId="timeframe-dd"
            id="timeframe-dd"
            value={timeframe}
            size="small"
            onChange={handleChange}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
          </Select>
        }
      >
        {statsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={370}>
            <CircularProgress />
          </Box>
        ) : (
          <Chart
            options={areaOptions}
            series={areaSeries}
            type="area"
            height={370}
            width="100%"
          />
        )}
      </DashboardCard>

      {/* Performance Donut Charts */}
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" alignItems="center">
        {statsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          statsData?.deviceEfficiency.map((device) => (
            <DashboardCard key={device.id} title={device.name}>
              <>
                <Chart
                  options={{
                    chart: { type: 'donut' },
                    labels: ['Completed', 'Remaining'],
                    legend: { show: false },
                    dataLabels: { enabled: false },
                    colors: [primary, '#E0E0E0'],
                  }}
                  series={[device.efficiency, 100 - device.efficiency]}
                  type="donut"
                  width="100%"
                  height={260}
                />
                <Box textAlign="center" mt={2}>
                  <Typography variant="h6">{device.efficiency}%</Typography>
                  <Typography variant="caption" color="text.secondary">Efficiency</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Scans: {device.totalScans}
                  </Typography>
                </Box>
              </>
            </DashboardCard>
          ))
        )}
      </Box>

      {/* Traffic Sources */}
      <DashboardCard title="APNs Scanned" subtitle="APNs scanned by each scanner in the last week">
        {statsLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={370}>
            <CircularProgress />
          </Box>
        ) : (
          <Chart
            options={trafficOptions}
            series={trafficSeries}
            type="bar"
            height={370}
            width="100%"
          />
        )}
      </DashboardCard>
    </Box>
  );
};

export default StatsPage;