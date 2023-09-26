import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";

interface IBottomSheetBackdropProps extends BottomSheetBackdropProps {
    onClose: () => void; 
    open: boolean;
}

const BottomSheetBackdrop : React.FC<IBottomSheetBackdropProps> = ({ open, onClose, animatedIndex, style }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [0, 0.5],
            [0, 0.5],
            Extrapolate.CLAMP
        ),
    }));
  
    const containerStyle = useMemo(
        () => {
            return [
                style,
                {
                    
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                containerAnimatedStyle,
            ];
        },
        [style, containerAnimatedStyle]
    );
  
    return <Animated.View onTouchStart={() => {
        onClose();
    }} pointerEvents={open ? "box-only" : "none"} style={containerStyle} />;
};
export default BottomSheetBackdrop;