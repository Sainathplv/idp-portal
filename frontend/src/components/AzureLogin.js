import React from "react";
import { useMsal } from "@azure/msal-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // STEP 1

const AzureLogin = () => {
  const { instance } = useMsal();
  const { login } = useAuth();
  const navigate = useNavigate(); // STEP 2

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup();
      const account = response.account;

      login({
        name: account.name,
        email: account.username,
        tenantId: account.tenantId,
        idToken: response.idToken,
      });

      navigate("/dashboard"); // STEP 3 — Redirect after login
    } catch (error) {
      console.error("Azure login failed:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Sign in with Azure AD</h2>
      <button onClick={handleLogin} style={{ padding: "0.6rem 1.2rem", fontSize: "1rem" }}>
        Login with Azure AD
      </button>
    </div>
  );
};

export default AzureLogin;
