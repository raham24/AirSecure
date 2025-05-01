"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

type User = {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Unauthorized");
          setStatusCode(res.status);
          return;
        }
        const data = await res.json();
        setUsers(data);
      })
      .catch((err) => {
        setError("Failed to fetch users.");
        console.error(err);
      });
  }, []);

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

  if (!users) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Registered Users
      </Typography>

      <Stack spacing={2}>
        {users.map((user) => (
          <Card key={user.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Name:</strong> {user.name ?? "No name"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Joined:</strong>{" "}
                    {new Date(user.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
