import React, { useCallback, useEffect } from "react";
import { Dimensions, StyleSheet, View, Animated } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

const { width, height } = Dimensions.get("window");

type BlockerProps = {
    block: boolean,
    onPress?: (e:any) => void,
}

const Blocker : React.FC<BlockerProps> = ({ block, onPress }) => {
    const backgroundRef = React.useRef(new Animated.Value(0)).current; 

    const setBackground = useCallback(() => {
        Animated.timing(
            backgroundRef, {
                toValue: block ? 0.25 : 0,
                duration: 150,
                useNativeDriver: true,
            }
        ).start();
    }, [backgroundRef, block]);

    useEffect(setBackground, [ setBackground ]);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View 
                pointerEvents={block ? "auto" : "none"}
                style={[ styles.container, { opacity: backgroundRef }]}>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        position: "absolute",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    }
});

export default Blocker;