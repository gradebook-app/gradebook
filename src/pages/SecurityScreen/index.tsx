import { faFingerprint, faLock } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Box from "../../components/Box";
import { useDispatch, useSelector } from "react-redux";
import { setBiometricsEnabled, setSavePassword } from "../../store/actions/settings.actions";
import { IRootReducer } from "../../store/reducers";
import { getBiometricsEnabled, getSavePassword } from "../../store/selectors/settings.selectors";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const { width, height } = Dimensions.get("window");

type SecurityScreenProps = {
    navigation: any,
}

const SecurityScreen : React.FC<SecurityScreenProps> = ({ navigation }) => {
    const { theme } : any = useTheme();
    const dispatch = useDispatch();
    const state = useSelector((state:IRootReducer) => state);

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);
    
    const biometricsEnabled = getBiometricsEnabled(state);
    const savePassword = getSavePassword(state);
    
    const handleBiometricsEnabled= (e:boolean) => dispatch(setBiometricsEnabled(e));
    const handleSavePassword = (e:boolean) => dispatch(setSavePassword(e));

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
                        icon={faFingerprint as IconProp}
                        title={"Enable Fingerprint or Face ID"}
                    >
                        <Box.Button active={biometricsEnabled} handleChange={handleBiometricsEnabled} />
                    </Box.Content>
                    <Box.Separator />
                    <Box.Content
                        title="Save Password on Login"
                        iconColor={"#EAB500"}
                        icon={faLock as IconProp}
                    >
                        <Box.Button active={savePassword} handleChange={handleSavePassword} />
                    </Box.Content>
                </Box>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>
                        For changed settings to take effect make sure to reload the app once changed. 
                    </Text>
                </View>
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