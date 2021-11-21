import React from 'react';
import {  View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from '../../../hooks/useTheme';
import { IAssignment } from '../../../store/interfaces/assignment.interface';

const { width, height } = Dimensions.get('window');

type UngradedAssignmentProp = {
    assignment: IAssignment,
}

const UngradedAssignment : React.FC<UngradedAssignmentProp> = ({ assignment }) => {
    const { theme } = useTheme();

    return (
        <View>
            <Text style={{ color: theme.grey }}>Ungraded</Text>
        </View>
    )
}

const styles = StyleSheet.create({
});

export default UngradedAssignment;