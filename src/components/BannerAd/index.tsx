import React, { useState } from "react";
import { StyleSheet, Platform, Dimensions, StyleProp, ViewStyle } from "react-native";
import { AdMobBanner } from "expo-ads-admob";
import FadeIn from "../FadeIn";

const { width } = Dimensions.get("screen");

type BannerAdProps = {
    style?: StyleProp<ViewStyle>
}

const BannerAd : React.FC<BannerAdProps> = ({ style = {} }) => {
    const [ loaded, setLoaded ] = useState(false);

    const unitID = Platform.select({
        ios: "ca-app-pub-8555090951806711/9875384854",
        android: "",
    });

    const handleAdReceived = () => setLoaded(true);
    const handleAdFailed = () => setLoaded(false);
    // const [ status ] = usePermissions();
    
    // const getPermission = useCallback(async () => {
    //     if (!status || status?.status !== PermissionStatus.UNDETERMINED) return; 
    //     await requestPermissionsAsync();
    // }, []);

    // useEffect(() => {
    //     getPermission();
    // }, []);

    return (
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