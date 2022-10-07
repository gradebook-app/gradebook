import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from '@react-native-firebase/analytics';
import React, { useCallback, useEffect, useRef, useState } from "react";
import {useNetInfo, addEventListener as networkEventListener } from "@react-native-community/netinfo";
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet, 
    View, 
    ActivityIndicator,
    Image,
    Platform,
    Text,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import { setAccessDenied, setLoginClient, setLogoutClient } from "../../store/actions/auth.actions";
import { IRootReducer } from "../../store/reducers";
import { getAccessToken, isAccessDenied, isLoading, isLoginError } from "../../store/selectors";
import * as LocalAuthentication from "expo-local-authentication";
import BrandButton from "../../components/BrandButton";
import { TouchableOpacity } from "react-native";
import messaging from "@react-native-firebase/messaging";
import FadeIn from "../../components/FadeIn";
import { getSettings } from "../../store/selectors/settings.selectors";
import { getUserId } from "../../store/selectors/user.selectors";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import IOSButton from "../../components/IOSButton";
import GradeChart from "../../components/GradeChart";

const GradebookIcon = require("../../../assets/gradebook-logo.png");

const { width, height } = Dimensions.get("window");

type LoadingScreenProps = {
    navigation: any
}

const LoadingScreen : React.FC<LoadingScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const state = useSelector((state:IRootReducer) => state);

    const isAccessToken = !!getAccessToken(state);
    const accessDenied = isAccessDenied(state);
    const loginError = isLoginError(state);
    const settings = getSettings(state);
    const userId = getUserId(state);
    const network = useNetInfo();

    const [ isBiometricsEnabled, setIsBiometricsEnabled ] = useState(false);

    const { theme, palette } = useTheme();
    const loading = isLoading(state);

    const handleLogOut = async () => {
        await analytics().setUserId(null);
        await analytics().setUserProperty("userId", null);
        await AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys as string[]));
        navigation.navigate("login");
        if (!!userId) dispatch(setLogoutClient({ userId }));
    };

    const navigateToNavigator = useCallback(async () => {
       if (isAccessToken) {
            await analytics().logLogin({ method: "automatic" });
            navigation.navigate("navigator");
       }
    }, [ isAccessToken ]);

    const handleAuth = useCallback(async () => {
        if (isAccessToken) return; 

        if (accessDenied) {
            navigation.navigate("login");
            dispatch(setAccessDenied(false));
            return; 
        }

        const credentials = await AsyncStorage.getItem("@credentials");
    
        // if (loginError && credentials) {
        //     navigation.navigate("navigator");
        //     dispatch(setLoginError(false));
        //     return false; 
        // }

        let token = null;

        if (settings) {
            const biometricsEnabled = settings.biometricsEnabled;
            if (biometricsEnabled) {
                setIsBiometricsEnabled(true);
                const response = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Enter Passcode to View Grades"
                });
                if (!response.success) return; 
            }
        }

        if (credentials && settings?.savePassword) {
            const cachedMarkingPeriod = await AsyncStorage.getItem("@markingPeriod");
            navigation.setParams({ cachedMarkingPeriod });

            try {
                const authStatus = await messaging().hasPermission();
                const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
                if (enabled) {
                    token = await messaging().getToken();
                } else {
                    try {
                        const response = await messaging().requestPermission();
                        const enabled = response === messaging.AuthorizationStatus.AUTHORIZED ||
                                        response === messaging.AuthorizationStatus.PROVISIONAL;
                        if (enabled) token = await messaging().getToken();
                    } catch {
                        console.log("error");
                    }
                }
            } catch(e) {
                console.log(e);
            }

            const data = JSON.parse(credentials);
  
            if (!!userId){
                await analytics().setUserId(userId);
                await analytics().setUserProperty("userId", userId);
            }

            dispatch(setLoginClient({ ...data, notificationToken: token }));
        } else {
            setIsBiometricsEnabled(false);
            navigation.navigate("login");
        }
    }, [ isAccessToken, accessDenied, loginError, settings, userId ]);

    const [ visible, setVisible ] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    useEffect(() => {
        handleAuth();
    }, [ handleAuth ]);

    useEffect(() => {
        navigateToNavigator()
    }, [ navigateToNavigator ]);

    const networkPrevState = useRef<boolean | null>(null);

    useEffect(() => {
        const subscription = networkEventListener((e) => {
            if (networkPrevState.current === false && e.isConnected === true && !loading) {
                dispatch(setLoginClient(false))
                handleAuth();
            };
            networkPrevState.current = e.isConnected;
        });
        return () => subscription();
    }, [ networkPrevState, loading ]);
    
    return (
        <SafeAreaView style={[ styles.container, {  backgroundColor: theme.background }]}>
            { (isBiometricsEnabled) && (
                <TouchableOpacity onPress={handleLogOut} style={styles.signOut}>
                    <IOSButton style={{ marginHorizontal: Platform.OS === "ios" ? 0 : 10 }} onPress={handleLogOut}>Sign Out</IOSButton>
                    <FontAwesomeIcon color={"#006ee6"} icon={faSignOutAlt as IconProp} />
                </TouchableOpacity>
            )}
            <FadeIn style={styles.loadingContainer} show={visible}>
                <>
                    <View style={{ ...styles.loading, backgroundColor: theme.secondary }}>
                        <Image style={{ width: 100, height: 100 }} source={GradebookIcon}/>
                    </View>
                    <ActivityIndicator animating={loading} />
                </>
            </FadeIn>
            <View style={styles.buttonGroup}>
                {
                    (loginError && !network.isConnected) && (
                        <FadeIn show={true}>
                            <Text 
                                style={styles.error}>
                                    No Network Connection.
                            </Text>
                        </FadeIn>
                    )
                }
                {
                    (loginError && network.isConnected) && (
                        <FadeIn show={true}>
                            <Text 
                                style={styles.error}>
                                    Unable to communicate with server.
                            </Text>
                        </FadeIn>
                    )
                }
                { (isBiometricsEnabled || loginError) && (
                    <>
                        <BrandButton 
                            style={[{ backgroundColor: palette.primary } ]}
                            color="#fff" 
                            title="Login" 
                            onPress={handleAuth}
                        ></BrandButton>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
    },
    loadingContainer: {
        position: "absolute",
        zIndex: 1,
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        top: ((height * 0.5) - (0.5 * width * 0.35)) + 5,
        borderRadius: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.075,
        backfaceVisibility: "hidden",
        shadowOffset: { width: 0, height: 0 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    loading: {
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: Platform.OS === "ios" ? "#000" : "rgba(0, 0, 0, 0.5)",
        shadowRadius: 5,
        shadowOpacity: 0.075,
        shadowOffset: { width: 0, height: 0 },
        display: "flex",
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonGroup: {
        marginTop: "auto",
        marginBottom: 50,
    },
    signOut: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        right: 15,
        top: 45,
        alignItems: "center",
    },
    error: { 
        color: 'red', 
        textAlign: "center", 
        marginVertical: 15 
    }
});

export default LoadingScreen;