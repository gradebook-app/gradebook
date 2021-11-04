import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View, Text, Image, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAssigments } from '../../hooks/useAssignments';
import Assignment from './components/Assignment';
import GradedAssignment from './components/GradedAssignment';
import UngradedAssignment from './components/UngradedAssignment';
import { LineChart, Grid } from 'react-native-svg-charts'
import GradeChart from '../../components/GradeChart';
import { ICourse } from '../../store/interfaces/course.interface';
import { useGradeColor } from '../../hooks/useGradeColor';
import GradeGraphSlider from './components/GradeGraphSlider';
import LoadingBox from '../../components/LoadingBox';
import BottomSheet from "reanimated-bottom-sheet";
import { IAssignment } from '../../store/interfaces/assignment.interface';
import Blocker from '../../components/Blocker';
import AssignmentSheet from './components/AssignmentSheet';
import { useTheme } from 'react-native-paper';

import NoDataSVG from "../../SVG/NoDataSVG";
import { useAppearanceTheme } from '../../hooks/useAppearanceTheme';
const NoDataPNG = require("../../../assets/no-data.png");

const { width, height } = Dimensions.get('window');

type AssignmentsScreenProps = {
    navigation: any,
}

type INavigationParams = {
    params: {
        course: ICourse,
        markingPeriod: string,
    }
}

const AssignmentsScreen : React.FC<AssignmentsScreenProps> = ({ 
    navigation
}) => {
    const { params: { course, markingPeriod } } : INavigationParams = navigation?.getState()?.routes?.find((route:any) => (
        route.name == "navigator"
    ));

    const { theme } : any = useTheme();

    navigation?.setOptions({ headerStyle: { 
        backgroundColor: theme.background,
    }})

    const { courseId, sectionId } = course; 

    const { assignments, loading, reload } = useAssigments({ courseId, sectionId, markingPeriod });

    const { graded, ungraded } = useMemo(() => {
        const graded = assignments.filter(assignment => {
            return !!assignment.grade.percentage;
        });
        const ungraded = assignments.filter(assignment => {
            return assignment.grade.percentage === null;
        });

        return { graded, ungraded };
    }, [ assignments ]);

    const gradeColor = useGradeColor(course.grade.percentage);

    const assignmentSheet = useRef<any | null>(null);

    const [ selectedAssignment, setSelectedAssignment ] = useState<IAssignment | null>(null); 

    const handleOpenSheet = useCallback((assignment:IAssignment) => {
        setSelectedAssignment(assignment);
        assignmentSheet.current.snapTo(0);
    }, []);

    const handleCloseSheet = useCallback(() => {
        setSelectedAssignment(null);
        assignmentSheet.current.snapTo(1);
    }, []);

    const renderAssignmentSheet = () => {
        return (
            <AssignmentSheet assignment={selectedAssignment} />
        )
    };

    const onRefresh = () => {
        reload();
    };

    const { isDark } = useAppearanceTheme();

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <Blocker block={!!selectedAssignment} onPress={handleCloseSheet} />
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
                        <Text style={[ styles.grade, { color: gradeColor }]}>
                            { course.grade.percentage ?`${course.grade.percentage}% ` : "N/A" }
                            { `${course.grade.letter || ""}` }
                        </Text>
                    </View>
                </View>
            <ScrollView 
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={ styles.scrollView }>
                { graded.length ? <GradeGraphSlider assignments={graded} /> : <></> }
                { ungraded.length ? (
                    <View style={[ styles.assignments, { backgroundColor: theme.secondary, maxHeight: 200 }]}>
                        {/* <Text style={ styles.header }>Ungraded Assignments</Text> */}
                        <ScrollView contentContainerStyle={styles.assignmentsContainer}>
                            {
                                ungraded.map((assignment, index) => {
                                    return (
                                        <Assignment onPress={handleOpenSheet} assignment={assignment} key={index}>
                                            <UngradedAssignment assignment={assignment}/>
                                        </Assignment>
                                    )
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
                                        <Assignment onPress={handleOpenSheet} assignment={assignment} key={index}>
                                            <GradedAssignment assignment={assignment}/>
                                        </Assignment>
                                    )
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
                                <Image style={styles.noDataImage} source={NoDataPNG} />
                            }
                            {/* <NoDataSVG width={width * 0.8} /> */}
                            <Text style={[ styles.noDataCaption, { color: theme.text }]}>No Assignments.</Text>
                        </View>
                    ) : <></>
                }
            </ScrollView>
            <BottomSheet 
                ref={assignmentSheet}
                initialSnap={1}
                snapPoints={[400, 0]}
                borderRadius={25}
                renderContent={renderAssignmentSheet}
                onCloseEnd={handleCloseSheet}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        display: 'flex',
        alignItems: 'center',
        padding: 0,
    },
    classHeader: {
        width: width * 0.9,
        marginVertical: 15,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    className: {
        fontWeight: '700',
        fontSize: 25,
        maxWidth: width * 0.7,
    },
    teacher: {
        marginTop: 7.5,
        fontSize: 15,
    },
    scrollView: {
        width: width,
        display: 'flex',
        alignItems: 'center',
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
    },
    header: {
        fontSize: 17.5,
        fontWeight: '500',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    assignmentsContainer: {
        display: 'flex',
        alignItems: 'center',
        overflow: "hidden",
        minHeight: 260,
    },
    graded: {
        paddingBottom: 10,
    },
    grade: {
        fontSize: 17.5,
        fontWeight: '500',
        marginTop: 5,
    },
    noDataContainer: {
        width: width * 0.9,
        display: 'flex',
        alignItems: 'center',
        marginTop: 50,
    },
    noDataImage: {
        width: width * 0.9,
        height: width * 0.9
    },
    noDataCaption: {
        fontSize: 17.5,
        color: "rgba(0, 0, 0, 0.5)",
    },
});

export default React.memo(AssignmentsScreen)