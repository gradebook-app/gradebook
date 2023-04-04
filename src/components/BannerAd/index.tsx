import React, { useState } from "react";
import { StyleSheet, Platform, Dimensions, StyleProp, ViewStyle, View } from "react-native";
import FadeIn from "../FadeIn";
import { useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getLimitAds } from "../../store/selectors/settings.selectors";
import { BannerAd as AdMobBannerAd, TestIds, BannerAdSize } from "react-native-google-mobile-ads";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";

const { width } = Dimensions.get("screen");

type BannerAdProps = {
    style?: StyleProp<ViewStyle>
}

const BannerAd : React.FC<BannerAdProps> = ({ style = {} }) => {
    const [ loaded, setLoaded ] = useState(false);
    const state = useSelector((state:IRootReducer) => state);
    const limitAds = getLimitAds(state);

    const unitID = __DEV__ ? TestIds.BANNER : Platform.select({
        ios: "ca-app-pub-8704529290641186/4889775423", // genesus.app account
        android: "ca-app-pub-8704529290641186/6902468009",
    });

    const handleAdReceived = () => {
        setLoaded(true)
    };

    const handleAdFailed = () => {
        setLoaded(false);
    }

    const { isDark } = useAppearanceTheme();

    return (
        !limitAds ? (
            <FadeIn show={loaded} style={[ styles.container, style ]}>
               <View style={[
                 styles.adContainer,
                 {
                    borderRadius: isDark ? 5 : 0
                 }
               ]}>
                    <AdMobBannerAd
                        unitId={unitID as string}
                        onAdLoaded={handleAdReceived}
                        onAdFailedToLoad={handleAdFailed}
                        size={BannerAdSize.BANNER}
                        requestOptions={{
                            keywords: [ "education", "school", "math", "english", "science" ],
                            requestNonPersonalizedAdsOnly: true,
                        }}
                    />
               </View>
            </FadeIn>
        ) : null
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: "auto",
        width: width  ,
        display: "flex",
        flexDirection:"row",
        justifyContent: "center",
        height: 50,
        overflow: "hidden",
    },
    adContainer: {
        overflow: "hidden",
    }
});

export default BannerAd;