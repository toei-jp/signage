export interface IAppConfig {
    STATUS_THRESHOLD_CROWDED: number;
    STATUS_THRESHOLD_OUTOFDATE: number;
    CINERINO_SCHEDULE_FETCH_TIMEOUT: number;
    authConfig: {
        userPoolId: string;
        userPoolWebClientId: string;
    };
    cognitoUser: {
        userId: string;
        password: string;
    };
    CINERINO_API_ENDPOINT: string;
    BUILD_TIMESTAMP: string;
    ENV_LAST_MODIFIED: string;
}
