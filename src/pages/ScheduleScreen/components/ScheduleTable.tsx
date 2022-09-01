import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Dimensions, StyleSheet, View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import FadeIn from "../../../components/FadeIn";
import { useTheme } from "../../../hooks/useTheme";
import { ISchedule, IScheduleCourse } from "../../../store/interfaces/schedule.interface";
import MelloSVG from "../../../SVG/MelloSVG";
import UnavailableSVG from "../../../SVG/UnvavailableSVG";

type IScheduleCourseProps = {
    course: IScheduleCourse,
    fetching: boolean,
}

const ScheduleCourse : React.FC<IScheduleCourseProps> = ({ course, fetching }) => {
    const { theme } = useTheme();

    const textOpacity = useRef(new Animated.Value(1)).current; 
    const containerOpacity = useRef(new Animated.Value(1)).current; 
    const translateY = useRef(new Animated.Value(1)).current; 

    const setTextOpacity = useCallback(() => {
        Animated.timing(
            textOpacity,
            {
                duration: 350,
                toValue: fetching ? 0 : 1,
                useNativeDriver: true,
            }
        ).start();
    }, [ fetching ]);
    useEffect(setTextOpacity, [ setTextOpacity]);

    const setTranslateY = useCallback(() => {
        Animated.timing(
            translateY,
            {
                duration: 350,
                toValue: fetching ? 0 : 1,
                useNativeDriver: true,
            }
        ).start();
    }, [ fetching ]);
    useEffect(setTranslateY, [ setTranslateY]);

    const translateYRange = translateY.interpolate({
        inputRange: [ 0, 1],
        outputRange: [ 25, 0]
    });

    const timing = useMemo(() => {
        const startTime = course?.startTime?.toLowerCase().split(/(pm|am)/);
        return `${startTime[0]} - ${course?.endTime}`;
    }, [ course ]);

    const room = useMemo(() => {
        return course.room.replace(/(Room|room)/, "");
    }, [ course ]);

    // useEffect(() => {
    //     return () => { 
    //         Animated.timing(
    //             containerOpacity, {
    //                 toValue: 0,
    //                 duration: 350,
    //                 useNativeDriver: true,
    //             }
    //         ).start();
    //     }
    // });

    const period = useMemo(() => {
        return `${course?.period?.trim()}`;
    }, [ course ]); 

    return (
        <Animated.View style={[ styles.courseViewContainer, { opacity: containerOpacity, backgroundColor: theme.secondary }]}>
            <TouchableOpacity style={[ styles.courseContainer, { backgroundColor: theme.secondary}]}>
                <Animated.View style={[ styles.courseSection, { opacity: textOpacity}]}>
                    <Text numberOfLines={1} style={[{ color: theme.text, maxWidth: 235 }]}>{period} - { course.name }</Text>
                    <Text style={[ styles.room, { color: theme.grey, }]}>{ room }</Text>
                </Animated.View>
                <Animated.View style={[ styles.courseSection, { opacity: textOpacity }]}>
                    <Text style={[ styles.timing, { color: theme.grey }]}>{ timing }</Text>
                    <Text numberOfLines={1} style={[ styles.teacher, { color: theme.grey }]}>{ course.teacher }</Text>
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
};

type IScheduleTableProps = {
    schedule: ISchedule,
    fetching: boolean,
}

const { width } = Dimensions.get("window");

const ScheduleTable : React.FC<IScheduleTableProps> = ({ schedule, fetching }) => {
    const { theme } = useTheme();

    const noSchool = useMemo(() => {
        const includesClosed = schedule?.header?.toLowerCase()?.includes("close");
        return includesClosed && !schedule?.courses?.length;
    }, [ schedule ]);

    const noSchedule = useMemo(() => {
        return !schedule?.courses?.length && !schedule.header && !fetching;
    }, [ schedule, fetching ]);

    const containerOpacity = useRef(new Animated.Value(0)).current; 

    const handleNoSchoolOpacity = useCallback(() => {
        Animated.timing(
            containerOpacity, {
                toValue: noSchool || noSchedule ? fetching ? 0.5 : 1 : 0,
                duration: 350,
                useNativeDriver: true,
            }
        ).start();
    },[ noSchool, fetching ]);

    useEffect(handleNoSchoolOpacity, [ handleNoSchoolOpacity ]);

    return (
        <View style={[ styles.container, { backgroundColor: theme.background }]}>
            <ActivityIndicator style={styles.loading} animating={fetching} />
            <FadeIn show={!!schedule?.courses?.length}>
                <>
                    {
                        schedule?.courses?.map((course:IScheduleCourse, index) => (
                            <ScheduleCourse fetching={fetching} key={index} course={course} />
                        ))
                    }
                </>
            </FadeIn>
            {
                noSchool && (
                    <Animated.View style={[ styles.noSchoolContainer, { opacity: containerOpacity } ]}>
                        <MelloSVG width={width * 0.9} />
                        <Text style={[{ color: theme.grey }]}>Hooray! No School.</Text>
                    </Animated.View>
                )
            }
            {
                noSchedule && (
                    <Animated.View style={[ styles.noScheduleContainer, { opacity: containerOpacity } ]}>
                        <UnavailableSVG width={width * 0.9} />
                        <Text style={[{ color: theme.grey }]}>Schedule Unvavailable.</Text>
                    </Animated.View>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width - 30,
        borderRadius: 5,
        marginVertical: 15,
        display: "flex",
        alignItems: "center",
    },
    loading: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        bottom: 0,
    },
    courseViewContainer: {
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOpacity: 0.35,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0},
        marginVertical: 5,
        elevation: 10,
        borderRadius: 5,
    },
    courseContainer: {
        width: width * 0.9,
        height: 75,
        padding: 15,
        overflow: "hidden",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: 20,
    },
    timing: {
        marginVertical: 7.5,
    },
    room: {
        textAlign: "right",
    },
    teacher: {
        textAlign: "right",
        marginTop: 7.5,
        maxWidth: 200,
        flex: 1,
        overflow: "hidden",
    },
    noSchoolContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    noScheduleContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    courseSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    }
});

export default React.memo(ScheduleTable); 