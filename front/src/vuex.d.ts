import { Store } from 'vuex';

declare module '@vue/runtime-core' {
    interface State {
        'snack/error': Boolean
        'snack/info': Boolean
    }

    interface ComponentCustomProperties {
        $store: Store<State>
    }
}