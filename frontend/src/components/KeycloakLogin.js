import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Keycloak from "keycloak-js";
import { useAuth } from "../context/AuthContext";

const KeycloakLogin = () => {
  const { login } = useAuth();
  const [keycloak, setKeycloak] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const keycloakInstance = new Keycloak({
      url: process.env.REACT_APP_KEYCLOAK_URL,
      realm: process.env.REACT_APP_KEYCLOAK_REALM,
      clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    });

    keycloakInstance
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        if (authenticated) {
          const userInfo = {
            name: keycloakInstance.tokenParsed.name || keycloakInstance.tokenParsed.preferred_username,
            email: keycloakInstance.tokenParsed.email,
            idToken: keycloakInstance.token,
            provider: "keycloak",
          };

          login(userInfo);
          setKeycloak(keycloakInstance);
          navigate("/dashboard");
        } else {
          console.warn("Keycloak authentication failed");
        }
      })
      .catch((err) => {
        console.error("Keycloak init error", err);
      });
  }, [login, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Logging in via Keycloak...</h2>
      <p>If you are not redirected automatically, please check the Keycloak configuration.</p>
    </div>
  );
};

export default KeycloakLogin;
