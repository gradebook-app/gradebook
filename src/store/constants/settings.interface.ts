export enum ESettingsActions {
    SET_BIOMETRICS_ENABLED="SET_BIOMETRICS_ENABLED",
    SET_LIMIT_ADS = "SET_LIMIT_ADS",
    SET_SAVE_PASSWORD = "SET_SAVE_PASSWORD",
}

export interface ISetBiometricsEnabled {
    type: ESettingsActions.SET_BIOMETRICS_ENABLED,
    payload: boolean,
}

export interface ISetLimitAds {
    type: ESettingsActions.SET_LIMIT_ADS,
    payload: boolean,
}

export interface ISetSavePassword {
    type: ESettingsActions.SET_SAVE_PASSWORD,
    payload: boolean,
}