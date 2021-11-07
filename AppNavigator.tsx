import "react-native-gesture-handler";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import NavigatorScreen from "./src/pages/NavigatorScreen";
import AssignmentsScreen from "./src/pages/AssignmentsScreen";
import LoadingScreen from "./src/pages/LoadingScreen";
import LoginScreen from "./src/pages/LoginScreen";
import React, { useEffect } from 'react';
import * as Notifications from "expo-notifications";
import GPAScreen from "./src/pages/GPAScreen";

const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const AppNavigator = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator initialRouteName="loading">
              <Stack.Screen 
                name="loading"
                component={LoadingScreen}
                options={{ headerShown: false, gestureEnabled: true }}
              />
              <Stack.Screen 
                name="login"
                component={LoginScreen}
                options={{ 
                  headerShown: false, 
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="navigator"
                component={NavigatorScreen}
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen 
                name="gpa"
                component={GPAScreen}
                options={{
                  headerShown: true, 
                  headerTitle: "", 
                  gestureEnabled: true,
                  headerBackTitle: "",
                }}
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
    )
}

export default AppNavigator;