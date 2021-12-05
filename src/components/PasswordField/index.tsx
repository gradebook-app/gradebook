import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import React, { useState } from "react"
import { StyleSheet, TextInputProps, View } from "react-native"
import { TouchableOpacity } from "react-native"
import InputField from "../InputField"

type PasswordFieldProps = TextInputProps

const PasswordField : React.FC<PasswordFieldProps> = ({ style, ...props }) => {
    const [ hidden, setHidden ] = useState(true)

    const handleEyeClick = () => {
        setHidden(!hidden)
    }

    return (
        <View>
            <InputField 
                style={style}
                { ...props }
                secureTextEntry={hidden}
            >
                <TouchableOpacity 
                    onPress={handleEyeClick} 
                    style={styles.eyeContainer}>
                    <FontAwesomeIcon 
                        size={20}
                        color={"#DEDEDE"}
                        icon={hidden ? faEyeSlash : faEye} 
                    />
                </TouchableOpacity>
            </InputField>
        </View>
    )
}

const styles = StyleSheet.create({
    eyeContainer: {
        position: "absolute",
        right: 25,
        height: 55,
        display: "flex",
        justifyContent: "center",
    }
})

export default PasswordField