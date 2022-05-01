import { createStore } from '../../node_modules/vuex';
// define injection key
export const key = Symbol();
export const store = createStore({
    state: {
        'snack/error': false,
        'snack/info': false
    }
});
