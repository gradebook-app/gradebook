import { faFingerprint } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import BrandButton from '../../components/BrandButton';
import { setLogoutClient } from '../../store/actions/auth.actions';
import { IRootReducer } from '../../store/reducers';
import Box from './components/box';

type AccountScreenProps = {
    navigation: any,
}

const { width, height } = Dimensions.get('window');

interface ISettings {
    biometricsEnabled: boolean | null,
}

const AccountScreen : React.FC<AccountScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { theme } : any = useTheme();

    const handleLogOut = async () => {
        navigation.navigate('login');
        dispatch(setLogoutClient());
        await AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
    };

    const [ cacheInjected, setCacheInjected ] = useState(false);
    const [ settings, setSettings ] = useState<ISettings>({
        biometricsEnabled: null
    });

    const insertCache = useCallback(async () => {
        if (cacheInjected) return; 

        const cache = await AsyncStorage.getItem("@settings");
        const cachedSettings = cache ? JSON.parse(cache) : null;
        if (!cachedSettings) {
            setCacheInjected(true);
            return; 
        } else {
            setSettings(cachedSettings);
        }
    }, [ cacheInjected ]);

    useEffect(() => {
        insertCache();
    }, [ insertCache ]);

    const handleSettingsChange = (key:keyof ISettings) => async (value:any) => {
        setSettings({ ...settings, [ key ]: value });

        const cache = await AsyncStorage.getItem("@settings");
        const updatedSettings = cache ? JSON.parse(cache) : {};
        AsyncStorage.setItem("@settings", JSON.stringify({ ...updatedSettings, [ key ]: value }));
    };

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <View style={ styles.account }>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Account</Text>
                </View>
            <ScrollView>
                <Box>
                    <Box.Content 
                        iconColor={"#A70000"}
                        icon={faFingerprint}
                        title={"Enable Fingerprint or Face ID"}
                    >
                        <Box.Button active={settings.biometricsEnabled} handleChange={handleSettingsChange('biometricsEnabled')} />
                    </Box.Content>
                </Box>
            </ScrollView>
            </View>
            <BrandButton 
                style={styles.logOut}
                title="Log Out"
                onPress={handleLogOut}
                color={'#fff'}
            />
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
    logOut: {
        marginTop: 'auto',
        marginBottom: 125,
    },
    account: {
        display: 'flex',
        alignItems: 'center',
    },
    headerContainer: {
        width: width,
        padding: 25,
    },
    header: {
        fontWeight: '700',
        fontSize: 30,
    }
})

export default AccountScreen; 