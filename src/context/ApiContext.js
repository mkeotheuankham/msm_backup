import { createContext, useMemo } from "react";
import createApiClient from "../api/apiClient";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiClient = useMemo(
    () => createApiClient(process.env.REACT_APP_API_BASE_URL),
    []
  );

  return (
    <ApiContext.Provider value={{ apiClient }}>{children}</ApiContext.Provider>
  );
};
