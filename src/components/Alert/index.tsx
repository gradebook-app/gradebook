import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, Text, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from '../../hooks/useTheme';
import Blocker from '../Blocker';
import BrandButton from '../BrandButton';
import FadeIn from '../FadeIn';

interface IAlertButton {
    title: string,
    onPress: () => void,
}

type AlertProps = {
    title: string,
    description: string,
    buttons?: IAlertButton[],
    visible: boolean,
    delay?: number,
};

const { width, height } = Dimensions.get('screen');

const Alert : React.FC<AlertProps> = ({ title, description, buttons, visible, delay = 0 }) => {
    const { theme } = useTheme();

    const [ isComponentMounted, setIsComponentMounted ] = useState(false);

    React.useEffect(() => {
        setIsComponentMounted(true);
        return () => setIsComponentMounted(false);
    }, []);

    return (
        <View pointerEvents={isComponentMounted && visible ? 'auto' : 'none'} style={styles.container}>
            <Blocker block={isComponentMounted && visible} />
            <FadeIn delay={delay} show={visible && isComponentMounted} style={[ styles.alert, { backgroundColor: theme.background }]}>
                <>
                    <Text style={[ styles.header, { color: theme.text }]}>{ title }</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200,}}>
                        <Text style={[ styles.description, { color: theme.grey }]}>{ description }</Text>
                    </ScrollView>
                    { 
                        buttons?.map(({ title, onPress } : IAlertButton, index:number) => (
                        <Button 
                                key={index}
                                onPress={onPress} 
                                title={title} 
                            />
                        ))
                    }
                </>
            </FadeIn>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
    },
    description: {
        margin: 10,
        textAlign: 'center',
    },
    alert: {
        width: 250,
        minHeight: 150,
        borderRadius: 10,
        display: 'flex',
        alignItems:'center',
        padding: 15,
        zIndex: 1,
    }
});

export default Alert; 