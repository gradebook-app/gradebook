import { EUserActions, ISetNotificationToken, ISetUpdatingCourseWeight, ISetUser, ISetUserCourseWeight, IUserPurgeCache } from "../constants/user.constants";

export const setShownAlert = (payload:boolean) => ({
    type: EUserActions.SET_SHOWN_ALERT_2_0,
    payload,
});

export const setShownSaveBanner = (payload:boolean) => ({
    type: EUserActions.SET_SHOWN_SAVE_BANNER,
    payload,
});

export const setUser = (payload:any) : ISetUser => ({
    type: EUserActions.SET_USER,
    payload,
});

export const setNotificationToken = (payload:string | null) : ISetNotificationToken => ({
    type: EUserActions.SET_NOTIFICATION_TOKEN,
    payload,
});

export const setUserPurgeCache = (payload:any) : IUserPurgeCache  => ({
    type: EUserActions.USER_PURGE_CACHE,
    payload
});

export const setUserCourseWeight = (payload:ISetUserCourseWeight["payload"]) : ISetUserCourseWeight  => ({
    type: EUserActions.SET_USER_COURSE_WEIGHT,
    payload
});

export const setUpdatingCourseWeight = (payload: ISetUpdatingCourseWeight["payload"]) : ISetUpdatingCourseWeight => ({
    type: EUserActions.SET_UPDATING_COURSE_WEIGHT,
    payload
});