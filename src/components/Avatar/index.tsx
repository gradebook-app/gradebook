import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useMemo } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useTheme } from "react-native-paper";

type AvatarProps = {
    url?: string,
    headers?: any
}

const Avatar : React.FC<AvatarProps> = ({ url, headers }) => {
    const { colors } = useTheme();

    return (
        <View style={[ styles.container, { backgroundColor: "#DEDEDE" }]}>
            <Image width={65} height={65} source={{
                uri: url,
                headers: headers || {},
                cache: "force-cache",
            }} />
            <FontAwesomeIcon size={30} color={"rgba(0, 0, 0, 0.15)"} icon={faUser} />
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        width: 65,
        height: 65,
        borderRadius: 65,
        margin: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        color: "#fff",
        fontSize: 30,
        fontWeight: '700',
    }
});

export default Avatar; 