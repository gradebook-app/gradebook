import React, { ReactChild, useCallback, useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type FadeInProps = {
    children: ReactChild,
    show: boolean, 
    style?: StyleProp<ViewStyle>,
    delay?: number | null
}

const FadeIn : React.FC<FadeInProps> = ({ show = false, children, style, delay = null }) => {
    const containerOpacity = useRef(new Animated.Value(0)).current; 

    const handleOpacity = useCallback(() => {
        Animated.sequence([
            Animated.delay(delay ?? 0),
            Animated.timing(
                containerOpacity, 
                {   
                    toValue: show ? 1 : 0,
                    duration: 200,
                    useNativeDriver: true,
                }
            )
        ]).start();
    }, [ show ]);

    useEffect(handleOpacity, [ handleOpacity ]);

    return (
        <Animated.View style={[ { opacity: containerOpacity }, style ]}>
            { children }
        </Animated.View>
    );
};

export default FadeIn; 