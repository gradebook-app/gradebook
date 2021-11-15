import { faBook, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React, { ReactChild, useCallback, useEffect, useState } from 'react';
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet, 
    View, 
    Button,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessDenied, setLoginClient, setLoginError, setLogoutClient } from '../../store/actions/auth.actions';
import { IRootReducer } from '../../store/reducers';
import { getAccessToken, getUser, isAccessDenied, isLoading, isLoginError } from '../../store/selectors';
import { hasNotificationPermission } from '../../utils/notification';
import * as Notifications from "expo-notifications"
import * as LocalAuthentication from 'expo-local-authentication';
import BrandButton from '../../components/BrandButton';
import { TouchableOpacity } from 'react-native';
import { ISettings } from '../AccountScreen';
import messaging from '@react-native-firebase/messaging'
import FadeIn from '../../components/FadeIn';
import { ScrollView } from 'react-native-gesture-handler';

const GradebookIcon = require("../../../assets/gradebook-logo.png");

const { width, height } = Dimensions.get('window');

type LoadingScreenProps = {
    navigation: any
}

const LoadingScreen : React.FC<LoadingScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const state = useSelector((state:IRootReducer) => state);
    const isAccessToken = !!getAccessToken(state);
    const accessDenied = isAccessDenied(state);
    const loginError = isLoginError(state);
    const [ isBiometricsEnabled, setIsBiometricsEnabled ] = useState(false);

    const { theme, colors } : any = useTheme();
    const loading = isLoading(state);

    const handleLogOut = async () => {
        navigation.navigate('login');
        dispatch(setLogoutClient());
        await AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
    };

    const handleAuth = useCallback(async () => {
        if (isAccessToken) {
            navigation.navigate("navigator");
            return;
        };

        if (accessDenied) {
            navigation.navigate("login")
            dispatch(setAccessDenied(false));
            return; 
        }
        
        const credentials = await AsyncStorage.getItem("@credentials");
    
        if (loginError && credentials) {
            navigation.navigate("navigator");
            dispatch(setLoginError(false))
            return false; 
        };

        let token = null

        const cachedSettings = await AsyncStorage.getItem("@settings");
        const settings:ISettings | null = cachedSettings ? JSON.parse(cachedSettings) : null;

        if (settings) {
            const biometricsEnabled = settings.biometricsEnabled;
            if (biometricsEnabled) {
                setIsBiometricsEnabled(true);
                const response = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Enter Passcode to View Grades"
                    })
                if (!response.success) return; 
            };
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
                    };
                }
            } catch(e) {
                console.log(e);
            };


            const data = JSON.parse(credentials);
            dispatch(setLoginClient({ ...data, notificationToken: token }));
        } else {
            setIsBiometricsEnabled(false);
            navigation.navigate("login")
        }
    }, [ isAccessToken, accessDenied, loginError ]);

    const [ visible, setVisible ] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    useEffect(() => {
        handleAuth();
    }, [ handleAuth ])

    return (
        <SafeAreaView style={[ styles.container, {  backgroundColor: theme.background }]}>
                { isBiometricsEnabled && (
                    <TouchableOpacity onPress={handleLogOut} style={styles.signOut}>
                        <Button title="Sign Out" onPress={handleLogOut}/> 
                        <FontAwesomeIcon color={"#006ee6"} icon={faSignOutAlt} />
                    </TouchableOpacity>
                )}
                <FadeIn style={styles.loadingContainer} show={visible}>
                    <>
                        {/* <FontAwesomeIcon size={65} color={colors.primary} icon={faBook} />   */}
                        <View style={{ ...styles.loading, backgroundColor: theme.secondary }}>
                            <Image style={{ width: 100, height: 100 }} source={GradebookIcon}/>
                        </View>
                        <ActivityIndicator animating={loading} />
                    </>
                </FadeIn>
                <View style={styles.buttonGroup}>
                    { isBiometricsEnabled ? (
                        <>
                            <BrandButton 
                                style={[{ backgroundColor: colors.primary } ]}
                                color="#fff" 
                                title="Login" 
                                onPress={handleAuth}
                            ></BrandButton>
                        </>
                    ) : null }
                </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        display: 'flex',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        zIndex: 1,
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        top: ((height * 0.5) - (0.5 * width * 0.35)) + 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.075,
        shadowOffset: { width: 0, height: 0 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.075,
        shadowOffset: { width: 0, height: 0 },
        display: 'flex',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonGroup: {
        marginTop: 'auto',
        marginBottom: 50,
    },
    signOut: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        right: 15,
        top: 45,
        alignItems: 'center',
    }
});

export default LoadingScreen;