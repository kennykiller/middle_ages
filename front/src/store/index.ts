import { InjectionKey } from "../../node_modules/vue";
import {
  createStore,
  useStore as baseUseStore,
  Store,
} from "../../node_modules/vuex";

// define your typings for the store state
export interface State {
  windowWidth: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    windowWidth: 0,
  },
  mutations: {
    setWindowWidth(state, val) {
      state.windowWidth = val;
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
