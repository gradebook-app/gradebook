import "react-native-gesture-handler";
import React, { Suspense, useRef } from "react";
import { Dimensions, DynamicColorIOS, StyleSheet } from "react-native";
import LoadingScreen from "./src/pages/LoadingScreen";
import { Provider as ReduxProvider } from "react-redux";
import store, { persistor } from "./src/store";
import AppNavigator from "./AppNavigator";
import { ThemeProvider } from "./src/hooks/useTheme";
import { theme } from "./src/constants/theme";
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

const ReduxBlocker = () => {
    const backgroundColor = useRef(DynamicColorIOS({ light: "#fff", dark: "#000" })).current; 
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
    return (
        <ReduxProvider store={store}>
            <PersistGate loading={<ReduxBlocker/>} persistor={persistor}>
                <ThemeProvider value={theme}>
                    <Suspense fallback={LoadingScreen}>
                        <AppNavigator />
                    </Suspense>
                </ThemeProvider>
            </PersistGate>
        </ReduxProvider>
    );
}
