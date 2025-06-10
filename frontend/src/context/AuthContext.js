import { createContext, useContext, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { instance, accounts } = useMsal();

  // Restore user from localStorage on initial render
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("idp_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Hydrate Azure session after refresh (if still present)
  useEffect(() => {
    if (
      accounts.length > 0 &&
      (!user || user.provider === "AzureAD")
    ) {
      const azureUser = {
        name: accounts[0].name,
        email: accounts[0].username,
        provider: "AzureAD",
      };
      setUser(azureUser);
      localStorage.setItem("idp_user", JSON.stringify(azureUser));
    }
  }, [accounts, user]);

  // Universal login method
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("idp_user", JSON.stringify(userData));
  };

  // Proper logout with provider-specific redirection
  const logout = () => {
    const stored = localStorage.getItem("idp_user");
    const provider = stored ? JSON.parse(stored)?.provider : null;

    setUser(null);
    localStorage.removeItem("idp_user");

    if (provider === "AzureAD") {
      instance.logoutRedirect();
    } else if (provider === "keycloak") {
      const postLogoutRedirectUri = "http://localhost:3000"; // must match what's configured in Keycloak
      const logoutUrl = `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
      window.location.href = logoutUrl;
    } else {
      window.location.reload();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
