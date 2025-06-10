import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Hello, {user?.name || "User"} 👋</h2>
      <p>Email: {user?.email}</p>
      <p>Login via: {user?.provider}</p>
      <button onClick={logout} style={{ marginTop: "1rem", padding: "0.6rem 1.2rem" }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
