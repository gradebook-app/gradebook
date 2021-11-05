import React, { ReactChild, useCallback, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type FadeInProps = {
    children: ReactChild,
    show: boolean, 
}

const FadeIn : React.FC<FadeInProps> = ({ show = false, children }) => {
    const containerOpacity = useRef(new Animated.Value(0)).current; 

    const handleOpacity = useCallback(() => {
        Animated.timing(
            containerOpacity, 
            {
                toValue: show ? 1 : 0,
                duration: 250,
                useNativeDriver: true,
            }
        ).start();
    }, [ show ]);

    useEffect(handleOpacity, [ handleOpacity ]);

    return (
        <Animated.View style={{ opacity: containerOpacity }}>
            { children }
        </Animated.View>
    )
}

export default FadeIn; 