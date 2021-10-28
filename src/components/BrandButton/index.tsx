import { useTheme } from 'react-native-paper';
import React from 'react';
import { 
    TouchableOpacity, 
    Button,
    ButtonProps,
    StyleSheet,
    Dimensions,
    StyleProp,
    ViewStyle,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type BrandButtonProps = {
    style?: StyleProp<ViewStyle>,
}

const BrandButton : React.FC<BrandButtonProps & ButtonProps> = ({ style, title, onPress, ...props }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity 
            onPress={onPress}
            style={[ styles.container, {
                backgroundColor: colors.primary
            }, style ]}>
            <Button 
                { ...props }
                onPress={onPress}
                title={title} 
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        height: 55,
        marginHorizontal: 10,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default BrandButton; 