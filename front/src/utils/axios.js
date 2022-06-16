import axios from "axios";
import { authModule } from "@/store/auth/auth-actions";
axios.defaults.baseURL = "http://localhost:3000/";
const user = localStorage.getItem("user");
if (user) {
    axios.defaults.headers.common["x-access-token"] = `Bearer ${JSON.parse(user).accessToken}`;
}
let refresh = false;
axios.interceptors.response.use((resp) => resp, async (error) => {
    if (error.response.status === 401 && !refresh) {
        refresh = true;
        let payload = { refreshToken: null };
        if (user) {
            payload = { refreshToken: JSON.parse(user).refreshToken };
        }
        const { status, data } = await axios.post("/auth/refreshtoken", payload);
        if (status === 200) {
            console.log(data, "data");
            authModule.setUpdatedTokens(data);
            axios.defaults.headers.common["x-access-token"] = `Bearer ${data.accessToken}`;
            console.log(axios.defaults.headers.common["x-access-token"]);
            return axios(error.config);
        }
    }
    refresh = false;
    return error.response;
});
