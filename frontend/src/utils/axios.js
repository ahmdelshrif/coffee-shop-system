import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:9000/api/v2",
    headers: {
      "Content-Type": "application/json",
    },
  });
  

export default axiosInstance;
