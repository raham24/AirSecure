"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Unauthorized");
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
    return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  }

  if (!users) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Registered Users
      </h1>
      <ul style={{ display: "grid", gap: 16 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div>
              <strong>Name:</strong> {user.name ?? "No name"}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Joined:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
