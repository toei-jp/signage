import { IAppConfig } from './Constants';
import { getAuthedServices } from './plugins/cinerino';

declare module 'vue/types/vue' {
    interface Vue {
        $cinerino: {
            getAuthedServices: typeof getAuthedServices;
        };
    }
}

declare global {
    interface Window {
        appEnv: IAppConfig;
    }
}
