import axios, { AxiosResponse } from "axios";
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
  resetData() {
    this.isAuthenticated = false;
    this.isAdmin = false;
    localStorage.removeItem("user");
  }

  @Action
  async login(payload: loginPayload) {
    try {
      const res: AxiosResponse<userData> = await axios.post(
        "auth/login",
        payload
      );

      if (res.data?.id) {
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
      await axios.post("auth/logout", { id: user.id });
      axios.defaults.headers.common["Authorization"] = "";
      this.resetData();
    }
  }
}

import { store } from "../index";
export const authModule = new AuthModule({ store, name: "auth" });
