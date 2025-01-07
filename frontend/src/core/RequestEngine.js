import axios from "axios";
import Constants from "../core/Constant";

const createApiEngine = () => {
  const token = sessionStorage.getItem("token");
  return axios.create({
    baseURL: Constants.serverlink,
    timeout: Constants.timeout,
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  });
};

const debugApiEngine = (apiEngine) => {
  apiEngine.interceptors.request.use((request) => {
    console.log("Starting Request", request);
    return request;
  });

  apiEngine.interceptors.response.use((response) => {
    console.log("Response:", response);
    return response;
  });
};

const deleteItem = async (path, id) => {
  const apiEngine = createApiEngine();
  const link = `/api/${path}/${id}`;
  console.log(link);
  return await apiEngine.delete(link);
};

const login = async (email, password) => {
  const apiEngine = createApiEngine();
  const link = "api/user/login";
  const data = { email, password };
  console.warn(link);
  return await apiEngine.post(link, data);
};

const saveItem = async (path, data) => {
  const apiEngine = createApiEngine();
  const link = `/api/${path}`;
  console.warn(link);
  return await apiEngine.post(link, data);
};

const getItem = async (path) => {
  const apiEngine = createApiEngine();
  const link = `/api/${path}`;
  console.warn(link);
  return await apiEngine.get(link);
};

const postItem = async (path, param = "/list", filtered = {}) => {
  const apiEngine = createApiEngine();
  const link = `/api/admin/${path}${param}`;
  console.warn(link);
  const data = { filtered };
  return await apiEngine.post(link, data);
};

const updateItem = async (path, id, data) => {
  const apiEngine = createApiEngine();
  const link = `/api/${path}/${id}`;
  console.log(link);
  return await apiEngine.put(link, data);
};
const getUserIdFromToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = JSON.parse(atob(base64));
    return decodedData["userId"];
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
const getUserEmailFromToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedData = JSON.parse(atob(base64));
    return decodedData["email"];
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export {
  createApiEngine,
  debugApiEngine,
  login,
  saveItem,
  getItem,
  postItem,
  updateItem,
  deleteItem,
  getUserIdFromToken,
  getUserEmailFromToken,
};
