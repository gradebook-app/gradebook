import "react-native-gesture-handler";
import React, { Suspense, useEffect } from "react";
import { Dimensions, Platform, StyleSheet, UIManager, SafeAreaView } from "react-native";
import LoadingScreen from "./src/pages/LoadingScreen";
import { Provider as ReduxProvider } from "react-redux";
import store, { persistor } from "./src/store";
import AppNavigator from "./AppNavigator";
import { PersistGate } from 'redux-persist/integration/react';
import { useDynamicColor } from "./src/hooks/useDynamicColor";
import { StatusBar } from "expo-status-bar";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import SplashScreen from 'react-native-splash-screen'
const { width, height } = Dimensions.get('window');
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

mobileAds()
  .setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.T,
    tagForChildDirectedTreatment: true,
    tagForUnderAgeOfConsent: true,
    testDeviceIdentifiers: [],
  })
  .then(() => {
    mobileAds().initialize();
})

const ReduxBlocker = () => {
    const backgroundColor = useDynamicColor({ dark: "#000", light: "#fff" });
    return <SafeAreaView style={[ styles.container, { backgroundColor }]}></SafeAreaView>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
    },
});

export default function App() {
    changeNavigationBarColor("#000000", false, false);

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <ReduxProvider store={store}>
            <PersistGate loading={<ReduxBlocker/>} persistor={persistor}>
                <Suspense fallback={LoadingScreen}>
                    { Platform.OS === "android" && (
                         <StatusBar translucent={true} />
                    )}
                    <AppNavigator />
                </Suspense>
            </PersistGate>
        </ReduxProvider>
    );
}
