import React from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from 'react-native-paper';
import { useGradeColor } from '../../../hooks/useGradeColor';
import { IAssignment } from '../../../store/interfaces/assignment.interface';

const { width, height } = Dimensions.get('window');

type GradedAssignmentProp = {
    assignment: IAssignment,
}

const GradedAssignment : React.FC<GradedAssignmentProp> = ({ assignment }) => {
    const gradeColor = useGradeColor(assignment?.grade?.percentage || 0);
    const { theme } : any = useTheme();

    return (
        <View>
            <Text style={[ styles.percentage, { color: gradeColor} ]}>{ assignment.grade.percentage }%</Text>
            <Text style={[ styles.points, { color: theme.grey } ]}>{ assignment.grade.points }</Text>
        </View>
    )
}

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