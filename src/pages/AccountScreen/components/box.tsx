import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { ReactChild } from 'react';
import { 
    Dimensions,
    StyleSheet,
    View,
    Text,
    Switch,
} from "react-native";
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

type BoxProps = {

};

type IBoxContentProps = {
    icon?: IconProp,
    iconColor?: string,
    title: string,
    children?: ReactChild,
}

type IBoxChilds = {
    Content: React.FC<IBoxContentProps>,
    Button: React.FC<any>
}


const Box : React.FC<BoxProps> & IBoxChilds = ({ children }) => {
    const { theme, colors } : any = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.secondary }]}>
            { children }
        </View>
    )
}

Box.Content = ({ icon, iconColor, title, children } : IBoxContentProps) => {
    const { theme, colors } : any = useTheme();

    return (
        <View style={ styles.contentContainer }>
            <View style={[ styles.descriptionContainer ]}>
                <View 
                    style={[ styles.iconContainer, { backgroundColor: iconColor ? iconColor : colors.primary }]}>
                    { icon && <FontAwesomeIcon color={"#fff"} icon={icon} /> }
                </View>
                <Text style={[ styles.title, { color: theme.text }]}>{ title }</Text>
            </View>
            { children }
        </View>
    )
}

Box.Button = ({ active, handleChange }) => {
    const { colors } = useTheme();

    return (
        <View style={ styles.buttonContainer }>
            <Switch
                trackColor={{ false: "#767577", true: colors.primary }}
                thumbColor={active ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleChange}
                value={active}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        minHeight: 45,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 2.5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowOpacity: 0.35,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
    },
    contentContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (width * 0.9) - 20,
    },
    buttonContainer:{
        marginLeft: 'auto',
    },
    iconContainer: {
        width: 25,
        height: 25,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    descriptionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        marginHorizontal: 10,
    }
});

export default Box; 