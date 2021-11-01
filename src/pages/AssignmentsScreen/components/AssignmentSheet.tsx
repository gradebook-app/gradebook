import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { StyleSheet, View, Text, Dimensions, Appearance, } from "react-native";
import { useTheme } from "react-native-paper";
import { useAppearanceTheme } from "../../../hooks/useAppearanceTheme";
import InputField from "../../../InputField";
import { IAssignment } from "../../../store/interfaces/assignment.interface";

type AssignmentSheetProps = {
    assignment?: IAssignment | null,
}

const { width, height } = Dimensions.get('window');

const AssignmentSheet : React.FC<AssignmentSheetProps> = ({ assignment }) => {
    const { theme } : any = useTheme();

    const { isDark } = useAppearanceTheme();

    return (
        <View style={[ styles.assignmentSheet, { backgroundColor: theme.background } ]}>
            <Text style={[ styles.header, { color: theme.text } ]}>{ assignment?.name }</Text>
            <View style={styles.commentContainer}>
                <Text style={[ styles.commentHeader, { color: theme.grey }]}>Teacher Comment:</Text>
                {/* <FontAwesomeIcon 
                        color={"rgba(0, 0, 0, 0.15)"}
                        style={styles.commentIcon} 
                        icon={faCommentDots} 
                /> */}
                <InputField 
                    style={[ styles.comment, { 
                        backgroundColor: isDark ? 
                            theme.secondary : "rgba(0, 0, 0, 0.05)"
                    }]} 
                    editable={false} 
                    value={assignment?.comment || "No Comment"}
                />
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
    commentHeader: {
        fontSize: 15,
        color: "rgba(0, 0, 0, 0.5)",
    }
})

export default React.memo(AssignmentSheet); 