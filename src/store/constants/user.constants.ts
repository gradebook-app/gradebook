import { ECourseWeight } from "../enums/weights";

export enum EUserActions {
    SET_USER = "SET_USER",
    SET_NOTIFICATION_TOKEN = "SET_NOTIFICATION_TOKEN",
    SET_SHOWN_ALERT_3_0 = "SET_SHOWN_ALERT_3_0",
    SET_SHOWN_SAVE_BANNER = "SET_SHOWN_SAVE_BANNER",
    USER_PURGE_CACHE = "USER_PURGE_CACHE",
    SET_USER_COURSE_WEIGHT = "SET_USER_COURSE_WEIGHT",
    SET_UPDATING_COURSE_WEIGHT = "SET_UPDATING_COURSE_WEIGHT",
    SET_SEEN_INTERSTITIAL="SET_SEEN_INTERSTITIAL"
}

export interface ISetShownAlert {
    type: EUserActions.SET_SHOWN_ALERT_3_0,
    payload: boolean,
}

export interface ISetSeenInterstitial{
    type: EUserActions.SET_SEEN_INTERSTITIAL,
    payload: boolean,
}

export interface ISetUpdatingCourseWeight {
    type: EUserActions.SET_UPDATING_COURSE_WEIGHT,
    payload: boolean
}

export interface ISetUserCourseWeight {
    type: EUserActions.SET_USER_COURSE_WEIGHT,
    payload: {
        courseId: string; 
        sectionId: string; 
        weight: ECourseWeight;
        resolve: (e:string) => void; 
    }
}

export interface ISetSaveBanner {
    type: EUserActions.SET_SHOWN_SAVE_BANNER,
    payload: boolean,
}

export interface ISetUser {
    type: EUserActions.SET_USER,
    payload: any
}

export interface ISetNotificationToken {
    type: EUserActions.SET_NOTIFICATION_TOKEN,
    payload: string | null,
}

export interface IUserPurgeCache {
    type: EUserActions.USER_PURGE_CACHE,
    payload: {
        result?: Function
    }
}