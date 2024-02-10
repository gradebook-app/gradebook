import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, SafeAreaView, Dimensions, StyleSheet, ScrollView, Text, ActivityIndicator } from "react-native";
import Box from "../../components/Box";
import FadeIn from "../../components/FadeIn";
import { useTheme } from "../../hooks/useTheme";
import { useDispatch } from "react-redux";
import { setUserPurgeCache } from "../../store/actions/user.actions";
import RNTStorageCalculator from "../../components/RNTStorageCalculator";
import StorageCalculator from "../../components/RNTStorageCalculator";

const { width } = Dimensions.get("window");

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

    const [ cacheSize, setCacheSize ] = useState<number | null>(null);

    const updateStorage = useCallback(async () => {
        const size = await StorageCalculator.getAbsoluteCacheSize();
        if (typeof size === "number") setCacheSize(size);
    }, [ RNTStorageCalculator ]);

    useEffect(() => { updateStorage(); }, [ updateStorage ]);

    const [ clearingCache, setClearingCache ] = useState(false);

    const dispatch = useDispatch();

    const handleClearCache = useCallback(async () => {
        setClearingCache(true);
        
        const keys = await AsyncStorage.getAllKeys();
        const removableKeys = keys.filter(key => {
            return !["@credentials"].includes(key) && !key.includes("persist");
        });

        await AsyncStorage.multiRemove(removableKeys);

        await new Promise((resolve) => {
            dispatch(setUserPurgeCache({
                result: () => resolve(true)
            }));
        });
        setClearingCache(false); 

        updateStorage();
    }, []);

    const cacheSizeInKB = useMemo(() => {
        return cacheSize ? (cacheSize / 1024).toLocaleString(undefined, { maximumFractionDigits: 3 }) : null; 
    }, [ cacheSize ]);
 
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
                                    <FadeIn style={styles.cacheDescription} show={true}>
                                        <>
                                            { 
                                                cacheSizeInKB && (
                                                    <Text style={[
                                                        {
                                                            color: theme.grey
                                                        }
                                                    ]}>
                                                        { cacheSizeInKB } KB
                                                    </Text>
                                                )
                                            }
                                        </>
                                    </FadeIn>
                                )}
                            </>
                        </Box.Content>
                    </Box.Clickable>
                </Box>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey, marginBottom: 15 }]}>
                        Note: Only a partial amount of cache is able to be purged. For clearing all cache, deletion of the app is mandatory.
                    </Text>
                    <Text style={[{ color: theme.grey }]}>
                        After clearing cache, a full reload of the app is needed to view the original state. 
                    </Text>
                </View>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>

                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
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
    },
    cacheDescription: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    }
});

export default AdvancedOptionsScreen;