import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AzureLogin from "../components/AzureLogin";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleKeycloakClick = () => {
    navigate("/keycloak-login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Choose your login provider</h2>
      <div style={{ marginTop: "2rem" }}>
        <AzureLogin />
        <button
          onClick={handleKeycloakClick}
          style={{ padding: "0.6rem 1.2rem", fontSize: "1rem", marginTop: "1rem" }}
        >
          Login with Keycloak
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
