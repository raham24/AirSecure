'use client';
import React from 'react';
import { Select, MenuItem, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StatsPage = () => {
  const [month, setMonth] = React.useState('1');
  const handleChange = (event: any) => setMonth(event.target.value);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Area Chart: Concurrent Visits
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
      categories: [
        '2025-03-27T00:00:00.000Z',
        '2025-03-27T06:00:00.000Z',
        '2025-03-27T12:00:00.000Z',
        '2025-03-27T18:00:00.000Z',
        '2025-03-27T23:59:59.000Z',
      ],
    },
    tooltip: {
      x: { format: 'HH:mm' },
    },
    colors: [primary],
  };

  const areaSeries: any = [
    {
      name: 'Visitors',
      data: [800, 1800, 2800, 3200, 2500],
    },
  ];

  // Bar Chart: Traffic Sources
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
      categories: ['Direct', 'Links', 'Social', 'Search', 'Internal'],
    },
    yaxis: {
      title: { text: 'Visitors' },
    },
    fill: { opacity: 1 },
    colors: [primary],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} visitors`,
      },
    },
  };

  const trafficSeries: any = [
    {
      name: 'Traffic Source',
      data: [381, 74, 227, 67, 2136],
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* Concurrent Visits */}
      <DashboardCard
        title="Concurrent Visits"
        action={
          <Select
            labelId="year-dd"
            id="year-dd"
            value={month}
            size="small"
            onChange={handleChange}
          >
            <MenuItem value={1}>2024</MenuItem>
            <MenuItem value={2}>2023</MenuItem>
            <MenuItem value={3}>2022</MenuItem>
          </Select>
        }
      >
        <Chart
          options={areaOptions}
          series={areaSeries}
          type="area"
          height={370}
          width="100%"
        />
      </DashboardCard>

      {/* Performance Donut Charts */}
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2}>
        {[70, 85, 62].map((value, index) => (
          <DashboardCard key={index} title="Performance" sx={{ flex: '1 1 30%', minWidth: 250 }}>
            <Chart
              options={{
                chart: { type: 'donut' },
                labels: ['Completed', 'Remaining'],
                legend: { show: false },
                dataLabels: { enabled: false },
                colors: [primary, '#E0E0E0'],
              }}
              series={[value, 100 - value]}
              type="donut"
              width="100%"
              height={260}
            />
            <Box textAlign="center" mt={2}>
              <Typography variant="h6">{value}%</Typography>
              <Typography variant="caption" color="text.secondary">Efficiency</Typography>
            </Box>
          </DashboardCard>
        ))}
      </Box>

      {/* Traffic Sources */}
      <DashboardCard title="Traffic Sources">
        <Chart
          options={trafficOptions}
          series={trafficSeries}
          type="bar"
          height={370}
          width="100%"
        />
      </DashboardCard>
    </Box>
  );
};

export default StatsPage;
