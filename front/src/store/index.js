import { createStore, useStore as baseUseStore, } from "../../node_modules/vuex";
// define injection key
export const key = Symbol();
export const store = createStore({
    state: {
        windowWidth: 0,
    },
    mutations: {
        setWindowWidth(state, val) {
            console.log(val, "in mutations");
            state.windowWidth = val;
        },
    },
});
export function useStore() {
    return baseUseStore(key);
}
