import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { Dimensions, Linking, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Box from "../../components/Box";

const { width, height } = Dimensions.get('window');

type PrivacyPolicyScreenProps = {
    navigation: any,
}

const PrivacyPolicyScreen : React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
    const { theme } : any = useTheme();

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }})
    }, []);

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.headerContainer}>
                <Text style={[ styles.header, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <Box.Space />
                <View style={styles.policyContainer}>
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        Introduction
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        Thank you for choosing to be part of our Community at Genesus 
                        ("Company", "we", "us", or "our"). We are committed to protecting 
                        your personal information and your right to privacy. If you have any questions
                        or concerns please contact us at genesus@mahitm.com.
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        This privacy notice describes how we might use your information if you
                        download or use our mobile application -- Genesus.
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        In this privacy notice if we refer to "App" we are refering to any application
                        of ours that references or links to this policy, including any listed above. 
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        The purpose of this privacy notice is to explain to you in the clearest way 
                        possible what information we collect, how we use it, and what rights you have in relatiom to it.
                    </Text>
                    <Box.Space />
                    <Box.Space />
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        What Information do we Collect?
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.section, { color: theme.grey }]}>
                        1. Personal Information You Disclose
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        In Short: We collect and store everything you provide.
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        We collect personal information that you voluntarily provide to us when you login on 
                        the App and when you participate in activities on the App or otherwise when you contact us.
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        We collect personal information such as your email addresses and passwords provided by you.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.section, { color: theme.grey }]}>
                        2. Information Automatically Collected
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        In Short: Some information -- such as your grades, assignments, GPA, and Genesis account details may be 
                        automatically collected.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.section, { color: theme.grey }]}>
                        3. Information Collected Through the App
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                       In Short: We collect information regarding your mobile device and push notifications, when you use our App.
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        Push Notifications: We may request to send you push notifications regarding your account or certain features of the App.
                        If you wish to opt-out from receiving these types of communications, you may turn them off in your device's settings.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.section, { color: theme.grey }]}>
                        4. Information Collected from other Sources
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                       In Short: We collect information from Genesis Parent Portal.
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        We collect current grades, assignments, GPA, and other account data 
                        from your Genesis Parent Portal.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        How do we use your Information?
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                       We use your information to send notifications, show realtime grades, assignments, GPA, and account details.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        Will your information be shared with anyone?
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights,
                        or to fulfill business obligations.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        How long do we keep your information?
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        We keep your information for as long as necessary to fulfill the purposes outlined in this privacy
                        notice unless otherwise required by laws.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        How do we keep your information safe?
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                       We aim to protect your personal information through a system of organizational and techical security measures.
                       We have implemented appropriate techical and organizational security measures designed to protect the security 
                       of any personal information we process. However, despite our safeguards and efforts to secure your information,
                       no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot
                       promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly 
                       collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to 
                       and from our App is at your own risk. You should only access the App within a secure environment.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        Do we make updates to this Notice?
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                       Yes, we will update this notice as neccessary to stay compliant with relevant laws.
                       As such, we encourage you to review this privacy notice frequently to be informed of how we
                       are protecting your information.
                    </Text>
                    <Box.Space />
                    <Text style={[ styles.subHeader, { color: theme.text }]}>
                        How can you review, update, or delete the data we collect from you?
                    </Text>
                    <Box.Space />
                    <Text style={[{ color: theme.grey }]}>
                        Based on the applicable law of your country, you may have the right to request access to 
                        your personal information we collect from you, change that information, or delete it in some
                        circumstances. To request to review, update, or delete your personal information, please submit 
                        a request form by contacting us at genesus@mahitm.com.
                    </Text>
                </View>
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
        paddingBottom: 115,
        alignItems: 'center',
    },
    policyContainer: {
        width: width,
        padding: 25,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: '700',
    },
    section: {
        fontSize: 17.5,
        fontWeight: '600',
    }
});

export default PrivacyPolicyScreen;