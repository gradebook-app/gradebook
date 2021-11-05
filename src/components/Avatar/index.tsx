import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useMemo } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useTheme } from "react-native-paper";

type AvatarProps = {
    url?: string | null,
    headers?: any
}

const Avatar : React.FC<AvatarProps> = ({ url, headers }) => {
    return (
        <View style={[ styles.container, { backgroundColor: "#DEDEDE" }]}>
             { url && (
                  <Image style={styles.image} source={{
                        uri: url,
                        headers: headers || {},
                        cache: "force-cache",
                    }} />
             )}
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
        overflow: 'hidden',
    },
    image: {
        width: 65,
        height: 65,
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    name: {
        color: "#fff",
        fontSize: 30,
        fontWeight: '700',
    }
});

export default Avatar; 