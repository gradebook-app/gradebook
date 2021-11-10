import "react-native-gesture-handler";
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import NavigatorScreen from "./src/pages/NavigatorScreen";
import AssignmentsScreen from "./src/pages/AssignmentsScreen";
import LoadingScreen from "./src/pages/LoadingScreen";
import LoginScreen from "./src/pages/LoginScreen";
import React, { useCallback, useEffect } from 'react';
import GPAScreen from "./src/pages/GPAScreen";
import NotificationScreen from "./src/pages/NotificationScreen";
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import ContactScreen from "./src/pages/ContactScreen";
import messaging from "@react-native-firebase/messaging";
import SecurityScreen from "./src/pages/SecurityScreen";
import PrivacyPolicyScreen from "./src/pages/PrivacyPolicyScreen";
import notifee from '@notifee/react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const setAppGroupData = useCallback(async () => {
      const appGroupIdentifier = 'group.com.Gradebook.Gradebook';
      try {
        await SharedGroupPreferences.setItem(
          "grades",
          {"displayText": "Coming Soon!"},
          appGroupIdentifier,
        )
      } catch (e) {
        console.log("Error", e);
      }
    }, []);

    useEffect(() => {
      setAppGroupData();
    });

    useEffect(()=>{
      const subscription = messaging().onMessage(message => {
        try {
          notifee.displayNotification({
              title: message.notification?.title,
              body: message.notification?.body,
          });
        } catch (_) {}
      });
      return subscription; 
    },[]);

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
              <Stack.Screen
                name="notifications"
                component={NotificationScreen}
                options={{ 
                  headerShown: true, 
                  headerTitle: "", 
                  gestureEnabled: true,
                  headerBackTitle: "Account",
                }}
              />
              <Stack.Screen
                name="contact"
                component={ContactScreen}
                options={{ 
                  headerShown: true, 
                  headerTitle: "", 
                  gestureEnabled: true,
                  headerBackTitle: "Account",
                }}
              />
              <Stack.Screen
                name="security"
                component={SecurityScreen}
                options={{ 
                  headerShown: true, 
                  headerTitle: "", 
                  gestureEnabled: true,
                  headerBackTitle: "Account",
                }}
              />
               <Stack.Screen
                name="privacy-policy"
                component={PrivacyPolicyScreen}
                options={{ 
                  headerShown: true, 
                  headerTitle: "", 
                  gestureEnabled: true,
                  headerBackTitle: "Account",
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
    )
}

export default AppNavigator;