import React, { useEffect } from "react";
import { AdEventType, TestIds, InterstitialAd as InterstitialAdRN } from "react-native-google-mobile-ads";
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getLimitAds } from "../../store/selectors/settings.selectors";
import { Platform } from "react-native";
import { getSeenInterstitial } from "../../store/selectors/user.selectors";
import { setSeenInterstitial } from "../../store/actions/user.actions";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : Platform.select({
    ios: "ca-app-pub-8704529290641186/5829683850", // genesus.app account
    android: "ca-app-pub-8704529290641186/7533895185",
});

const interstitial = InterstitialAdRN.createForAdRequest(adUnitId!, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ["education", "shopping", "games", "teen"],
});

const InterstitialAd : React.FC = () => {
    const state = useSelector((state:IRootReducer) => state);
    const seenInterstitial = getSeenInterstitial(state);
    const limitAds = getLimitAds(state);

    const dispatch = useDispatch();
    
    useEffect(() => {
        if (limitAds || seenInterstitial) return; 

        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            interstitial.show();

            dispatch(setSeenInterstitial(true));
        });

        interstitial.load();

        return unsubscribe;
    }, [dispatch, limitAds, seenInterstitial]);

    return null; 
};

export default InterstitialAd;