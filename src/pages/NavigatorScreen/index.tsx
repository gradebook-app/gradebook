import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useState } from "react";
import GradesScreen from "../GradesScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBook, faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../hooks/useTheme";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AccountScreen from "../AccountScreen";
import { setNotificationToken, setShownAlert } from "../../store/actions/user.actions";
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getUser } from "../../store/selectors";
import messaging from "@react-native-firebase/messaging";
import ScheduleScreen from "../ScheduleScreen";
import * as Haptics from "expo-haptics";
import Alert from "../../components/Alert";
import { getShownAlert } from "../../store/selectors/user.selectors";
import { useDynamicColor } from "../../hooks/useDynamicColor";
import { Linking } from "react-native";
import config from "../../../config";

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
    );
};

type INavigatorScreenProps = {
    navigation: any,
}

const NavigatorScreen : React.FC<INavigatorScreenProps> = ({ navigation, ...props }) => {
    const Tabs = createBottomTabNavigator();

    const { theme } = useTheme();
    const state = useSelector((state:IRootReducer) => state);
    const dispatch = useDispatch();
    const user = getUser(state);

    const getPermission = async () => {
        try {
            await messaging().requestPermission();
            const token = await getToken();
            const storedToken = user?.notificationToken; 
            if (!token || storedToken === token) return;
            dispatch(setNotificationToken(token));
        } catch (error) {}
    };

    const getToken = async () => {
        const token = await messaging().getToken();
        return token; 
    };

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
        } catch(e) { return; }
    }, [ user?.notificationToken ]);

    useEffect(() => {
        
        const subscription = messaging().onTokenRefresh(handleNotificationUpdate);
        return subscription;
    }, []);

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const separatorBarColor = useDynamicColor({
        light: "rgba(0, 0, 0, 0.15)",
        dark: "rgba(255, 255, 255, 0.1)",
    });

    const [ showAlert, setShowAlert ] = useState(true);

    const shownAlert = getShownAlert(state);

    const handleDismissAlert = () => {
        setShowAlert(false);
        dispatch(setShownAlert(true));
    };

    const handleDonate = () => {
        Linking.openURL(config.donateLink);
    };

    return (
        <>
        <Tabs.Navigator 
            initialRouteName="Grades"
            screenListeners={{tabPress: () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    switch(route.name) {
                    case "Grades": {
                        return <TabIcon icon={faBook as IconProp} focused={focused} />;
                    }
                    case "Schedule": {
                        return <TabIcon icon={faCalendarAlt as IconProp} focused={focused} />;
                    }
                    case "Account": {
                        return <TabIcon icon={faUser as IconProp} focused={focused} />;
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
                headerStyle: {
                    height: 0
                },
                headerShown: false,
                tabBarLabel: "",
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
            {
                <Alert 
                    delay={showAlert ? 500 : 0}
                    visible={showAlert && !shownAlert}
                    title="🚀 #SaveGenesus"
                    description="The current solution is no longer viable for hosting Genesus servers as they are shutting down their free tier. Support us at our GoFundMe before November 28th, 2022 to Save Genesus! Even just one dollar from a quarter of our users is enough to last Genesus for years to come."
                    buttons={[
                        { 
                            title: "Continue", onPress: handleDismissAlert
                        },
                        {
                            title: "Donate", onPress: handleDonate
                        }
                    ]}
                />
            }
        </>
    );
};  



export default NavigatorScreen;