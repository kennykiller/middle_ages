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
    setSuccessfulLoginData(userData) {
        this.isAuthenticated = !!userData.accessToken;
        this.isAdmin = !!userData?.isAdmin;
        if (userData.accessToken) {
            localStorage.setItem("user", JSON.stringify(userData));
        }
    }
    setUpdatedTokens(tokens) {
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
    checkAuthentication() {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            this.isAuthenticated = !!parsedUser.accessToken;
            this.isAdmin = !!parsedUser?.isAdmin;
        }
    }
    resetData() {
        this.isAuthenticated = false;
        this.isAdmin = false;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }
    async login(payload) {
        try {
            const res = await axios.post("auth/signin", payload);
            if (res.data.accessToken && res.data.refreshToken) {
                this.setSuccessfulLoginData(res.data);
                return true;
            }
            else {
                return res.data?.message;
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async logout() {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (user) {
            await axios.get("auth/logout");
            this.resetData();
        }
    }
};
__decorate([
    Mutation
], AuthModule.prototype, "setSuccessfulLoginData", null);
__decorate([
    Mutation
], AuthModule.prototype, "setUpdatedTokens", null);
__decorate([
    Mutation
], AuthModule.prototype, "checkAuthentication", null);
__decorate([
    Mutation
], AuthModule.prototype, "resetData", null);
__decorate([
    Action
], AuthModule.prototype, "login", null);
__decorate([
    Action
], AuthModule.prototype, "logout", null);
AuthModule = __decorate([
    Module
], AuthModule);
import { store } from "../index";
export const authModule = new AuthModule({ store, name: "auth" });
