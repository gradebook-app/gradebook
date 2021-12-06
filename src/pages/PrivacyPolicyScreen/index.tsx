import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Dimensions, Linking, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Box from "../../components/Box";

const { width, height } = Dimensions.get("window");

type PrivacyPolicyScreenProps = {
    navigation: any,
}

const PrivacyPolicyScreen : React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const handlePrivacyPolicy = () => {
        Linking.openURL("https://gradebook.mahitm.com/privacy");
    };

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <Text style={[ styles.header, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <Box>
                    <Box.Clickable onPress={handlePrivacyPolicy}>
                        <Box.Content 
                            icon={faShieldAlt}
                            iconColor={"orange"}
                            title="View Privacy Policy">
                            <Box.Arrow onPress={handlePrivacyPolicy} />
                        </Box.Content>
                    </Box.Clickable>
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
        paddingBottom: 115,
        alignItems: "center",
    },
    policyContainer: {
        width: width,
        padding: 25,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: "700",
    },
    section: {
        fontSize: 17.5,
        fontWeight: "600",
    }
});

export default PrivacyPolicyScreen;