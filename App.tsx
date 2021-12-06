import "react-native-gesture-handler";
import React, { Suspense } from "react";
import LoadingScreen from "./src/pages/LoadingScreen";
import { Provider as ReduxProvider } from "react-redux";
import store, { persistor } from "./src/store";
import AppNavigator from "./AppNavigator";
import { ThemeProvider } from "./src/hooks/useTheme";
import { theme } from "./src/constants/theme";
import { PersistGate } from 'redux-persist/integration/react';


export default function App() {
    return (
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider value={theme}>
                    <Suspense fallback={LoadingScreen}>
                        <AppNavigator />
                    </Suspense>
                </ThemeProvider>
            </PersistGate>
        </ReduxProvider>
    );
}