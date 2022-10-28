import { AxiosResponse } from "axios";
import { axiosInstance as axios } from "../../utils/axios";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";

interface loginPayload {
  email: string;
  password: string;
}
interface userData {
  id?: number;
  email?: string;
  name?: string;
  accessToken?: string | null;
  refreshToken?: string;
  message?: string;
  isAdmin?: boolean;
}

interface tokens {
  accessToken: string;
  refreshToken: string;
}

@Module
class AuthModule extends VuexModule {
  isAuthenticated = false;
  isAdmin = false;

  @Mutation
  setSuccessfulLoginData(userData: userData) {
    this.isAuthenticated = !!userData.accessToken;
    this.isAdmin = !!userData?.isAdmin;
    if (userData.accessToken) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }
  @Mutation
  setUpdatedTokens(tokens: tokens) {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const updatedData = {
        ...parsedUser,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
      localStorage.setItem("user", JSON.stringify(updatedData));
    }
  }
  @Mutation
  checkAuthentication() {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser: userData = JSON.parse(user);
      this.isAuthenticated = !!parsedUser.accessToken;
      this.isAdmin = !!parsedUser?.isAdmin;
    }
  }

  @Mutation
  resetData() {
    this.isAuthenticated = false;
    this.isAdmin = false;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  @Action
  async login(payload: loginPayload) {
    try {
      const res: AxiosResponse<userData> = await axios.post(
        "auth/signin",
        payload
      );

      if (res.data.accessToken && res.data.refreshToken) {
        this.setSuccessfulLoginData(res.data);
        return true;
      } else {
        return res.data?.message;
      }
    } catch (e) {
      console.log(e);
    }
  }
  @Action
  async logout() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user) {
      await axios.get("auth/logout");
      this.resetData();
    }
  }
}

import { store } from "../index";
export const authModule = new AuthModule({ store, name: "auth" });
