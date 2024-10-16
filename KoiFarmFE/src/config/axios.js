import axios from "axios";

const baseUrl = "https://localhost:7229";

const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.header["Authorization"] = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(handleBefore, null);

export default api;
