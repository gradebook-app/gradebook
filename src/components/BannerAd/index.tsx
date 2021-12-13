import React, { useState } from "react";
import { StyleSheet, Platform, Dimensions, StyleProp, ViewStyle } from "react-native";
import { AdMobBanner } from "expo-ads-admob";
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
        android: "",
    });

    const handleAdReceived = () => setLoaded(true);
    const handleAdFailed = () => setLoaded(false);
    
    return (
        !limitAds ? (
            <FadeIn show={loaded} style={[ styles.container, style ]}>
                { Platform.OS === "ios" ? (
                    <AdMobBanner 
                        onAdViewDidReceiveAd={handleAdReceived}
                        onDidFailToReceiveAdWithError={handleAdFailed}
                        adUnitID={unitID}
                        bannerSize="banner"
                        servePersonalizedAds={true}
                        style={{
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                    />
                ) : <></> }
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
        borderRadius: 5,
    }
});

export default BannerAd;