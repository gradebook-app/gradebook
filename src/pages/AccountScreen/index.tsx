import { faBell, faFingerprint, faLock } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import BrandButton from '../../components/BrandButton';
import { setLogoutClient } from '../../store/actions/auth.actions';
import { IRootReducer } from '../../store/reducers';
import Box from '../../components/Box';
import Avatar from "../../components/Avatar";
import { useAccount } from '../../hooks/useAccount';

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

    const { account, loading, reload } = useAccount();

    const onRefresh = () => {
        reload();
    };

    const userProfilePhotoURL = useMemo(() => {
        const base = "https://parents.sbschools.org";
        const url = `${base}/genesis/sis/photos?type=student&studentID=${account.studentId}`;
        return url; 
    }, []);

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <View style={ styles.account }>
            <ScrollView 
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                    />
                }
                style={styles.scrollView} 
                contentContainerStyle={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Account</Text>
                </View>
                <Box style={{ flexDirection: 'column' }}>
                    <View style={ styles.userSection }>
                        <Avatar url={userProfilePhotoURL} />
                        <View style={ styles.userDetailsContainer }>
                            <Text style={[ styles.name, { color: theme.text }]}>{ account.name }</Text>
                            <Text style={[styles.school, { color: theme.grey }]}>{ account.school }</Text>
                        </View>
                    </View>
                    <Box.Separator />
                    <Box.Content showIcon={false} title="Grade Level">
                        <Box.Value value={`${account.grade || "N/A"}`}></Box.Value>
                    </Box.Content>
                    <Box.Separator />
                    <Box.Content showIcon={false} title="Lunch Balance">
                        <Box.Value value={`${account.lunchBalance || "N/A"}`}></Box.Value>
                    </Box.Content>
                    <Box.Separator />
                    <Box.Content showIcon={false} title="Locker">
                        <Box.Value value={`${account.locker || "N/A"}`}></Box.Value>
                    </Box.Content>
                    <Box.Separator />
                    <Box.Content showIcon={false} title="Student ID">
                        <Box.Value value={`${account.studentId || "N/A"}`}></Box.Value>
                    </Box.Content>
                    <Box.Separator />
                    <Box.Content showIcon={false} title="State ID">
                        <Box.Value value={`${account.stateId || "N/A"}`}></Box.Value>
                    </Box.Content>
                </Box>
                <Box.Space />
                <Box style={{ flexDirection: 'column' }}>
                    <Box.Content 
                        iconColor={"#A70000"}
                        icon={faFingerprint}
                        title={"Enable Fingerprint or Face ID"}
                    >
                        <Box.Button active={settings.biometricsEnabled} handleChange={handleSettingsChange('biometricsEnabled')} />
                    </Box.Content>
                    <Box.Separator />
                    <Box.Content
                        title="Save Password on Login"
                        iconColor={"#EAB500"}
                        icon={faLock}
                    >
                        <Box.Button />
                    </Box.Content>
                </Box>
                <Box.Space />
                <Box>
                    <Box.Content
                            title="Notifications"
                            iconColor={"#DD4503"}
                            icon={faBell}
                        >
                            <Box.Button />
                    </Box.Content>
                </Box>
                <BrandButton 
                    style={styles.logOut}
                    title="Log Out"
                    onPress={handleLogOut}
                    color={'#fff'}
                />
            </ScrollView>
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
    logOut: {
        marginTop: 50,
        marginBottom: 125,
    },
    account: {
        display: 'flex',
        alignItems: 'center',
    },
    headerContainer: {
        width: width,
        padding: 25,
        paddingBottom: 5,
    },
    header: {
        fontWeight: '700',
        fontSize: 30,
    },
    scrollView: {
        width: width,
        height: height,
        display: 'flex',
    },
    userSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.9,
        paddingHorizontal: 7.5,
        paddingVertical: 7.5,
    },
    userDetailsContainer: {
        marginLeft: 10,
    },
    name: {
        fontWeight: '500',
        fontSize: 20,
    },
    school: {
        marginVertical: 5,
    }
})

export default AccountScreen; 