var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import axios from "axios";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
let AuthModule = class AuthModule extends VuexModule {
    isAuthenticated = false;
    isAdmin = false;
    refreshTokenIsValid = false;
    setSuccessfulLoginData(userData) {
        this.isAuthenticated = !!userData.accessToken;
        this.refreshTokenIsValid = !!userData.refreshToken;
        if (userData.accessToken) {
            localStorage.setItem("user", JSON.stringify(userData));
        }
    }
    async login(payload) {
        try {
            const res = await axios.post("http://localhost:3000/auth/login", payload);
            console.log(res);
            if (res.data?.id) {
                this.setSuccessfulLoginData(res.data);
            }
            else {
                throw Error("неудачная попытка авторизации");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
};
__decorate([
    Mutation
], AuthModule.prototype, "setSuccessfulLoginData", null);
__decorate([
    Action
], AuthModule.prototype, "login", null);
AuthModule = __decorate([
    Module
], AuthModule);
import { store } from "../index";
export const authModule = new AuthModule({ store, name: "auth" });
