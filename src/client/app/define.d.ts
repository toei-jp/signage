import { IAppConfig, OAuth2DataTypes } from './Constants';

declare global {
    interface Window {
        appEnv: IAppConfig;
        oAuth2data: OAuth2DataTypes;
    }
}
