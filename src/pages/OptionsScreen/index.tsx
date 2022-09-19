import React from "react";
import { View, SafeAreaView, Dimensions, StyleSheet, ScrollView, Text } from 'react-native';
import Box from "../../components/Box";
import { useTheme } from "../../hooks/useTheme";
import { faBell, faDollarSign, faLock, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import BannerAd from "../../components/BannerAd";

const { width } = Dimensions.get('window');

type OptionsScreenProps = {
    navigation: any,
}

const OptionsScreen : React.FC<OptionsScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();

    React.useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);


    const handleNotificationSettings = () => {
        navigation.navigate("notifications");
    };

 
    const handleSecuritySettings = () => {
        navigation.navigate("security");
    };

    const handleAdsSettings = () => {
        navigation.navigate("ads-settings");
    };

    const handleAdvancedOptions = () => {
        navigation.navigate("advanced-options");
    };
   
    return (
        <SafeAreaView style={{ backgroundColor: theme.background }}>
            <ScrollView contentContainerStyle={[ styles.scrollView, { backgroundColor: theme.background }]}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Options</Text>
                </View>
                <Box style={{ flexDirection: "column" }}>
                    <Box.Clickable onPress={handleSecuritySettings}>
                        <Box.Content 
                            title="Security"
                            iconColor={"#EAB500"}
                            icon={faLock}
                        >
                            <Box.Arrow onPress={handleSecuritySettings} />
                        </Box.Content>
                    </Box.Clickable>
                    <Box.Separator />
                    <Box.Clickable onPress={handleNotificationSettings}>
                        <Box.Content
                            title="Notifications"
                            iconColor={"#DD4503"}
                            icon={faBell}
                        >
                            <>
                                <Box.Arrow onPress={handleNotificationSettings}/>
                            </>
                        </Box.Content>
                    </Box.Clickable>
                    <Box.Separator />
                    <Box.Clickable onPress={handleAdsSettings}>
                        <Box.Content
                            title="Configure Ads"
                            iconColor={"#0092E6"}
                            icon={faDollarSign}
                        >
                            <>
                                <Box.Arrow onPress={handleAdsSettings}/>
                            </>
                        </Box.Content>
                    </Box.Clickable>
                    <Box.Separator />
                    <Box.Clickable onPress={handleAdvancedOptions}>
                        <Box.Content
                            title="Advanced"
                            iconColor={"#8a2be2"}
                            icon={faWandMagicSparkles}
                        >
                            <>
                                <Box.Arrow onPress={handleAdvancedOptions}/>
                            </>
                        </Box.Content>
                    </Box.Clickable>
                </Box>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>
                        Options will allow you to customize your App Experience. 
                    </Text>
                </View>
                <BannerAd />
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    scrollView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
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
    captionContainer: {
        width: width,
        padding: 25,
    }
});

export default OptionsScreen;