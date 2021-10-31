import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { IAssignment } from '../../../store/interfaces/assignment.interface';

const { width, height } = Dimensions.get('window');

type UngradedAssignmentProp = {
    assignment: IAssignment,
}

const UngradedAssignment : React.FC<UngradedAssignmentProp> = ({ assignment }) => {
    return (
        <View>
            <Text style={{ color: "rgba(0, 0, 0, 0.5)" }}>Ungraded</Text>
        </View>
    )
}

const styles = StyleSheet.create({
});

export default UngradedAssignment;