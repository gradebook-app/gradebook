export enum ESettingsActions {
    SET_BIOMETRICS_ENABLED="SET_BIOMETRICS_ENABLED",
    SET_LIMIT_ADS = "SET_LIMIT_ADS",
    SET_SAVE_PASSWORD = "SET_SAVE_PASSWORD",
    SET_RESET_SETTINGS = "SET_RESET_SETTINGS",
}

export interface ISetResetSettings {
    type: ESettingsActions.SET_RESET_SETTINGS,
    payload: null,
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