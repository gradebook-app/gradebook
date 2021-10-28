import React, { ReactChild } from 'react';
import { View, StyleSheet, Dimensions, TextInput, TextInputProps, Keyboard } from 'react-native';

const { width, height } = Dimensions.get('window');

interface InputFieldProps {
    style?: any,
    children?: ReactChild,
}

const InputField : React.FC<InputFieldProps & TextInputProps> = 
    ({ style, children, ...props }) => {
    return (
        <View style={[ styles.container, style ]}>
            <TextInput 
                onBlur={() => Keyboard.dismiss}
                style={styles.input}
                { ...props }
            />
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
        backgroundColor: '#fff',
        width: width * 0.90,
        height: 55,
        maxWidth: 500,
        borderRadius: 5,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.075,
        shadowOffset: { width: 0, height: 0 },
        marginVertical: 10,
    },
    input: {
        width: "100%",
        height: "100%",
        paddingLeft: 15,
        fontSize: 16,
    }
});

export default InputField; 