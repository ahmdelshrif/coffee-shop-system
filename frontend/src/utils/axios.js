import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/api/v2",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.get("/api/v1/categories", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
})



export default axiosInstance;
