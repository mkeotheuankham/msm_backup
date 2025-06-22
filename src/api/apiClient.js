import axios from "axios";

const createApiClient = (baseURL) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "x-hasura-role": process.env.REACT_APP_HASURA_ROLE || "user",
      "x-hasura-user-id":
        process.env.REACT_APP_DEFAULT_USER_ID || "default-user-id",
    },
  });

  // Request interceptor
  instance.interceptors.request.use((config) => {
    // Add any request modifications here
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error("API Error:", error);
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createApiClient;
