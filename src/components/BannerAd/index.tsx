import React from "react"
import { StyleSheet, View, Platform, Text } from "react-native"
import { AdMobBanner } from "expo-ads-admob"

const BannerAd = () => {
    const unitID = Platform.select({
        ios: "ca-app-pub-8555090951806711/5353704421",
        android: "",
    })
 
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            { Platform.OS === "ios" ? (
                <AdMobBanner 
                    adUnitID={unitID}
                    bannerSize="mediumRectangle"
                    servePersonalizedAds={true}
                    style={{
                        padding: 30,
                    }}
                />
            ) : <></> }
        </View>
    )
}

export default BannerAd