import "react-native-gesture-handler";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from "expo-notifications"
import React, { useCallback, useEffect } from 'react';
import { Alert, Permission } from 'react-native';
import GradesScreen from "../GradesScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBook, faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "react-native-paper";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AccountScreen from "../AccountScreen";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getUser } from "../../store/selectors";
import { setNotificationToken } from "../../store/actions/user.actions";

type TabIconProps = {
    focused: boolean,
    iconSize?: number,
    icon: IconProp,
    isDark: boolean,
}

const TabIcon : React.FC<TabIconProps> = ({ focused, iconSize, icon, isDark, ...props }) => {
    const size = iconSize || 25; 
    const { colors, theme } : any = useTheme();

    const iconColor = focused ? colors.primary : isDark ? 
        theme?.icon?.dynamic?.dark : theme?.icon?.dynamic?.light;

    return (
        <FontAwesomeIcon 
            color={iconColor}
            size={size} 
            icon={icon} 
            { ...props } 
        />
    )
}

type INavigatorScreenProps = {
    navigation: any,
}

const NavigatorScreen : React.FC<INavigatorScreenProps> = ({ navigation, ...props }) => {
    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);
    const dispatch = useDispatch();

    const hasNotificationPermission = async () => {
        try {
            const permission = await Notifications.getPermissionsAsync();
            if (permission.granted) return true; 
            else if (permission.canAskAgain) {
                const { status } : any = await Notifications.requestPermissionsAsync();
                if (status === "granted") return true; 
                if (status !== "granted") {
                    Alert.alert(
                        "Warning", 
                        "You Will not Receive Any Notifications for Grade, GPA, and Assignment Updates",
                        [
                            { text: "Dismiss" },
                        ]
                    );
                    return false; 
                }
            }
        } catch (e) { return false }
    }

    const handleNotificationConfig = useCallback(async () => {
        try {
            const hasPermission = await hasNotificationPermission();
            if (hasPermission) {
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                const storedToken = user?.notificationToken; 
                if (!token || storedToken === token) return; 
                dispatch(setNotificationToken(token));
            };
        } catch(e) { return };
    }, [ user ]);

    useEffect(() => {
        handleNotificationConfig();
    }, []);

    useEffect(() => {
        const subscription = Notifications.addPushTokenListener(handleNotificationConfig);
        return () => subscription.remove();
    });

    const Tabs = createBottomTabNavigator();

    const { theme } : any = useTheme();

    const { isDark } = useAppearanceTheme();

    navigation?.setOptions({ headerStyle: { 
        backgroundColor: theme.background,
    }})

    return (
        <Tabs.Navigator 
            initialRouteName="Grades"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    switch(route.name) {
                        case "Grades": {
                            return <TabIcon isDark={isDark} icon={faBook} focused={focused} />
                        }
                        case "Schedule": {
                            return <TabIcon isDark={isDark} icon={faCalendarAlt} focused={focused} />
                        }
                        case "Account": {
                            return <TabIcon isDark={isDark} icon={faUser} focused={focused} />
                        }
                        default: {
                            return; 
                        }
                    }
                },
                tabBarStyle: {
                    backgroundColor: theme?.secondary,
                },
                headerShown: false,
                tabBarLabel: '',
                tabBarIconStyle: {
                    marginTop: 15,
                },
                })}
            >
            <Tabs.Screen 
                name="Grades" 
                children={() => <GradesScreen navigation={navigation} { ...props } />}
            />
            {/* <Tabs.Screen 
                name="Schedule" 
                children={() => <GradesScreen navigation={navigation} { ...props } />}
            /> */}
             <Tabs.Screen 
                name="Account" 
                children={() => <AccountScreen navigation={navigation} { ...props } />}
            />
        </Tabs.Navigator>
    )
}  



export default NavigatorScreen;