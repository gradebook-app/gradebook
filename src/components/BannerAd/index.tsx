import React, { useState } from "react";
import { StyleSheet, Platform, Dimensions, StyleProp, ViewStyle, View } from "react-native";
//import { BannerAd as AdMobBanner, BannerAdSize } from '@react-native-admob/admob';
import FadeIn from "../FadeIn";
import { useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getLimitAds } from "../../store/selectors/settings.selectors";

const { width } = Dimensions.get("screen");

type BannerAdProps = {
    style?: StyleProp<ViewStyle>
}

const BannerAd : React.FC<BannerAdProps> = ({ style = {} }) => {
    const [ loaded, setLoaded ] = useState(false);
    const state = useSelector((state:IRootReducer) => state);
    const limitAds = getLimitAds(state);

    const unitID = Platform.select({
        ios: "ca-app-pub-8555090951806711/9875384854",
        android: "ca-app-pub-8555090951806711/6375245625",
    });

    const handleAdReceived = () => setLoaded(true);
    const handleAdFailed = () => {
        setLoaded(false);
    }
    
    return (
        !limitAds ? (
            <FadeIn show={loaded} style={[ styles.container, style ]}>
               <View style={styles.adContainer}>
                    {/* <AdMobBanner
                        unitId={unitID as string}
                        size={BannerAdSize.BANNER}
                        requestOptions={{
                            keywords: ["education", "games"],
                            requestNonPersonalizedAdsOnly: false,
                        }}
                        onAdLoaded={handleAdReceived}
                        onAdFailedToLoad={handleAdFailed}
                    /> */}
               </View>
            </FadeIn>
        ) : null
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: "auto",
        width: width,
        display: "flex",
        flexDirection:"row",
        justifyContent: "center",
        height: 50,
        overflow: "hidden",
    },
    adContainer: {
        borderRadius: 5,
        overflow: "hidden",
    }
});

export default BannerAd;