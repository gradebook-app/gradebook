import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View, Text, RefreshControl, TouchableOpacity, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAssigments } from "../../hooks/useAssignments";
import Assignment from "./components/Assignment";
import GradedAssignment from "./components/GradedAssignment";
import UngradedAssignment from "./components/UngradedAssignment";
import { ICourse } from "../../store/interfaces/course.interface";
import GradeGraphSlider from "./components/GradeGraphSlider";
import LoadingBox from "../../components/LoadingBox";
import BottomSheet from "@gorhom/bottom-sheet";
import { IAssignment } from "../../store/interfaces/assignment.interface";
import AssignmentSheet from "./components/AssignmentSheet";
import { useTheme } from "../../hooks/useTheme";
import messaging from "@react-native-firebase/messaging";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";
import NoDataSVG from "../../SVG/NoDataSVG";
import Percentage from "../../components/Percentage";
import LinearGradient from "react-native-linear-gradient";
import WeightSheet from "./components/WeightSheet";
import { ECourseWeight } from "../../store/enums/weights";
import { courseWeightMapped, courseWeightMappedColors } from "../../utils/mapping";
import FadeIn from "../../components/FadeIn";
import { useCourseWeight } from "../../hooks/useCourseWeight";
import { useDispatch, useSelector } from "react-redux";
import { setUserCourseWeight } from "../../store/actions/user.actions";
import { getIsUpdatingCourseWeight } from "../../store/selectors/user.selectors";
import { IRootReducer } from "../../store/reducers";
import { useNetInfo } from "@react-native-community/netinfo";
import BottomSheetBackdrop from "../../components/BottomSheetBackdrop";
import { useIsFocused } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../AppNavigator";
import InterstitialAd from "../../components/InterstitialAd";

const { width, height } = Dimensions.get("window");

type AssignmentsScreenProps = StackScreenProps<RootStackParamList, "assignments">

export type IAssignmentNavigationParams = {
    course: ICourse,
    markingPeriod: string,
}

const AssignmentsScreen : React.FC<AssignmentsScreenProps> = ({ 
    navigation, route
}) => {
    const { course, markingPeriod } = route.params;
    const { theme } = useTheme();

    useEffect(() => {
        navigation.setOptions({ 
            headerStyle: { 
                backgroundColor: theme.background,
            }
        });
    }, [navigation, theme.background]);

    const { courseId, sectionId } = course; 

    const { assignments, loading, reload } = useAssigments({ courseId, sectionId, markingPeriod });
    const { weight, loading:weightLoading, reload:reloadWeight, setWeight } = useCourseWeight({ courseId, sectionId });

    const { graded, ungraded } = useMemo(() => {
        const graded = assignments.filter(assignment => {
            const graded = !!assignment?.grade?.percentage || !!assignment?.grade?.points;
            return graded;  
        });
        const ungraded = assignments.filter(assignment => {
            return assignment.grade.percentage === null && !assignment.grade.points;   
        });

        return { graded, ungraded };
    }, [ assignments ]);

    const assignmentSheet = useRef<BottomSheet | null>(null);
    const weightSheet = useRef<BottomSheet | null>(null);

    const [ selectedAssignment, setSelectedAssignment ] = useState<IAssignment | null>(null); 
   
    const handleOpenSheet = useCallback((assignment:IAssignment) => {
        setSelectedAssignment(assignment);
        assignmentSheet.current?.snapToIndex(1);
    }, []);

    const handleCloseSheet = useCallback(() => {
        setSelectedAssignment(null);
        assignmentSheet.current?.snapToIndex(0);
    }, []);

    const [ isSettingWeight, setIsSettingWeight ] = useState(false);

    const dispatch = useDispatch();
    const state = useSelector((state:IRootReducer) => state);
    const isUpdatingCourseWeight = getIsUpdatingCourseWeight(state);

    const handleCloseWeightsSheet = useCallback(() => {
        if (isUpdatingCourseWeight) return;
        setIsSettingWeight(false);
        weightSheet.current?.snapToIndex(0);
    }, [ isUpdatingCourseWeight ]);

    const handleOpenWeightsSheet = useCallback(() => {
        setIsSettingWeight(true);
        weightSheet.current?.snapToIndex(1);
    }, []);

    const handleSetWeight = useCallback(async (newWeight: ECourseWeight) => {
        const response = await new Promise((resolve) => {
            dispatch(setUserCourseWeight({
                courseId,
                sectionId,
                weight: newWeight,
                resolve
            }));
        });
        
        if (response === true) setWeight(newWeight);
        setIsSettingWeight(false);
        weightSheet.current?.snapToIndex(0);

    }, [courseId, dispatch, sectionId, setWeight]);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(_ => {
            reload();
        });
        return unsubscribe;
    }, []);
    
    const onRefresh = () => {
        reload();
        reloadWeight();
    };

    const gradeLabel = useMemo(() : string => {
        const percentageLabel = course.grade.percentage ?`${course.grade.percentage}%` : "N/A";
        const letterLabel = `${course.grade.letter || ""}`;
        return `${percentageLabel} ${letterLabel}`;
    }, [ course ]);

    const { isDark } = useAppearanceTheme();
    const { isInternetReachable } = useNetInfo();

    const isFocused = useIsFocused();
    
    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <LoadingBox loading={loading && !assignments.length} />
            <View style={ styles.classHeader }>
                <View>
                    <Text 
                        numberOfLines={1}
                        style={[ styles.className, { color: theme.text } ]}>
                        { course?.name || "" }
                    </Text>
                    <Text style={[ styles.teacher, { color: theme.grey} ]}>{ course?.teacher || "" }</Text>
                </View>
                <View>
                    <Percentage 
                        grade={course?.grade.percentage || 0}
                        label={ gradeLabel }
                        style={styles.grade}
                    />
                </View>
            </View>
            <ScrollView 
                refreshControl={
                    <RefreshControl
                        refreshing={isFocused && loading}
                        onRefresh={onRefresh}
                    />
                }
                style={{ borderRadius: 10}}
                contentContainerStyle={ styles.scrollView }>
                <View style={{ minHeight: 28, marginBottom: 5 }}>
                    {
                        (!weightLoading || !!weight) && (weight !== null) ? (
                            <FadeIn show={true}>
                                <TouchableOpacity onPress={handleOpenWeightsSheet}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={courseWeightMappedColors[weight || ECourseWeight.UNWEIGHTED]}
                                        style={[ styles.weightedLabel ]}
                                    >
                                        <Text style={[{ color: "#fff", fontWeight: "500" }]}>
                                            { courseWeightMapped[weight || ECourseWeight.UNWEIGHTED ]}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </FadeIn>
                        ) : <></>
                    }
                    {
                        weight === null && !weightLoading && isInternetReachable ? (
                            <FadeIn style={styles.weightUnavailableWarning} show={true}>
                                <Text  
                                    style={styles.weightUnavailableWarningText}
                                >
                                    Warning: Manual weight changing unavailable. Please await more grades then try again.
                                </Text>
                            </FadeIn>
                        ) : <></>
                    }
                </View>
                { graded.length ? <GradeGraphSlider assignments={graded} /> : <></> }
                { ungraded.length ? (
                    <View style={[ styles.assignments, { backgroundColor: theme.secondary, maxHeight: 200 }]}>
                        {/* <Text style={ styles.header }>Ungraded Assignments</Text> */}
                        <ScrollView contentContainerStyle={styles.assignmentsContainer}>
                            {
                                ungraded.map((assignment, index) => {
                                    return (
                                        <Assignment 
                                            onPress={handleOpenSheet} 
                                            assignment={assignment} 
                                            key={`${assignment.name}-${assignment.date}-${index}`}>
                                            <UngradedAssignment assignment={assignment}/>
                                        </Assignment>
                                    );
                                })
                            }
                        </ScrollView>
                    </View>
                ) : <></> }
                {
                    graded.length ? (
                        <View style={[ styles.assignments, {  backgroundColor: theme.secondary }]}>
                            {/* <Text style={ styles.header }>Graded Assignments</Text> */}
                            <ScrollView contentContainerStyle={[ styles.assignmentsContainer, styles.graded]}>
                                {
                                    graded.map((assignment, index) => {
                                        return (
                                            <Assignment 
                                                onPress={handleOpenSheet}
                                                assignment={assignment} 
                                                key={`${assignment.name}-${assignment.date}-${index}`}>
                                                <GradedAssignment assignment={assignment}/>
                                            </Assignment>
                                        );
                                    })
                                }
                            </ScrollView>
                        </View>
                    ) : <></>
                }
                {
                    !assignments.length ? (
                        <View style={styles.noDataContainer}>
                            { isDark ? 
                                <></> : 
                                <NoDataSVG width={width * 0.8}/>
                            }
                            {/* <NoDataSVG width={width * 0.8} /> */}
                            <Text style={[ styles.noDataCaption, { color: theme.text }]}>No Assignments.</Text>
                        </View>
                    ) : <></>
                }
            </ScrollView>
            <BottomSheet
                ref={assignmentSheet}
                index={0}
                containerStyle={{
                    zIndex: 1
                }}
                backgroundStyle={{
                    borderRadius: 25,
                    borderColor: theme.secondary,
                    borderWidth: 1,
                    backgroundColor: theme.background
                }}
                handleIndicatorStyle={{
                    backgroundColor: isDark ? theme.text : theme.grey
                }}
                backdropComponent={({ ...props }) => (
                    <BottomSheetBackdrop 
                        open={!!selectedAssignment}
                        onClose={handleCloseSheet}
                        { ...props} 
                    />
                )}
                enablePanDownToClose={true}
                enableHandlePanningGesture={true}
                snapPoints={[1, 475]}
            >
                <AssignmentSheet assignment={selectedAssignment} />
            </BottomSheet>
            <BottomSheet
                ref={weightSheet}
                index={0}
                containerStyle={{
                    zIndex: 1
                }}
                backgroundStyle={{
                    borderRadius: 25,
                    borderColor: theme.secondary,
                    borderWidth: 1,
                    backgroundColor: theme.background
                }}
                handleIndicatorStyle={{
                    backgroundColor: isDark ? theme.text : theme.grey
                }}
                backdropComponent={({ ...props }) => (
                    <BottomSheetBackdrop 
                        open={isSettingWeight}
                        onClose={handleCloseWeightsSheet}
                        { ...props} 
                    />
                )}
                enablePanDownToClose={true}
                enableHandlePanningGesture={true}
                snapPoints={[1, 475]}
            >
                <WeightSheet 
                    weight={weight || ECourseWeight.UNWEIGHTED} 
                    onDismiss={() => {
                        handleCloseWeightsSheet();
                    }} 
                    setWeight={handleSetWeight}
                />
            </BottomSheet>
            <InterstitialAd />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        padding: 0,
    },
    weightUnavailableWarning: {
        width: width * 0.85,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#1E5C97",
        borderRadius: 5,
        height: 45,
        marginBottom: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    weightUnavailableWarningText: {
        color: "#fff",
        textAlign: "center"
    },
    classHeader: {
        width: width * 0.9,
        marginVertical: 15,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    className: {
        fontWeight: "700",
        fontSize: 25,
        maxWidth: width * 0.7,
    },
    teacher: {
        marginTop: 7.5,
        fontSize: 15,
    },
    scrollView: {
        width: width,
        display: "flex",
        alignItems: "center",
        paddingBottom: 100,
    },
    assignments: {
        marginVertical: 25,
        borderRadius: 5,
        width: width * 0.9,
        minHeight: 195,
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowRadius: 5,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 0 },
        zIndex: 1,
        marginBottom: 0,
        paddingHorizontal: 5,
        paddingVertical: 15,
        elevation: 10,
    },
    weightedLabel: {
        borderRadius: 5,
        padding: 5,
    },
    header: {
        fontSize: 17.5,
        fontWeight: "500",
        marginVertical: 10,
        marginHorizontal: 10,
    },
    assignmentsContainer: {
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        minHeight: 260,
    },
    graded: {
        paddingBottom: 10,
    },
    grade: {
        fontSize: 17.5,
        fontWeight: "500",
        marginTop: 5,
    },
    noDataContainer: {
        width: width * 0.9,
        display: "flex",
        alignItems: "center",
        marginTop: 50,
    },
    noDataImage: {
        width: width * 0.9,
        height: width * 0.9
    },
    noDataCaption: {
        fontSize: 17.5,
        marginTop: 15,
        color: "rgba(0, 0, 0, 0.5)",
    },
});

export default React.memo(AssignmentsScreen);