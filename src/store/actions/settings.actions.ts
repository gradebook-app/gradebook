import { ESettingsActions, ISetBiometricsEnabled, ISetLimitAds, ISetSavePassword } from "../constants/settings.interface";


export const setBiometricsEnabled = (payload:boolean) : ISetBiometricsEnabled => ({
    type: ESettingsActions.SET_BIOMETRICS_ENABLED,
    payload,
})

export const setLimitAds = (payload:boolean) : ISetLimitAds => ({
    type: ESettingsActions.SET_LIMIT_ADS,
    payload,
})

export const setSavePassword = (payload:boolean) : ISetSavePassword => ({
    type: ESettingsActions.SET_SAVE_PASSWORD,
    payload,
})