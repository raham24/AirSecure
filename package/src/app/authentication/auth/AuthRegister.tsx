'use client';
import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { Stack } from '@mui/system';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useRouter } from 'next/navigation';

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });

    if (res.ok) {
      router.push('/authentication/login');
    } else {
      const error = await res.json();
      alert(error.error || 'Registration failed');
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}
      <Box>
        <Stack mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb="5px">
            Name
          </Typography>
          <CustomTextField 
            variant="outlined" 
            fullWidth 
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />

          <Typography variant="subtitle1" fontWeight={600} mb="5px" mt="25px">
            Email Address
          </Typography>
          <CustomTextField
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />

          <Typography variant="subtitle1" fontWeight={600} mb="5px" mt="25px">
            Password
          </Typography>
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Stack>
        <Button onClick={handleRegister} color="primary" variant="contained" size="large" fullWidth>
          Sign Up
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
