import { faCheckSquare, faCog } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { Dimensions, Linking, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Box from "../../components/Box";
import { IRootReducer } from '../../store/reducers';
import { getUser } from '../../store/selectors';

const { width, height } = Dimensions.get('window');

type NotificationScreenProps = {
    navigation: any,
}

const NotificationScreen : React.FC<NotificationScreenProps> = ({ navigation }) => {
    const { theme } : any = useTheme();

    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);
    const isActive = !!user?.notificationToken;

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }})
    });

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Notifications</Text>
                </View>
                <Box.Space />
                <Box>
                    <Box.Clickable onPress={() => Linking.openSettings()} >
                        <Box.Content 
                            icon={faCog}
                            iconColor={"#DD4503"}
                            title="Configure Notifications"
                        >
                            <Box.Arrow onPress={() => Linking.openSettings()} />
                        </Box.Content>
                    </Box.Clickable>
                </Box>
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>
                        For changed settings to take affect make sure to reload the app once changed. 
                    </Text>
                </View>
                <Box>
                    <Box.Content 
                        icon={faCheckSquare}
                        iconColor={"#FFBA4A"}
                        title="Notification Status"
                    >
                        <Box.Value value={isActive ? "Enabled" : "Disabled"} />
                    </Box.Content>
                </Box>
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
    },
    captionContainer: {
        width: width,
        padding: 25,
    },
});

export default NotificationScreen;