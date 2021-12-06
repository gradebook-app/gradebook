import { faFingerprint, faLock } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Box from "../../components/Box";
import { ISettings } from "../AccountScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

type SecurityScreenProps = {
    navigation: any,
}

const SecurityScreen : React.FC<SecurityScreenProps> = ({ navigation }) => {
    const { theme } : any = useTheme();

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);
    
    const [ cacheInjected, setCacheInjected ] = useState(false);

    const [ settings, setSettings ] = useState<ISettings>({
        biometricsEnabled: null,
        savePassword: null,
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

    const handleSavePassword = async (e:boolean) => {
        handleSettingsChange("savePassword")(e);
    };

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Security</Text>
                </View>
                <Box.Space />
                <Box style={{ flexDirection: "column" }}>
                    <Box.Content 
                        iconColor={"#A70000"}
                        icon={faFingerprint}
                        title={"Enable Fingerprint or Face ID"}
                    >
                        <Box.Button active={settings.biometricsEnabled} handleChange={handleSettingsChange("biometricsEnabled")} />
                    </Box.Content>
                    <Box.Separator />
                    <Box.Content
                        title="Save Password on Login"
                        iconColor={"#EAB500"}
                        icon={faLock}
                    >
                        <Box.Button active={settings.savePassword} handleChange={handleSavePassword} />
                    </Box.Content>
                </Box>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
    headerContainer: {
        width: width,
        padding: 25,
        paddingTop: 15,
        paddingBottom: 5,
    },
    header: {
        fontWeight: "700",
        fontSize: 30,
    },
    scrollview: {
        display: "flex",
        alignItems: "center",
    },
    captionContainer: {
        width: width,
        padding: 25,
    },
});

export default SecurityScreen;