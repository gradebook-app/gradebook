import "react-native-gesture-handler";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import NavigatorScreen from "./src/pages/NavigatorScreen";
import AssignmentsScreen from "./src/pages/AssignmentsScreen";
import LoadingScreen from "./src/pages/LoadingScreen";
import LoginScreen from "./src/pages/LoginScreen";
import { useCallback, useEffect } from "react";
import * as Notifications from "expo-notifications"
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "./src/store/reducers";
import { getStateNotificationToken, getUser } from "./src/store/selectors";
import { setNotificationToken } from "./src/store/actions/user.actions";
import { hasNotificationPermission } from "./src/utils/notification";
import React from 'react';

const Stack = createStackNavigator();

const AppNavigator = () => {
    // const dispatch = useDispatch();
    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);
    const stateNotificationToken = getStateNotificationToken(state);

    const setNotification = useCallback(async () => {
      if (stateNotificationToken) return; 

      try {
          const hasPermission = await hasNotificationPermission()
          if (hasPermission) {
              const token = (await Notifications.getExpoPushTokenAsync()).data;
              const storedToken = user?.notificationToken; 
              if (!token || storedToken === token) return;
              setNotificationToken(token);
          };
      } catch(e) { return };
    }, [ user ]);

    // const handleNotificationUpdate = useCallback(async () => {
    //     try {
    //         const hasPermission = await hasNotificationPermission()
    //         if (hasPermission) {
    //             const token = (await Notifications.getExpoPushTokenAsync()).data;
    //             const storedToken = user?.notificationToken; 
    //             if (!token || storedToken === token) return;
    //             dispatch(setNotificationToken(token));
    //         };
    //     } catch(e) { return };
    // }, [ user?.notificationToken])

    useEffect(() => {
      setNotification();

      // const subscription = Notifications.addPushTokenListener(handleNotificationUpdate);
      // return () => subscription.remove();
    }, [ setNotification ]);

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