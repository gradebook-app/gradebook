import React from "react";
import { requireNativeComponent, ViewStyle } from 'react-native';

interface IApplePayButtonProps {
    onPress: () => void; 
    cornerRadius?: number;
    style?: ViewStyle;
    buttonType?: "dark" | "light"
}

const NativeApplePayButton = requireNativeComponent<IApplePayButtonProps>('RNTApplePayButton');

const ApplePayButton : React.FC<{} & IApplePayButtonProps> = ({ ...props }) => {
    return <NativeApplePayButton { ...props } />
}

export default React.memo(ApplePayButton);