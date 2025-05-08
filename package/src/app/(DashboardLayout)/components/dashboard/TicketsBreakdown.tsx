'use client';

import React, { useEffect, useState } from 'react';
import { Stack, Typography, CircularProgress, Alert } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const LastScanBox = () => {
  const [apn, setApn] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/last-scan')
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Could not fetch scan');
        }
        const data = await res.json();

        setApn(data.apn);

        // Add 4 hours to the timestamp
        const rawDate = new Date(data.timestamp);
        rawDate.setHours(rawDate.getHours() + 4);
        setTimestamp(rawDate.toLocaleString());

        setDeviceName(data.deviceName);
        setSerialNumber(data.serialNumber);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatus = () => {
    if (apn === '0') return { message: 'Possible threat detected', color: 'orange' };
    if (!apn || apn.toLowerCase() === 'none') return { message: 'No threat detected', color: 'green' };
    return { message: `Malicious activity by ${apn}`, color: 'red' };
  };

  const status = getStatus();

  return (
    <DashboardCard title="Last Scan">
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600} color={status.color}>
            {status.message}
          </Typography>
          {deviceName && (
            <Typography variant="subtitle2" fontWeight={500}>
              {deviceName}
            </Typography>
          )}
          {serialNumber && (
            <Typography variant="subtitle2" fontWeight={500}>
              {serialNumber}
            </Typography>
          )}
          <Typography variant="subtitle2" color="textSecondary">
            {timestamp}
          </Typography>
        </Stack>
      )}
    </DashboardCard>
  );
};

export default LastScanBox;
