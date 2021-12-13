import { useTheme } from "../../../hooks/useTheme";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { ICourse } from "../../../store/interfaces/course.interface";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useGradeColor } from "../../../hooks/useGradeColor";
import FadeIn from "../../../components/FadeIn";

type CourseBoxProps = {
    course: ICourse,
    handleCourse: (e:ICourse) => void 
}

const { width } = Dimensions.get("window");

const CourseBox : React.FC<CourseBoxProps> = ({ course, handleCourse }) => {
    const gradeColor = useGradeColor(course.grade.percentage);
    const { theme } = useTheme();
    const [ show, setShow ] = useState(false);

    useEffect(() => setShow(true), []);

    const handlePress = () => {
        handleCourse(course);
    };

    return (
        <FadeIn show={show}>
            <TouchableOpacity onPress={handlePress}>
                <View style={[ styles.container, { backgroundColor: theme.secondary } ]} >
                    <View>
                        <Text 
                            numberOfLines={1}
                            style={[ styles.name, { color: theme.text } ]}
                        >{ course.name }</Text>
                        <Text style={[ styles.teacher, { color: theme.grey }]}>{ course.teacher }</Text>
                    </View>
                    <View style={styles.gradeContainer}>
                        <Text style={[ styles.grade, { color: gradeColor } ]}>
                            { course.grade.percentage || "N/A " }% { course.grade.letter }
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </FadeIn>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        minHeight: 100,
        borderRadius: 5,
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOpacity: 0.35,
        marginVertical: 7.5,
        shadowOffset: { width: 0, height: 0 },
        padding: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    teacher: {
        marginTop: 7.5,
        color: "rgba(0, 0, 0, 0.5)",
    },
    name: {
        fontSize: 17.5,
        fontWeight: "500",
        maxWidth: 200,
        overflow: "hidden",
    },
    gradeContainer: {
        marginLeft: "auto",
        marginRight: 5,
    },
    grade: {
        fontSize: 15,
    }
});

export default React.memo(CourseBox); 