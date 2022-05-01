import { InjectionKey } from 'vue';
import { Store } from '../../node_modules/vuex';
export interface State {
    'snack/error': Boolean;
    'snack/info': Boolean;
}
export declare const key: InjectionKey<Store<State>>;
export declare const store: Store<State>;
