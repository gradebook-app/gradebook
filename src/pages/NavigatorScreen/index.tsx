import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import GradesScreen from "../GradesScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBook, faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../hooks/useTheme";
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
import InAppReview from "react-native-in-app-review";
import moment from "moment";
import { Text, TouchableOpacity } from "react-native";

type TabIconProps = {
    focused: boolean,
    iconSize?: number,
    icon: any,
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

    const { theme, palette } = useTheme();
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
        } catch (error) {
            console.error(error);
        }
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

    const daysSinceAccountCreation = useMemo(() =>  moment().diff(moment(user?.createdAt), "days"), [ user ]);
    const showReview = useMemo(() => daysSinceAccountCreation > 14 && InAppReview.isAvailable(), [ daysSinceAccountCreation, InAppReview]);

    const alertButtons = useMemo(() => {
        const baseButtons = [
            { 
                title: "Dismiss", onPress: handleDismissAlert
            },
        ];

        if (showReview) {
            baseButtons.push({
                title: "Rate", onPress: () => {
                    InAppReview.RequestInAppReview()
                        .then(() => {
                            handleDismissAlert();
                        })
                        .catch((error) => {
                            console.log(error);
                            handleDismissAlert();
                        });
                }
            });
        }

        return baseButtons;
    }, [ handleDismissAlert, showReview ]);

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
                            return <TabIcon icon={faBook} focused={focused} />;
                        }
                        case "Schedule": {
                            return <TabIcon icon={faCalendarAlt} focused={focused} />;
                        }
                        case "Account": {
                            return <TabIcon icon={faUser} focused={focused} />;
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
                    title="🥳 Genesus is Back"
                    buttons={alertButtons}
                >
                    <>
                        <Text style={{ color: theme.grey, textAlign: "center" }}>
                            Genesus&apos; queries are up-to-date with Genesis&apos; redesign now! If you are experiencing any errors still, please contact us by navigating to the&nbsp; 
                            <Text style={{ color: palette.blue }} onPress={() => navigation.navigate("contact")}>Contact</Text> screen.
                        </Text>
                        {
                            showReview && (
                                <Text style={{ color: theme.grey, textAlign: "center", marginTop: 15 }}>
                                    Additionally, if in the past { daysSinceAccountCreation } days Genesus has helped you in any way, or you have generally enjoyed your experience, please rate the app by clicking the blue rate button below (It&apos;ll only take 3 seconds).
                                </Text>
                            )
                        }
                    </>
                </Alert>
            }
        </>
    );
};  



export default NavigatorScreen;