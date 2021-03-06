import "react-native-gesture-handler";
import React, { Suspense } from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import LoadingScreen from "./src/pages/LoadingScreen";
import { Provider as ReduxProvider } from "react-redux";
import store, { persistor } from "./src/store";
import AppNavigator from "./AppNavigator";
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useDynamicColor } from "./src/hooks/useDynamicColor";
import { StatusBar } from "expo-status-bar";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { useAppearanceTheme } from "./src/hooks/useAppearanceTheme";

const { width, height } = Dimensions.get('window');

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
    // const { isDark } = useAppearanceTheme();
    changeNavigationBarColor("#000000", false, false);

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
