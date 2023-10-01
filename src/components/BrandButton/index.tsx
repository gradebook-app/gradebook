import { useTheme } from "../../hooks/useTheme";
import React, { ReactChild } from "react";
import { 
    TouchableOpacity, 
    ButtonProps,
    StyleSheet,
    Dimensions,
    StyleProp,
    ViewStyle,
    Text,
} from "react-native";

const { width } = Dimensions.get("window");

type BrandButtonProps = {
    style?: StyleProp<ViewStyle>,
    children?: ReactChild,
}

const BrandButton : React.FC<BrandButtonProps & ButtonProps> = ({ style, title, onPress, children }) => {
    const { palette } = useTheme();

    return (
        <TouchableOpacity 
            onPress={onPress}
            style={[ styles.container, {
                backgroundColor: palette.primary,
                display: "flex",
                flexDirection: "row",
            }, style ]}>
            <Text
                style={{ color: "#fff", fontSize: 17.5, marginHorizontal: 5 }}
            >{title}</Text>
            { children }
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        height: 55,
        marginHorizontal: 10,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
});

export default BrandButton; 