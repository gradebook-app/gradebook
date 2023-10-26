import "react-native-gesture-handler";
import { NavigatorScreenParams } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NavigatorScreen, { BottomTabParamList } from "./src/pages/NavigatorScreen";
import AssignmentsScreen, { IAssignmentNavigationParams } from "./src/pages/AssignmentsScreen";
import LoadingScreen from "./src/pages/LoadingScreen";
import LoginScreen from "./src/pages/LoginScreen";
import React, { useEffect } from "react";
import GPAScreen from "./src/pages/GPAScreen";
import NotificationScreen from "./src/pages/NotificationScreen";
import ContactScreen from "./src/pages/ContactScreen";
import messaging from "@react-native-firebase/messaging";
import SecurityScreen from "./src/pages/SecurityScreen";
import PrivacyPolicyScreen from "./src/pages/PrivacyPolicyScreen";
import notifee from "@notifee/react-native";
import OptionsScreen from "./src/pages/OptionsScreen";
import AdsSettingsScreen from "./src/pages/AdsSettingsScreen";
import { useTheme } from "./src/hooks/useTheme";
import AdvancedOptionsScreen from "./src/pages/AdvancedOptionsScreen";
import DonateScreen from "./src/pages/DonateScreen";

export type RootStackParamList = {
    "navigator": NavigatorScreenParams<BottomTabParamList>;
    "loading": undefined,
    "assignments": IAssignmentNavigationParams,
    "login": undefined,
    "options": undefined,
    "contact": undefined,
    "privacy-policy": undefined,
    "donate": undefined,
    "ads-settings": undefined,
    "gpa": undefined,
    "notifications": undefined,
    "advanced-options": undefined,
    "security": undefined
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    useEffect(()=>{
        const subscription = messaging().onMessage(message => {
            try {
                notifee.displayNotification({
                    title: message.notification?.title,
                    body: message.notification?.body,
                });
            } catch (err) {
                console.error(err);
            }
        });
        return subscription; 
    },[]);

    const { theme } = useTheme();

    return (
        
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
                    headerTitle: "GPA Summary", 
                    headerTitleStyle: {
                        color: theme.text
                    },
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
                    headerBackTitle: "Options",
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
                    headerBackTitle: "Options",
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
            <Stack.Screen
                name="options"
                component={OptionsScreen}
                options={{ 
                    headerShown: true, 
                    headerTitle: "", 
                    gestureEnabled: true,
                    headerBackTitle: "Account",
                }}
            />
            <Stack.Screen
                name="advanced-options"
                component={AdvancedOptionsScreen}
                options={{ 
                    headerShown: true, 
                    headerTitle: "", 
                    gestureEnabled: true,
                    headerBackTitle: "Options",
                }}
            />
            <Stack.Screen
                name="donate"
                component={DonateScreen}
                options={{ 
                    headerShown: true, 
                    headerTitle: "", 
                    headerBackTitle: "",
                    gestureEnabled: true,
                }}
            />
            <Stack.Screen 
                name="ads-settings"
                component={AdsSettingsScreen}
                options={{ 
                    headerShown: true, 
                    headerTitle: "", 
                    gestureEnabled: true,
                    headerBackTitle: "Options",
                }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;