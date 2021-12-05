import React, { useMemo } from "react"
import {  View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../../hooks/useTheme"
import { IAssignment } from "../../../store/interfaces/assignment.interface"

type UngradedAssignmentProp = {
    assignment: IAssignment,
}

const UngradedAssignment : React.FC<UngradedAssignmentProp> = ({ assignment }) => {
    const { theme } = useTheme()

    const message = useMemo(() => {
        const raw = assignment.message 
        const filtered = raw?.replace("Assignment", "")
        return filtered
    }, [ assignment ])

    return (
        <View style={styles.container}>
            <Text style={{ color: theme.grey, textAlign: "right" }}>Ungraded</Text>
            { !!message && (
                <Text
                    numberOfLines={1} 
                    style={[ styles.message, { color: theme.grey }]}
                >{ message }</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    message: {
        width: 75,
        textAlign: "right",
    }
})

export default UngradedAssignment