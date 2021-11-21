import "react-native-gesture-handler";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect } from 'react';
import GradesScreen from "../GradesScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBook, faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../hooks/useTheme";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AccountScreen from "../AccountScreen";
import { setNotificationToken } from "../../store/actions/user.actions";
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getUser } from "../../store/selectors";
import { DynamicColorIOS } from "react-native";
import messaging from "@react-native-firebase/messaging";
import ScheduleScreen from "../ScheduleScreen";
import * as Haptics from 'expo-haptics';

type TabIconProps = {
    focused: boolean,
    iconSize?: number,
    icon: IconProp,
}

const TabIcon : React.FC<TabIconProps> = ({ focused, iconSize, icon, ...props }) => {
    const size = iconSize || 25; 
    const { palette } = useTheme();

    const iconColor = focused ? palette.primary : "#DEDEDE";

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
    const Tabs = createBottomTabNavigator();

    const { theme } = useTheme();
    const state = useSelector((state:IRootReducer) => state);
    const dispatch = useDispatch();
    const user = getUser(state);

    // const handleAppStateUpdate = () => {
    //     console.log("focused");
    // };

    // useEffect(() => {
    //     AppState.addEventListener('focus', handleAppStateUpdate);
    //     return () => {
    //         AppState.removeEventListener('focus', handleAppStateUpdate);
    //     }
    // });

    const getPermission = async () => {
        try {
            await messaging().requestPermission();
            const token = await getToken();
            const storedToken = user?.notificationToken; 
            if (!token || storedToken === token) return;
            dispatch(setNotificationToken(token));
        } catch (error) {}
    }

    const getToken = async () => {
        const token = await messaging().getToken();
        return token; 
    }

    const handleNotificationUpdate = useCallback(async () => {
        try {
            const hasPermission = await messaging().hasPermission();
            if (hasPermission) {
                const token = await getToken();
                const storedToken = user?.notificationToken; 
                if (!token || storedToken === token) return;
                dispatch(setNotificationToken(token));
            } else {
                getPermission();
            }
        } catch(e) { return };
    }, [ user?.notificationToken ])

    useEffect(() => {
        const subscription = messaging().onTokenRefresh(handleNotificationUpdate);
        return subscription;
    }, []);

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const separatorBarColor = DynamicColorIOS({
        light: "rgba(0, 0, 0, 0.15)",
        dark: "rgba(255, 255, 255, 0.1)",
    });

    return (
        <Tabs.Navigator 
            initialRouteName="Grades"
            screenListeners={{tabPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    switch(route.name) {
                        case "Grades": {
                            return <TabIcon icon={faBook} focused={focused} />
                        }
                        case "Schedule": {
                            return <TabIcon icon={faCalendarAlt} focused={focused} />
                        }
                        case "Account": {
                            return <TabIcon icon={faUser} focused={focused} />
                        }
                        default: {
                            return; 
                        }
                    }
                },
                tabBarStyle: {
                    backgroundColor: theme?.secondary,
                    borderTopColor: separatorBarColor,
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
            <Tabs.Screen 
                name="Schedule" 
                children={() => <ScheduleScreen navigation={navigation} { ...props } />}
            />
             <Tabs.Screen 
                name="Account" 
                children={() => <AccountScreen navigation={navigation} { ...props } />}
            />
        </Tabs.Navigator>
    )
}  



export default NavigatorScreen;