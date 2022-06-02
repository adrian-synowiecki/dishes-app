import axios from "axios";

const axiosInstance = () => {
  const defaultOptions = {
    baseURL: "https://frosty-wood-6558.getsandbox.com:443/",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let instance = axios.create(defaultOptions);

  return instance;
};

export default axiosInstance();
