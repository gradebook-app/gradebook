import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React, { ReactChild, useCallback, useEffect } from 'react';
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet, 
    View, 
    Text,
    Animated,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginClient } from '../../store/actions/auth.actions';
import { IRootReducer } from '../../store/reducers';
import { getAccessToken } from '../../store/selectors';

const { width, height } = Dimensions.get('window');

type LoadingScreenProps = {
    navigation: any
}

const LoadingScreen : React.FC<LoadingScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const state = useSelector((state:IRootReducer) => state);
    const isAccessToken = !!getAccessToken(state);

    const hasInternetAsync = async () => {
        let netInfoState = await NetInfo.fetch()
        return netInfoState && netInfoState.isInternetReachable
    }

    const handleAuth = useCallback(async () => {
        NetInfo.fetch().then(async state => {
            if (isAccessToken) {
                navigation.navigate("navigator");
                return;
            };
            
            const credentials = await AsyncStorage.getItem("@credentials");
        
            if (credentials) {
                const cachedMarkingPeriod = await AsyncStorage.getItem("@markingPeriod");
                navigation.setParams({ cachedMarkingPeriod });
                const data = JSON.parse(credentials);
                dispatch(setLoginClient(data));
            } else {
                navigation.navigate("login")
            }
        })
    }, [ isAccessToken, NetInfo ]);

    useEffect(() => {
        handleAuth();
    }, [ handleAuth ])

    return (
        <SafeAreaView style={[ styles.container, {  backgroundColor: "#fff" }]}>
            <View style={styles.loadingContainer}>
                <FontAwesomeIcon size={65} color={colors.primary} icon={faBook} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        zIndex: 1,
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        maxHeight: 200,
        backgroundColor: '#fff',
        maxWidth: 200,
        borderRadius: 10,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.075,
        shadowOffset: { width: 0, height: 0 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadingScreen;