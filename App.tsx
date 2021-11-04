import "react-native-gesture-handler";
import React, { Suspense } from 'react';
import { StyleSheet, DynamicColorIOS } from 'react-native';
import LoadingScreen from "./src/pages/LoadingScreen";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/store";
import AppNavigator from "./AppNavigator";


const dynamicBackgroundColor = DynamicColorIOS({
  light: "#fff",
  dark: "#000",
});

const dynamicSecondaryColor = DynamicColorIOS({
  light: "#fff",
  dark: "#111111",
});

const dynamicTextColor = DynamicColorIOS({
  light: "#000",
  dark: "#fff",
});

const dynamicGreyColor = DynamicColorIOS({
  light: "rgba(0, 0, 0, 0.5)",
  dark: "rgba(255, 255, 255, 0.5)",
});

const dynamicIconColor = DynamicColorIOS({
  light: "rgba(0, 0, 0, 0.15)",
  dark: "rgba(255, 255, 255, 0.35)",
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#a2d2ff',
    secondary: '#bde0fe',
  }, 
  theme: {
    background: dynamicBackgroundColor,
    secondary: dynamicSecondaryColor,
    icon: dynamicIconColor,
    text: dynamicTextColor,
    grey: dynamicGreyColor
  },
  gradeColors: {
    a: "#009B0E",
    aMinus: "#009B0E",
    bPlus: "#B69800",
    b: "#B69800",
    cPlus: "#B69800",
    c: "#B69800",
    dPlus: "#9B6E00",
    d: "#9B6E00",
    f: "#CE0000"
  },
  categoryColors: {
    test: "#C500F0",
    quiz: "#FF69E1",
    homework: "#04AFFF",
    classwork: "#00AD10",
    seminar: "#5284FF",
    project: "#FF5279",
    research: "#FF9104",
    essay: "#002774",
    default: "#FAC51E",
  }
};



export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <Suspense fallback={LoadingScreen}>
          <AppNavigator />
        </Suspense>
      </PaperProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
