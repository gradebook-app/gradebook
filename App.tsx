import "react-native-gesture-handler";
import React, { Suspense, useCallback, useEffect } from "react";
import { Dimensions, Platform, StyleSheet, UIManager } from "react-native";
import LoadingScreen from "./src/pages/LoadingScreen";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import store, { persistor } from "./src/store";
import AppNavigator from "./AppNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDynamicColor } from "./src/hooks/useDynamicColor";
import { StatusBar } from "expo-status-bar";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import mobileAds, { MaxAdContentRating } from "react-native-google-mobile-ads";
import {endConnection, getProducts, initConnection} from "react-native-iap";
import config from "./config";
import { setDonateProducts } from "./src/store/actions";

const { width, height } = Dimensions.get("window");

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
    }); 

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

const IAPConnection : React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();

    // Set up In-App Purchases (IAP)
    const handleIAPBootstrap = useCallback(async () => {
        await initConnection();

        const products = await getProducts({ 
            skus: config.iap.skus
        }).catch(_e => []);

        if (!products.length) return; 

        dispatch(setDonateProducts(products));
    }, []);

    useEffect(() => { 
        handleIAPBootstrap(); 
        return  () => { endConnection(); };
    }, [ handleIAPBootstrap ]);
    
    return <>{ children }</>;
};

export default function App() {
    changeNavigationBarColor("#000000", false, false);

    return (
        <ReduxProvider store={store}>
            <PersistGate loading={<ReduxBlocker/>} persistor={persistor}>
                <Suspense fallback={LoadingScreen}>
                    { Platform.OS === "android" && (
                        <StatusBar translucent={true} />
                    )}
                    <IAPConnection>
                        <AppNavigator />
                    </IAPConnection>
                </Suspense>
            </PersistGate>
        </ReduxProvider>
    );
}
