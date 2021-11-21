export const SET_NOTIFICATION_TOKEN = "user/setNotificationToken";
export const GET_ACCOUNT = "user/account";
export const getScheduleEndpoint = (dateParameter:string) => `user/schedule?date=${dateParameter}`;