import React, { useEffect, useMemo } from "react";
import { SafeAreaView, View, StyleSheet, Dimensions, Text, RefreshControl } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useGPA } from "../../hooks/useGPA";
import { usePastGPA } from "../../hooks/usePastGPA";
import Box from "../../components/Box";
import { ScrollView } from "react-native-gesture-handler";
import BannerAd from "../../components/BannerAd";
import FadeIn from "../../components/FadeIn";
import { useIsFocused } from "@react-navigation/native";

type GPAScreenProps = {
    navigation: any,
}

const { width, height } = Dimensions.get("window");

const GPAScreen : React.FC<GPAScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();

    const { loading:loadingGPA, gpa, reload } = useGPA();
    const { loading:loadingPastGPA, pastGPA } = usePastGPA();

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const roundGrade = (value:number | undefined) : number => {
        if (!value && value !== 0) return 0; 
        return Math.round(value * Math.pow(10, 4)) / Math.pow(10, 4);
    };

    const pastGPAUnweighted = useMemo(() => {
        let total = 0; 
        pastGPA.forEach((eachGPA) => { total += eachGPA.unweightedGPA; });
        return total; 
    }, [ pastGPA ]);

    const pastGPAWeighted = useMemo(() => {
        let total = 0;
        pastGPA.forEach((eachGPA) => { total += eachGPA.weightedGPA; });
        return total; 
    }, [ pastGPA ]);


    const highschoolGPAUnweighted = useMemo(() => {
        const total = pastGPAUnweighted + (gpa.unweightedGPA || 0);
        return (total / (pastGPA.length + 1));
    }, [ pastGPAUnweighted, gpa ]);

    const highschoolGPAWeighted = useMemo(() => {
        const total = pastGPAWeighted + (gpa.weightedGPA || 0);
        return (total / (pastGPA.length + 1));
    }, [ pastGPAWeighted, gpa ]);

    const isFocused = useIsFocused();

    const onRefresh = () => {
        reload();
    };

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background } ]}>
            <ScrollView
                contentContainerStyle={{ display: "flex", minHeight: height - 100 }}
                refreshControl={
                    <RefreshControl
                        enabled
                        refreshing={isFocused && (loadingGPA || loadingPastGPA)}
                        onRefresh={onRefresh}
                    />
                }
            >
                <BannerAd style={{ marginTop: 15 }} />
                <FadeIn show={true} style={styles.gpaContainer}>
                    <Box title={"Total GPA"} style={{ flexDirection: "column" }}>
                        <Box.Content 
                            showIcon={false}
                            title="Unweighted GPA"
                        >
                            <Box.Value value={roundGrade(highschoolGPAUnweighted) || "N/A"} />
                        </Box.Content>
                        <Box.Separator />
                        <Box.Content 
                            showIcon={false}
                            title="Weighted GPA"
                        >
                            <Box.Value value={roundGrade(highschoolGPAWeighted) || "N/A"} />
                        </Box.Content>
                    </Box>
                </FadeIn>
                <FadeIn show={true} style={styles.gpaContainer}>
                    <Box title={"Current School Year"} style={{ flexDirection: "column" }}>
                        <Box.Content 
                            showIcon={false}
                            title="Unweighted GPA"
                        >
                            <Box.Value value={roundGrade(gpa?.unweightedGPA) || "N/A"} />
                        </Box.Content>
                        <Box.Separator />
                        <Box.Content 
                            showIcon={false}
                            title="Weighted GPA"
                        >
                            <Box.Value value={roundGrade(gpa?.weightedGPA) || "N/A"} />
                        </Box.Content>
                    </Box>
                </FadeIn>
                {
                    pastGPA.map((eachPastGPA, index) => {
                        return (
                            <FadeIn key={index} style={styles.gpaContainer} show={true}>
                                <Box 
                                    title={`Grade ${eachPastGPA.gradeLevel} | ${eachPastGPA.year}`} style={{ 
                                        flexDirection: "column",
                                    }}>
                                    <Box.Content 
                                        showIcon={false}
                                        title="Unweighted GPA"
                                    >
                                        <Box.Value value={roundGrade(eachPastGPA.unweightedGPA) || "N/A"} />
                                    </Box.Content>
                                    <Box.Separator />
                                    <Box.Content 
                                        showIcon={false}
                                        title="Weighted GPA"
                                    >
                                        <Box.Value value={roundGrade(eachPastGPA.weightedGPA) || "N/A"} />
                                    </Box.Content>
                                </Box>
                            </FadeIn>
                        );
                    })
                }
                <View style={styles.disclaimerContainer}>
                    <Text style={[ styles.disclaimer, { color: theme.grey }]}>
                        Disclaimer: All GPA Calculations are estimated and may differ from your actual GPA. 
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        display: "flex",
        alignItems: "center",
        height: height
    },
    gpaContainer: {
        marginBottom: 15,
        marginTop: 10,
        width: width,
        display: "flex",
        alignItems: "center",
    },
    disclaimerContainer: {
        width: width,
        height: 175,
        padding: 25,
    },
    disclaimer: {}
});

export default GPAScreen; 