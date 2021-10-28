import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { ReactChild, useCallback, useEffect } from 'react';
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet, 
    View, 
    Text,
    Animated,
} from 'react-native';
import { useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

type LoadingScreenProps = {
    navigation: any
}

const LoadingScreen : React.FC<LoadingScreenProps> = ({ navigation }) => {
    const { colors } = useTheme();

    const handleAuth = useCallback(() => {
        navigation.navigate("login")
    }, []);

    useEffect(handleAuth, [ handleAuth ]);

    return (
        <SafeAreaView style={[ styles.container, {  backgroundColor: "#fff" }]}>
            <View style={styles.loadingContainer}>
                <FontAwesomeIcon size={65} color={colors.primary} icon={faBook} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        zIndex: 1,
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        maxHeight: 200,
        backgroundColor: '#fff',
        maxWidth: 200,
        borderRadius: 10,
        shadowColor: '#000',
        shadowRadius: 5,
        shadowOpacity: 0.075,
        shadowOffset: { width: 0, height: 0 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoadingScreen;