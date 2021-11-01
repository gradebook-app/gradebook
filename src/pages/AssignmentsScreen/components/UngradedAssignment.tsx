import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from 'react-native-paper';
import { IAssignment } from '../../../store/interfaces/assignment.interface';

const { width, height } = Dimensions.get('window');

type UngradedAssignmentProp = {
    assignment: IAssignment,
}

const UngradedAssignment : React.FC<UngradedAssignmentProp> = ({ assignment }) => {
    const { theme } : any = useTheme();

    return (
        <View>
            <Text style={{ color: theme.grey }}>Ungraded</Text>
        </View>
    )
}

const styles = StyleSheet.create({
});

export default UngradedAssignment;