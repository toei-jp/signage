import axios from 'axios';
import moment from 'moment';
import { theaterTypes, MovieTypes, ScreeningEventTypes, ScreeningEventSeriesTypes } from '../Constants';

/**
 * 待機
 */
async function sleep(time: number = 500) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

/**
 * 認証情報取得
 */
export const authorize = async () => {
    if (window.oAuth2data.accessToken && window.oAuth2data.tokenType && window.oAuth2data.expiryDate !== NaN && window.oAuth2data.lastUpdate !== NaN) {
        const expiryDate = window.oAuth2data.expiryDate;
        if (moment().unix() <= window.oAuth2data.lastUpdate + expiryDate - 300) {
            // 期限が5分以上あるならアクセストークン更新しない
            return;
        }
    }
    const url = '/api/authorize/getCredentailsApi';
    const limit = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            const result = (await axios.post<{ clientId: string; accessToken: string; tokenType: string; expiryDate: number }>(url)).data;
            window.oAuth2data = {
                accessToken: result.accessToken,
                tokenType: result.tokenType,
                expiryDate: result.expiryDate,
                lastUpdate: moment().unix(),
            };
            return;
        } catch (error) {
            if (error.status !== undefined && error.status >= 500) {
                loop = count < limit;
                count++;
                await sleep(20000);
                continue;
            }
            throw error;
        }
    }
};

/**
 * 施設情報の取得
 */
export const searchMovieTheaters = async (): Promise<theaterTypes[]> => {
    let theaters: theaterTypes[] = [];
    const limit = 100;
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${window.appEnv.SMART_THEATER_API_ENDPOINT}/places/MovieTheater?page=${i}&limit=${limit}`;
                const result = (await axios.get<theaterTypes[]>(url, { headers: { Authorization: `${window.oAuth2data.tokenType} ${window.oAuth2data.accessToken}` } })).data;
                theaters = [...theaters, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return theaters;
};

/**
 * コンテンツ情報の取得
 */
export const searchMovies = async ({
    datePublishedFrom,
    datePublishedThrough,
    offersAvailableFrom,
}: {
    datePublishedFrom?: string;
    datePublishedThrough?: string;
    offersAvailableFrom?: string;
}): Promise<MovieTypes[]> => {
    let movies: MovieTypes[] = [];
    const limit = 100;
    let form = datePublishedFrom ? `&datePublishedFrom=${datePublishedFrom}` : '';
    form += datePublishedThrough ? `&datePublishedThrough=${datePublishedThrough}` : '';
    form += offersAvailableFrom ? `&offersAvailableFrom=${offersAvailableFrom}` : '';
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${window.appEnv.SMART_THEATER_API_ENDPOINT}/creativeWorks/movie?page=${i}&limit=${limit}${form}`;
                const result = (await axios.get<MovieTypes[]>(url, { headers: { Authorization: `${window.oAuth2data.tokenType} ${window.oAuth2data.accessToken}` } })).data;
                movies = [...movies, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return movies;
};

/**
 * 施設コンテンツ検索の取得
 */
export const searchScreeningEventSeries = async ({
    locationBranchCode,
    workPerformedIdentifier,
    startFrom,
    startThrough,
    endFrom,
    endThrough,
}: {
    locationBranchCode?: string;
    workPerformedIdentifier?: string;
    startFrom?: string;
    startThrough?: string;
    endFrom?: string;
    endThrough?: string;
}): Promise<ScreeningEventSeriesTypes[]> => {
    let screeningEvents: ScreeningEventSeriesTypes[] = [];
    const limit = 100;
    let form = locationBranchCode ? `&locationBranchCode=${locationBranchCode}` : '';
    form += workPerformedIdentifier ? `&workPerformedIdentifier=${workPerformedIdentifier}` : '';
    form += startFrom ? `&startFrom=${startFrom}` : '';
    form += startThrough ? `&startThrough=${startThrough}` : '';
    form += endFrom ? `&endFrom=${endFrom}` : '';
    form += endThrough ? `&endThrough=${endThrough}` : '';
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${window.appEnv.SMART_THEATER_API_ENDPOINT}/events/ScreeningEventSeries?page=${i}&limit=${limit}${form}`;
                const result = (await axios.get<ScreeningEventSeriesTypes[]>(url, { headers: { Authorization: `${window.oAuth2data.tokenType} ${window.oAuth2data.accessToken}` } })).data;
                screeningEvents = [...screeningEvents, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return screeningEvents;
};

/**
 * イベント検索の取得
 */
export const searchScreeningEvent = async ({
    startFrom,
    startThrough,
    superEventLocationBranchCode,
    superEventWorkPerformedIdentifier,
}: {
    startFrom?: string;
    startThrough?: string;
    superEventLocationBranchCode?: string;
    superEventWorkPerformedIdentifier?: string;
}): Promise<ScreeningEventTypes[]> => {
    let screeningEvents: ScreeningEventTypes[] = [];
    const limit = 100;
    let form = startFrom ? `&startFrom=${startFrom}` : '';
    form += startThrough ? `&startThrough=${startThrough}` : '';
    form += superEventLocationBranchCode ? `&superEventLocationBranchCode=${superEventLocationBranchCode}` : '';
    form += superEventWorkPerformedIdentifier ? `&superEventWorkPerformedIdentifier=${superEventWorkPerformedIdentifier}` : '';
    const maxLoop = 5;
    let count = 0;
    let loop = true;
    while (loop) {
        loop = false;
        try {
            for (let i = 1; i <= 100; i += 1) {
                const url = `${window.appEnv.SMART_THEATER_API_ENDPOINT}/events/ScreeningEvent?page=${i}&limit=${limit}${form}`;
                const result = (await axios.get<ScreeningEventTypes[]>(url, { headers: { Authorization: `${window.oAuth2data.tokenType} ${window.oAuth2data.accessToken}` } })).data;
                screeningEvents = [...screeningEvents, ...result];
                if (result.length !== limit) {
                    break;
                }
            }
        } catch (error) {
            if (count < maxLoop) {
                loop = true;
                count++;
                await sleep(5000);
                continue;
            }
            throw error;
        }
    }
    return screeningEvents;
};
