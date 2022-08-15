import React, { ReactChild } from "react";
import { View, StyleSheet, Dimensions, TextInput, TextInputProps, Keyboard, Platform } from "react-native";
import { useTheme } from "../../hooks/useTheme";

const { width } = Dimensions.get("window");

interface InputFieldProps {
    style?: any,
    children?: ReactChild,
}

const InputField : React.FC<InputFieldProps & TextInputProps> = 
    ({ style, children, ...props }) => {

        const { theme }  = useTheme();

        return (
            <View style={[ 
                    styles.container, 
                    { 
                        backgroundColor: theme.secondary,
                    }, style 
                ]}>
                <TextInput 
                    onBlur={() => Keyboard.dismiss}
                    placeholderTextColor={Platform.OS === "ios" ? undefined : theme.grey }
                    style={[ styles.input, { color: theme.text }]}
                    { ...props }
                />
                { children }
            </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
        width: width * 0.90,
        height: 55,
        maxWidth: 500,
        borderRadius: 5,
        shadowColor: Platform.OS === "ios" ? "#000" : "rgba(0, 0, 0, 0.35)",
        shadowRadius: Platform.OS === "ios" ? 5 : 15,
        shadowOpacity: Platform.OS === "ios" ? 0.075 : 0.15,
        shadowOffset: { width: 0, height: 0 },
        marginVertical: 10,
<<<<<<< Updated upstream
        elevation: 7.5,
=======
<<<<<<< Updated upstream
=======
        elevation: 7.5
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    },
    input: {
        width: "100%",
        height: "100%",
        paddingLeft: 15,
        fontSize: 16,
    }
});

export default InputField; 