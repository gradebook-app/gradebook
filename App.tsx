import "react-native-gesture-handler";
import React, { Suspense } from "react";
import { StyleSheet } from "react-native";
import LoadingScreen from "./src/pages/LoadingScreen";
// import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/store";
import AppNavigator from "./AppNavigator";
import { ThemeProvider } from "./src/hooks/useTheme";
import { theme } from "./src/constants/theme";



export default function App() {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider value={theme}>
                <Suspense fallback={LoadingScreen}>
                    <AppNavigator />
                </Suspense>
            </ThemeProvider>
        </ReduxProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
