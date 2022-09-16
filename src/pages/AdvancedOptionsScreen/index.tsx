import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import { View, SafeAreaView, Dimensions, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import Box from "../../components/Box";
import FadeIn from "../../components/FadeIn";
import { useTheme } from "../../hooks/useTheme";
import { useDispatch } from "react-redux";
import { setUserPurgeCache } from "../../store/actions/user.actions";

const { width } = Dimensions.get('window');

type OptionsScreenProps = {
    navigation: any,
}

const AdvancedOptionsScreen : React.FC<OptionsScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const [ clearingCache, setClearingCache ] = useState(false);

    const dispatch = useDispatch();

    const handleClearCache = useCallback(async () => {
        setClearingCache(true);
        
        await AsyncStorage.removeItem("@gpaPast");
        await AsyncStorage.removeItem("@account");
        await AsyncStorage.removeItem("@markingPeriod");
        await AsyncStorage.removeItem("@gpa");

       await new Promise((resolve) => {
            dispatch(setUserPurgeCache({
                result: () => resolve(true)
            }))
       });
        setClearingCache(false); 
    }, []);
 
    return (
        <SafeAreaView style={{ backgroundColor: theme.background }}>
            <ScrollView contentContainerStyle={[ styles.scrollView, { backgroundColor: theme.background }]}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Advanced Options</Text>
                </View>
                <Box style={{ flexDirection: "column" }}>
                    <Box.Clickable onPress={handleClearCache}>
                        <Box.Content iconColor="#BB9D16" icon={faDatabase} title="Clear Cache">
                            <>
                                <ActivityIndicator animating={clearingCache} />
                                { !clearingCache &&  (
                                    <FadeIn show={true}>
                                        <Box.Value value={"0.00 MB"} />
                                    </FadeIn>
                                )}
                            </>
                        </Box.Content>
                    </Box.Clickable>
                </Box>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>
                        After clearing cache a full reload of the app is needed to view the original state. 
                    </Text>
                </View>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>

                    </Text>
                </View>
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

export default AdvancedOptionsScreen;