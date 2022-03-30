import React from "react";
import { Text, StyleSheet, GestureResponderEvent, Platform, Button, TouchableOpacity, StyleProp, ViewStyle  } from "react-native";
import { TouchableOpacity as TouchableOpacityGesture } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";

interface IOSButtonProps {
    children: string; 
    style?: StyleProp<ViewStyle>,
    onPress?: (((event: GestureResponderEvent) => void) & (() => void)) | undefined; 
}

const IOSButton : React.FC<IOSButtonProps> = ({ children, onPress, style = {} }) => {
    const { palette } = useTheme();

    return (
        Platform.OS === "ios" ? (
            <TouchableOpacity style={[styles.container, style ]} onPress={onPress}>
                <Button onPress={(e) => onPress && onPress(e)} title={children} />
            </TouchableOpacity>
        ) : (
            <TouchableOpacityGesture style={[styles.container, style ]} onPress={onPress}>
                <Text style={[ styles.text, { color: palette.blue }]}>{ children }</Text>
            </TouchableOpacityGesture>
        )
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 5,
        marginVertical: 2.5
    },
    text: {
        fontSize: 16.5,
    }
})

export default IOSButton;