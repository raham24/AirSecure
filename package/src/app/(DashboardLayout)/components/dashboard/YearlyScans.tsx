'use client';

import React, { useEffect, useState } from 'react';
import { Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SalesOverview = () => {
  const [year, setYear] = useState('2025');
  const [completedData, setCompletedData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/yearly?year=${year}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to load data');
        }
        const data = await res.json();
        const completed = data.map((m: any) => m.completed);
        setCompletedData(completed);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year]);

  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: true },
      height: 370,
    },
    colors: [primary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '42%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: 'butt',
      colors: ['transparent'],
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
    },
    yaxis: { tickAmount: 4 },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: { show: false },
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    { name: 'Completed Scans', data: completedData || Array(12).fill(0) },
  ];

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <DashboardCard
      title={`Completed Scans - ${year}`}
      action={
        <Select
          labelId="year-dd"
          id="year-dd"
          value={year}
          size="small"
          onChange={(e) => setYear(e.target.value)}
        >
          <MenuItem value="2025">2025</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
        </Select>
      }
    >
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height={370}
        width="100%"
      />
    </DashboardCard>
  );
};

export default SalesOverview;
