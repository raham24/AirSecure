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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

type User = {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
  isAdmin: boolean;
};

type AuthUser = {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
};

export default function UsersPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/api/users/admin", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Unauthorized");
          setStatusCode(res.status);
          setLoading(false);
          return;
        }
        const userData = await res.json();
        setAuthUser(userData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to verify user.");
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!authUser) return;
    fetch("/api/users", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Failed to fetch users");
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
  }, [authUser]);

  const handleAdminToggle = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/users/${selectedUser.id}/toggle-admin`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to update admin status");
      }
      const updated = await res.json();
      setUsers((prev) =>
        prev?.map((u) => (u.id === updated.id ? updated : u)) || null
      );
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    let alertWidth = "400px";
    if (statusCode === 401) alertWidth = "210px";
    if (statusCode === 403) alertWidth = "265px";

    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert
          severity="error"
          sx={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            width: alertWidth,
            textAlign: "center",
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {users?.map((user) => (
          <Card
            key={user.id}
            variant="outlined"
            sx={{
              borderRadius: 3,
              textAlign: "center",
              width: 240,
              m: 1,
              py: 3,
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: "240px",
            }}
          >
            <CardContent>
              <Stack spacing={1} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main", width: 60, height: 60 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">
                  {user.name ?? "No name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Joined: {new Date(user.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" mt={1}>
                  Role: {user.isAdmin ? "Admin" : "User"}
                </Typography>

                {/* Action Buttons */}
                {authUser?.id !== user.id && (
                  user.isAdmin ? (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setDialogOpen(true);
                      }}
                    >
                      Revoke Admin
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setDialogOpen(true);
                      }}
                    >
                      Make Admin
                    </Button>
                  )
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Admin Action</DialogTitle>
        <DialogContent>
          {selectedUser?.isAdmin ? (
            <>
              Are you sure you want to <strong>revoke</strong> admin access
              from <strong>{selectedUser.name}</strong>?
            </>
          ) : (
            <>
              Are you sure you want to <strong>grant</strong> admin access to{" "}
              <strong>{selectedUser?.name}</strong>?
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAdminToggle} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
