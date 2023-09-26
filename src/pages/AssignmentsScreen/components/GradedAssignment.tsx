import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { useGradeColor } from "../../../hooks/useGradeColor";
import { IAssignment } from "../../../store/interfaces/assignment.interface";
import GradientText from "../../../components/GradientText";
import Percentage from "../../../components/Percentage";

const { width, height } = Dimensions.get("window");

type GradedAssignmentProp = {
    assignment: IAssignment,
}

const GradedAssignment : React.FC<GradedAssignmentProp> = ({ assignment }) => {
    const { theme } = useTheme();

    const grade = useMemo(() => {
        if (assignment.grade.percentage)
            return `${ assignment.grade.percentage }%`; 
        else return "";
    }, [ assignment ]);

    return (
        <View>
            <Percentage 
                grade={assignment?.grade?.percentage || 0}
                label={grade}
                style={styles.percentage}
            />
            <Text style={[ styles.points, { color: theme.grey } ]}>{ assignment.grade.points }</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    percentage: {
        fontSize: 17.5,
        textAlign: "right",
    },
    points: {
        marginTop: 7.5,
        fontSize: 15,
        textAlign: "right",
    }
});

export default GradedAssignment;