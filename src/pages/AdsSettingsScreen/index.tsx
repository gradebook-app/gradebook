import { faAd, } from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useEffect } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Box from "../../components/Box";
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { setLimitAds } from "../../store/actions/settings.actions";
import { getLimitAds } from "../../store/selectors/settings.selectors";

const { width, height } = Dimensions.get("window");

type ContactScreenProps = {
    navigation: any,
}

const AdsSettingsScreen : React.FC<ContactScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const state = useSelector((state:IRootReducer) => state);
    const limitAds = getLimitAds(state);

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const handleLimitAds = useCallback((e) => dispatch(setLimitAds(e)), [ dispatch ]);

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Configure Ads</Text>
                </View>
                <Box.Space />
                <Box>
                    <Box.Content 
                        icon={faAd}
                        iconColor={"#0092E6"}
                        title="Limit Ads"
                    >
                        <Box.Button active={limitAds} handleChange={handleLimitAds} />
                    </Box.Content>
                </Box>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>
                        Ad revenue is used to pay off of the costs of the service Genesus Provides to students. 
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        Limiting Ads will lower the Ad revenue generated to fund this open source project.
                    </Text>
                </View>
                <Box.Space />
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
        minHeight: height - 150,
    },
    captionContainer: {
        width: width,
        padding: 25,
    },
});

export default AdsSettingsScreen;