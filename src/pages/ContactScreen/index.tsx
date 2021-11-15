import { faEnvelope, faHammer } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { Dimensions, Linking, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Box from "../../components/Box";

const { width, height } = Dimensions.get('window');

type ContactScreenProps = {
    navigation: any,
}

const ContactScreen : React.FC<ContactScreenProps> = ({ navigation }) => {
    const { theme } : any = useTheme();

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }})
    }, []);

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Contact</Text>
                </View>
                <Box.Space />
                <Box>
                    <Box.Clickable onPress={() => Linking.openURL('mailto:genesus@mahitm.com')} >
                        <Box.Content 
                            icon={faEnvelope}
                            iconColor={"#0092E6"}
                            title="Email"
                        >
                            <>
                                <Box.Value value="genesus@mahitm.com"/>
                                <Box.Arrow onPress={() => Linking.openURL('mailto:genesus@mahitm.com')} />
                            </>
                        </Box.Content>
                    </Box.Clickable>
                </Box>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>
                        Please feel free to contact Genesus regarding any concerns you may have.
                        Additionally, any feedback and new feature suggestions are welcomed. 
                    </Text>
                </View>
                <Box.Space />
                <Text style={[styles.developer, { color: theme.grey }]}>
                    Developed & Designed by Mahit Mehta
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
    headerContainer: {
        width: width,
        padding: 25,
        paddingTop: 15,
        paddingBottom: 5,
    },
    header: {
        fontWeight: '700',
        fontSize: 30,
    },
    scrollview: {
        display: 'flex',
        alignItems: 'center',
        minHeight: height - 150,
    },
    captionContainer: {
        width: width,
        padding: 25,
    },
    developer: {
        marginTop: 'auto',
    }
});

export default ContactScreen;