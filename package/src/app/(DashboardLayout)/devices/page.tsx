"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
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
  Chip,
} from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";

type Device = {
  id: number;
  name: string;
  serialNumber: string;
  scan_status: "idle" | "requested" | "running" | "completed";
};

type AuthUser = {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
};

export default function DevicesPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch("/api/users/admin", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          if (res.status === 403) {
            throw new Error("Forbidden: Admin access required");
          }
          if (res.status === 401) {
            throw new Error("Please login to continue");
          }
          throw new Error(err.error || "Unauthorized");
        }
        const data = await res.json();
        setAuthUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!authUser) return;
    fetch("/api/devices", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch devices.");
        const data = await res.json();
        setDevices(data);
      })
      .catch((err) => {
        setError("Failed to fetch devices.");
        console.error(err);
      });
  }, [authUser]);

  const handleStartScan = async () => {
    if (!selectedDevice) return;
    try {
      const res = await fetch(`/api/devices/${selectedDevice.id}/start-scan`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to start scan.");
      const updated = await res.json();
      setDevices((prev) =>
        prev?.map((d) => (d.id === updated.id ? updated : d)) || null
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
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert
          severity="error"
          sx={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            width: "350px",
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
        {devices?.map((device) => (
          <Card
            key={device.id}
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
                <MemoryIcon fontSize="large" />
                <Typography variant="h6">{device.serialNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {device.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <Chip
                    label={device.scan_status.toUpperCase()}
                    color={
                      device.scan_status === "idle"
                        ? "default"
                        : device.scan_status === "requested"
                        ? "warning"
                        : device.scan_status === "running"
                        ? "info"
                        : "success"
                    }
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Typography>

                {device.scan_status === "idle" && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setSelectedDevice(device);
                      setDialogOpen(true);
                    }}
                  >
                    Start Scan
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Scan</DialogTitle>
        <DialogContent>
          Are you sure you want to request a scan for{" "}
          <strong>{selectedDevice?.serialNumber}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleStartScan} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
