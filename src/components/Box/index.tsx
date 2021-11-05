import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { ReactChild } from 'react';
import { 
    Dimensions,
    StyleSheet,
    View,
    Text,
    Switch,
    StyleProp,
    ViewStyle,
    TouchableNativeFeedback,
    DynamicColorIOS,
    GestureResponderEvent,
} from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

type BoxProps = {
    style?: StyleProp<ViewStyle>,
    title?: string,
};

type IBoxContentProps = {
    icon?: IconProp,
    iconColor?: string,
    title: string,
    children?: ReactChild,
    showIcon?: boolean,
}

type IBoxButtonProps = {
    active: boolean | null, 
    handleChange: (e:boolean) => void; 
}

type IBoxArrowProps = { 
    onPress: () => void 
}

type IBoxClickableProps = {
    children: ReactChild, 
    onPress: ((event: GestureResponderEvent) => void) & (() => void),
}

type IBoxSpaceProps = {}

type IBoxSeparatorProps = {}

type IBoxValueProps = {
    value: any,
}

type IBoxChilds = {
    Content: React.FC<IBoxContentProps>,
    Button: React.FC<IBoxButtonProps>,
    Arrow: React.FC<IBoxArrowProps>,
    Clickable: React.FC<IBoxClickableProps>,
    Space: React.FC<IBoxSpaceProps>,
    Separator: React.FC<IBoxSeparatorProps>,
    Value: React.FC<IBoxValueProps>,
}


const Box : React.FC<BoxProps> & IBoxChilds = ({ children, style, title }) => {
    const { theme, colors } : any = useTheme();

    return (
        <View>
            { title &&  <Text style={[ styles.boxTitle, { color: theme.grey }]}>{ title }</Text> }
            <View style={[styles.container, { backgroundColor: theme.secondary }, style ]}>
                { children }
            </View>
        </View>
    )
}

Box.Clickable = ({ children, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            { children }
        </TouchableOpacity>
    )
}

Box.Content = ({ icon, iconColor, title, children, showIcon = true } : IBoxContentProps) => {
    const { theme, colors } : any = useTheme();

    return (
        <View style={ styles.contentContainer }>
            <View style={[ styles.descriptionContainer ]}>
                { showIcon && (
                    <View 
                        style={[ styles.iconContainer, { backgroundColor: iconColor ? iconColor : colors.primary }]}>
                        { icon && <FontAwesomeIcon color={"#fff"} icon={icon} /> }
                    </View>
                )}
                <Text style={[ styles.title, { color: theme.text }]}>{ title }</Text>
            </View>
            { children }
        </View>
    )
}

Box.Button = ({ active, handleChange }) => {
    const { colors, theme } : any = useTheme();

    return (
        <View style={ styles.buttonContainer }>
            <Switch
                trackColor={{ false: theme.secondary, true: colors.primary }}
                thumbColor={!!active ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor={theme.secondary}
                onValueChange={handleChange}
                value={!!active}
            />
        </View>
    )
}

Box.Value = ({ value }) => {
    const { theme } : any = useTheme();

    return (
        <View style={ styles.valueContainer }>
            <Text style={[ styles.value, { color: theme.grey }]}>{ value }</Text>
        </View>
    )
}

Box.Space = () => {
    return (
        <View style={styles.space}></View>
    )
}

Box.Separator = () => {
    const color = DynamicColorIOS({
        light: "rgba(0, 0, 0, 0.1)",
        dark: "rgba(255, 255, 255, 0.1)",
    })

    return (
        <View style={styles.separatorContainer}>
            <View 
                style={[
                    styles.separator, 
                    { backgroundColor: color }
                ]}
            ></View>
        </View>
    )
}

Box.Arrow = ({ onPress }) => {
    const color = "#DEDEDE";

    return (
        <TouchableNativeFeedback onPress={onPress}>
            <FontAwesomeIcon
                size={20}
                style={{ marginTop: 2.5 }}
                color={color}
                icon={faAngleRight}
            />
        </TouchableNativeFeedback>
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
        zIndex: 1,
        shadowOffset: { width: 0, height: 0 },
        marginTop: 7.5,
    },
    contentContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (width * 0.9) - 20,
        padding: 5,
        minHeight: 50,
        alignItems: 'center',
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
    },
    space: {
        height: 22.5,
        width: width,
        backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
    separatorContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: width * 0.9,
        justifyContent: 'flex-end',
        marginRight: (width * 0.1 * 0.5) - 17.5,  
    },
    separator: {
        width: width * 0.75,
        height: 0.5,
        borderRadius: 1,
    },
    valueContainer: {
        marginLeft: 'auto',
    },
    value: {
        marginHorizontal: 10,
    },
    boxTitle: {
        textAlign: 'right',
        marginTop: 10,
        marginRight: 10,
    }
});

export default Box; 