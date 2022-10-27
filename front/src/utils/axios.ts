import axios from "axios";
import { authModule } from "@/store/auth/auth-actions";

interface parsedUser {
  accessToken: string;
  refreshToken: string;
  id: number;
  name: string;
  isAdmin?: boolean;
}
export const axiosInstance = axios.create()

axiosInstance.defaults.baseURL = "http://localhost:3000/";
axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    
    if (user && config.headers) {
      config.headers["Authorization"] = `Bearer ${
        JSON.parse(user).accessToken
      }`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let refresh = false;

axiosInstance.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    console.log(error, 'error  from interceptor');

    if (error.response.status === 401 && !refresh) {
      refresh = true;
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser: parsedUser = JSON.parse(user);
        const token = `Bearer ${parsedUser.refreshToken}`;
        console.log(token, 'token');
        
        try {
          const { status, data } = await axios("http://localhost:3000/auth/refresh", { headers: { Authorization: token } });
  
          if (status === 200) {
            authModule.setUpdatedTokens(data);
  
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${data.accessToken}`;
            refresh = false;
            return axiosInstance(error.config);
          }
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }
    if (error.response.status === 403) {
      authModule.resetData();
    }
    refresh = false;
    
    return error.response;
  }
);
