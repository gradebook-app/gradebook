import { faFlagUsa, faIdBadge, faKey, faPizzaSlice, faSchool, faUserCog, faPhone, faShieldAlt, faCoins } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View, Text, ScrollView, RefreshControl, Platform, Linking } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useDispatch, useSelector } from "react-redux";
import BrandButton from "../../components/BrandButton";
import { setLogoutClient } from "../../store/actions/auth.actions";
import { IRootReducer } from "../../store/reducers";
import Box from "../../components/Box";
import Avatar from "../../components/Avatar";
import { useAccount } from "../../hooks/useAccount";
import { getAccessToken, getUser } from "../../store/selectors";
import { genesisConfig } from "../../constants/genesis";
import jwt_decode from "jwt-decode";
import { getUserId } from "../../store/selectors/user.selectors";
import analytics from '@react-native-firebase/analytics';

type AccountScreenProps = {
    navigation: any,
}

const { width, height } = Dimensions.get("window");


const AccountScreen : React.FC<AccountScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { theme } = useTheme();

    const state = useSelector((state:IRootReducer) => state);
    const accessToken = getAccessToken(state);
    const isAccessToken = !!accessToken; 
    const user = getUser(state);
    const userId = getUserId(state);

    const handleLogOut = async () => {
        navigation.navigate("login");
        await analytics().setUserId(null);
        await AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys as string[]));
        dispatch(setLogoutClient({ userId }));
    };

    const { account, loading, reload } = useAccount();

    const onRefresh = () => {
        reload();
    };

    const handleAuth = useCallback(() => {
        if (!isAccessToken) return; 
        setTimeout(() => {
            reload();
        }, 0);
    }, [ isAccessToken ]);

    useEffect(handleAuth, [ handleAuth ]);

    const userProfilePhotoURL = useMemo(() => {
        const schoolExtension = user?.schoolDistrict;
        if (schoolExtension === undefined) return null; 
        const base = genesisConfig[schoolExtension]?.root;
        const studentId = user?.studentId || account.studentId;
        const url = `${base}/sis/photos?type=student&studentID=${studentId}`;
        return url; 
    }, [ user, account ]);

    const avatarCookie = useMemo(() => {
        try {
            const tokenData:any = jwt_decode(accessToken || "");
            const genesisToken = tokenData.token; 
            return `JSESSIONID=${genesisToken}`;
        } catch {
            return "";
        }
    }, [ accessToken ]);

    const handleOptions = () => {
        navigation.navigate("options");
    };

    const handleContactsSettings = () => {
        navigation.navigate("contact");
    };

    const handlePrivacySettings = () => {
        navigation.navigate("privacy-policy");
    };

    const handleDonateLink = () => {
        navigation.navigate("donate");
    };

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <View style={ styles.account }>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            enabled={true}
                            refreshing={loading}
                            onRefresh={onRefresh}
                        />
                    }
                    style={styles.scrollView} 
                    contentContainerStyle={{
                        display: "flex",
                        alignItems: "center",
                        height: height + 65,
                    }}>
                    <View style={styles.headerContainer}>
                        <Text style={[ styles.header, { color: theme.text }]}>Account</Text>
                    </View>
                    <Box style={{ flexDirection: "column" }}>
                        <View style={ styles.userSection }>
                            <Avatar 
                                url={userProfilePhotoURL} 
                                headers={{
                                    "Cookie": avatarCookie,
                                }}
                            />
                            <View style={ styles.userDetailsContainer }>
                                <Text style={[ styles.name, { color: theme.text }]}>{ account.name }</Text>
                                <Text style={[styles.school, { color: theme.grey }]}>{ account.school }</Text>
                            </View>
                        </View>
                        <Box.Separator />
                        <Box.Content iconColor={"#9B7F00"} icon={faSchool} title="Grade Level">
                            <Box.Value value={`${account.grade || ""}`}></Box.Value>
                        </Box.Content>
                        <Box.Separator />
                        <Box.Content iconColor={"#DD0370"} icon={faPizzaSlice} title="Lunch Balance">
                            <Box.Value value={`${account.lunchBalance || ""}`}></Box.Value>
                        </Box.Content>
                        <Box.Separator />
                        <Box.Content iconColor={"#034FDD"} icon={faKey} title="Locker">
                            <Box.Value value={`${account.locker || ""}`}></Box.Value>
                        </Box.Content>
                        <Box.Separator />
                        <Box.Content iconColor={"#9B6000"} icon={faIdBadge} title="Student ID">
                            <Box.Value value={`${account.studentId || ""}`}></Box.Value>
                        </Box.Content>
                        <Box.Separator />
                        <Box.Content iconColor={"#009B8D"} icon={faFlagUsa} title="State ID">
                            <Box.Value value={`${account.stateId || ""}`}></Box.Value>
                        </Box.Content>
                    </Box>
                    <Box.Space />
                    <Box style={{ flexDirection: "column" }}>
                        {
                            Platform.OS === "ios" && (
                                <>
                                    <Box.Clickable onPress={handleDonateLink}>
                                        <Box.Content 
                                            title="Donate"
                                            iconColor={"#89A0DD"}
                                            icon={faCoins}
                                        >
                                            <Box.Arrow onPress={handleDonateLink} />
                                        </Box.Content>
                                    </Box.Clickable>
                                    <Box.Separator />
                                </>
                            )
                        }
                        <Box.Clickable onPress={handleOptions}>
                                <Box.Content 
                                    title="Options"
                                    iconColor={"#DD4503"}
                                    icon={faUserCog}
                                >
                                    <Box.Arrow onPress={handleOptions} />
                                </Box.Content>
                        </Box.Clickable>
                        <Box.Separator />
                        <Box.Clickable onPress={handleContactsSettings}>
                        <Box.Content
                            iconColor={"#34E600"}
                            icon={faPhone}
                            title="Contact">
                            <Box.Arrow onPress={handleContactsSettings} />
                        </Box.Content>
                    </Box.Clickable>
                    <Box.Separator />
                    <Box.Clickable onPress={handlePrivacySettings}>
                        <Box.Content 
                            title="Privacy Policy"
                            iconColor={"#E66C00"}
                            icon={faShieldAlt}
                        >
                            <Box.Arrow onPress={handlePrivacySettings} />
                        </Box.Content>
                    </Box.Clickable>           
                    </Box>
                    <BrandButton 
                        style={styles.logOut}
                        title="Log Out"
                        onPress={handleLogOut}
                        color={"#fff"}
                    />
                </ScrollView>
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
        marginTop: Platform.OS === "android" ? 25 : 0, 
    },
    logOut: {
    //   marginTop: 'auto',
        marginTop: 25,
    },
    account: {
        display: "flex",
        alignItems: "center",
    },
    headerContainer: {
        width: width,
        padding: 25,
        paddingTop: 10,
        paddingBottom: 5,
    },
    header: {
        fontWeight: "700",
        fontSize: 30,
    },
    scrollView: {
        width: width,
        height: height,
    },
    userSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: width * 0.9,
        paddingHorizontal: 7.5,
        paddingVertical: 7.5,
    },
    userDetailsContainer: {
        marginLeft: 10,
    },
    name: {
        fontWeight: "500",
        fontSize: 20,
    },
    school: {
        marginVertical: 5,
    }
});

export default AccountScreen; 