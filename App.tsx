import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'expo-status-bar';
import React, { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoadingScreen from "./src/pages/LoadingScreen";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import LoginScreen from "./src/pages/LoginScreen";
import { Provider as ReduxProvider } from "react-redux";
import store from "./src/store";
import NavigatorScreen from "./src/pages/NavigatorScreen";
import AssignmentsScreen from "./src/pages/AssignmentsScreen";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#a2d2ff',
    secondary: '#bde0fe',
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
    test: "#13009E",
    quiz: "#D052FF",
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
          <NavigationContainer>
            <Stack.Navigator initialRouteName="loading">
              <Stack.Screen 
                name="loading"
                component={LoadingScreen}
                options={{ headerShown: false, gestureEnabled: true }}
              />
              <Stack.Screen 
                name="login"
                component={LoginScreen}
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="navigator"
                component={NavigatorScreen}
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="assignments"
                component={AssignmentsScreen}
                options={{ 
                  headerShown: true, 
                  headerTitle: "", 
                  gestureEnabled: true,
                  headerBackTitle: "",
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
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
