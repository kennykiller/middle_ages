import { InjectionKey } from '../../node_modules/vue'
import { createStore, Store } from '../../node_modules/vuex'

// define your typings for the store state
export interface State {
    'snack/error': Boolean
    'snack/info': Boolean
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    'snack/error': false,
    'snack/info': false
  }
})