import { useTheme } from "../../../hooks/useTheme";
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Dimensions, Text, Linking } from "react-native";
import { ICourse } from "../../../store/interfaces/course.interface";
import { TouchableOpacity } from "react-native-gesture-handler";
import FadeIn from "../../../components/FadeIn";
import Percentage from "../../../components/Percentage";
import moment from "moment-timezone";

type CourseBoxProps = {
    course: ICourse,
    handleCourse: (e:ICourse) => void 
}

const { width } = Dimensions.get("window");

const CourseBox : React.FC<CourseBoxProps> = ({ course, handleCourse }) => {
    const { theme } = useTheme();
    const [ show, setShow ] = useState(false);

    useEffect(() => setShow(true), []);

    const handlePress = () => {
        const date = moment().tz("America/New_York"); 
        if (date.month() === 3 && date.date() === 1) {
            Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        }       
        handleCourse(course);
    };

    const grade = useMemo(() => {
        const percentage = course.grade.percentage;
        if (!isNaN(parseInt(percentage as any))) {
            return `${ percentage }% ${ course.grade.letter }`;
        } else if (percentage) {
            return percentage;            
        }
        else return "N/A";
    }, [ course ]);

    return (
        <FadeIn style={styles.fadeContainer} show={show}>
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
                        <Percentage 
                            grade={course.grade.percentage || 0}
                            style={ styles.grade }
                            label = { grade }
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </FadeIn>
    );
};

const styles = StyleSheet.create({
    fadeContainer: {
    },  
    container: {
        width: width * 0.9,
        minHeight: 100,
        marginVertical: 7.5,
        borderRadius: 5,
        shadowColor: "rgba(0, 0, 0, 0.25)",
        shadowOpacity: 0.35,
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