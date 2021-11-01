import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { ReactChild, useCallback, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import { useAppearanceTheme } from '../../../hooks/useAppearanceTheme';
import { IAssignment } from '../../../store/interfaces/assignment.interface';

const { width, height } = Dimensions.get('window');

type AssignmentProp = {
    assignment: IAssignment,
    children?: ReactChild,
    onPress: (e:IAssignment) => void,
}

const Assignment : React.FC<AssignmentProp> = ({ assignment, children, onPress }) => {
    const handlePress = useCallback(() => {
        onPress(assignment);
    }, []);

    const { theme } : any = useTheme();
    const { isDark } : any = useAppearanceTheme();

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={[ styles.container, { backgroundColor: theme.background } ]}>
                <View>
                    <View style={ styles.metaInfo }>
                        <Text 
                            numberOfLines={1} 
                            style={[ styles.title, { color: theme.text }]}
                        >{ assignment?.name  }</Text>
                        { assignment.comment ? 
                            <FontAwesomeIcon 
                                style={styles.comment} 
                                size={20} 
                                color={ isDark ? theme.grey.dynamic.dark 
                                    : "rgba(0, 0, 0, 0.15)"} 
                                icon={faCommentDots} /> 
                        : <></>}
                    </View>
                    <View style={ styles.metaInfo }>
                        <Text style={[ styles.date, { color: theme.grey } ]}>Due: { assignment.date.split(/\s/g).join(" ") }</Text>
                        <Text numberOfLines={1} style={[ styles.category, {color: theme.grey }] }>- { assignment.category }</Text>
                    </View>
                </View>
                { children }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 7.5,
        borderRadius: 5,
        width: width * 0.85,
        height: 75,
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowRadius: 5,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 0 },
        zIndex: 1,
        marginBottom: 0,
        padding: 15,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    metaInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 17.5,
        fontWeight: '500',
        maxWidth: 250,
        overflow: 'hidden',
    },
    date: {
        fontSize: 15,
        marginTop: 7.5,
        color: "rgba(0, 0, 0, 0.5)"
    },
    category: {
        fontSize: 15,
        marginLeft: 5,
        color: "rgba(0, 0, 0, 0.5)",
        overflow: 'hidden',
        maxWidth: 115,
        marginTop: 7.5,
    },
    comment: {
        marginLeft: 7.5,
    }
});

export default Assignment;