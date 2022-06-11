import axios from "axios";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";

interface loginPayload {
  email: string;
  password: string;
}
interface userData {
  id: number;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
};

@Module
class AuthModule extends VuexModule {
  isAuthenticated = false;
  isAdmin = false;
  refreshTokenIsValid = false;

  @Mutation
  setSuccessfulLoginData(userData: userData) {
    this.isAuthenticated = !!userData.accessToken;
    this.refreshTokenIsValid = !!userData.refreshToken;
    if (userData.accessToken) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }
  checkAuthentication() {}

  @Action
  async login(payload: loginPayload) {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", payload);
      console.log(res);
      if (res.data?.id) {
        this.setSuccessfulLoginData(res.data);
      } else {
        throw Error("неудачная попытка авторизации");
      }
    } catch (e) {
      console.log(e);
    }
  }
}

import { store } from "../index";
export const authModule = new AuthModule({ store, name: "auth" });
