

import React, { useMemo } from "react";
import { StyleSheet, View, Text, Dimensions, } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { useAppearanceTheme } from "../../../hooks/useAppearanceTheme";
import { useCategoryColor } from "../../../hooks/useCategoryColor";
import { useGradeColor } from "../../../hooks/useGradeColor";
import { IAssignment } from "../../../store/interfaces/assignment.interface";
import moment from "moment";

type AssignmentSheetProps = {
    assignment?: IAssignment | null,
}

const { width } = Dimensions.get('window');

const AssignmentSheet : React.FC<AssignmentSheetProps> = ({ assignment }) => {
    const { theme } = useTheme();
    const { isDark } = useAppearanceTheme();

    const assignmentColor = useCategoryColor(assignment?.category || "");
    const gradeColor = useGradeColor(assignment?.grade.percentage || 0);
    const gradeLabel = useMemo(() => {
        const grade = assignment?.grade.percentage; 
        return grade ? `${grade}%` : "" 
    }, [ assignment ]);

    const date = useMemo(() => {
       try {
        const assignmentDate = assignment?.date;
        if (!assignmentDate) return null; 
        let [ month, day ] = assignmentDate.split(/\s/g)[1].split("/"); 
        if (day.length == 1) day = `0${day}`;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; 
        const year = currentMonth >= parseInt(month) ? currentYear: currentYear - 1;
        if (month.length == 1) month = `0${month}`;
        const formattedDate = moment(`${year}-${month}-${day}`).format('dddd, MMMM Do, YYYY');
        return formattedDate;
       } catch { return null }
    }, [ assignment ]);

    const points = useMemo(() => {
        const points = assignment?.grade.points;
        if (!points) return assignment?.message || null;
        return `Scored: ${points}`;
    }, [ assignment ]);

    return (
        <View style={[ styles.assignmentSheet, { backgroundColor: theme.background } ]}>
            <View style={styles.headerContainer}>
                <Text style={[ styles.header, { color: theme.text } ]}>{ assignment?.name }</Text>
                <Text style={[ styles.grade, { color: gradeColor } ]}>{ gradeLabel }</Text>
            </View>
            <Text style={[ styles.date, { color: theme.grey }]}>{ date ?? "" }</Text>
            {
                assignment?.category && (
                    <View style={[styles.categoryContainer, { backgroundColor: assignmentColor }]}>
                        <Text style={[{ color: "#fff" }]}>{ assignment?.category }</Text>
                    </View>
                )
            }
            <Text style={[styles.points, { color: theme.text }]}>{ points ?? "" }</Text>
            <View style={styles.commentContainer}>
                <Text style={[ styles.commentHeader, { color: theme.grey }]}>Teacher Comment:</Text>
                <View 
                    style={[ styles.comment, { 
                        backgroundColor: isDark ? 
                            theme.secondary : "rgba(0, 0, 0, 0.05)"
                    }]} 
                >
                    <Text style={[ styles.commentText, { color: theme.text }]}>
                        { assignment?.comment || "No Comment" }
                    </Text>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    assignmentSheet: {
        width: width,
        height: 400,
        backgroundColor: "#fff",
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        fontSize: 25,
        fontWeight: '600',
    },
    comment: { 
        marginVertical: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        color: "rgba(0, 0, 0, 0.5)"
    },
    commentIcon: {
        marginHorizontal: 10
    },
    commentContainer: {
        marginTop: 'auto',
        marginBottom: 75,
    },
    commentText: {

    },
    commentHeader: {
        fontSize: 15,
        color: "rgba(0, 0, 0, 0.5)",
    },
    categoryContainer: {
        marginVertical: 10,
        alignSelf: 'flex-start',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
    },
    grade: {
        marginHorizontal: 10,
        fontSize: 17.5,
        fontWeight: '500',
    },
    headerContainer: {
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        marginVertical: 5,
        fontSize: 15,
    },
    points: {
        marginVertical: 10,
        fontSize: 20,
        fontWeight: '700',
    }
})

export default React.memo(AssignmentSheet); 