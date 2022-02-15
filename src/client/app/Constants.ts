export interface IAppConfig {
    STATUS_THRESHOLD_CROWDED: number;
    STATUS_THRESHOLD_OUTOFDATE: number;
    CINERINO_SCHEDULE_FETCH_TIMEOUT: number;
    // authConfig: {
    //     userPoolId: string;
    //     userPoolWebClientId: string;
    // };
    // cognitoUser: {
    //     userId: string;
    //     password: string;
    // };
    CINERINO_API_ENDPOINT: string;
    SMART_THEATER_API_ENDPOINT: string;
    BUILD_TIMESTAMP: string;
    ENV_LAST_MODIFIED: string;
    PROJECT_ID: string;
    APP_ENV: string;
}

export interface OAuth2DataTypes {
    accessToken: string;
    tokenType: string;
    expiryDate: number;
    lastUpdate: number;
}

export interface theaterTypes {
    additionalProperty: [
        {
            name: string;
            value: string;
        },
    ];
    branchCode: string;
    name: {
        en: string;
        ja: string;
    };
}

export interface MovieTypes {
    additionalProperty: [
        {
            name: string;
            value: string;
        },
    ];
    contentRating: string;
    datePublished: string;
    headline: string;
    identifier: string;
    name: {
        en: string;
        ja: string;
    };
}

export interface ScreeningEventTypes {
    additionalProperty: [
        {
            name: string;
            value: string;
        },
    ];
    doorTime: string;
    endDate: string;
    eventStatus: string;
    id: string;
    location: {
        address: {
            en: string;
            ja: string;
        };
        branchCode: string;
        name: {
            en: string;
            ja: string;
        };
    };
    maximumAttendeeCapacity: number;
    name: {
        en: string;
        ja: string;
    };
    offers: {
        validFrom: string;
        validThrough: string;
    };
    startDate: string;
    superEvent: {
        id: string;
        description: {
            en: string;
            ja: string;
        };
        dubLanguage: {
            name: string;
        };
        subtitleLanguage: {
            name: string;
        };
    };
    remainingAttendeeCapacity: number;
    workPerformed: {
        identifier: string;
        headline: string;
        contentRating: string;
        duration: string;
    };
}

export interface ScreeningEventSeriesTypes {
    additionalProperty: [
        {
            name: string;
            value: string;
        },
    ];
    id: string;
    name: {
        en: string;
        ja: string;
    };
    endDate: string;
    startDate: string;
}
