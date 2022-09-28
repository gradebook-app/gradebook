import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import ApplePay from "react-native-apple-payment";
import config from "../../../config";
import ApplePayButton from "../../components/ApplePayButton";
import BannerAd from "../../components/BannerAd";
import InputField from "../../components/InputField";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";
import { useTheme } from "../../hooks/useTheme";

const { width, height } = Dimensions.get("window");

interface IDonateOption {
    value: number; 
    onPress: (value:number) => void;
    selectedValue: number | null;
    style?: ViewStyle;
}

const DonateOption : React.FC<IDonateOption> = ({ value, onPress, selectedValue, style }) => {

    const selected = useMemo(() => selectedValue === value, [ value, selectedValue ]);

    const handlePress = useCallback(() => {
       if (!selected) onPress(value)
    }, [ value, selected ])

    const valueFormatted = useMemo(() => {
        return value.toLocaleString(undefined, { minimumFractionDigits: 2 })
    }, [ value ]);

    const { theme, palette } = useTheme();

    const { isDark } = useAppearanceTheme();

    return (
        <TouchableOpacity 
            style={[ 
                styles.donateOption, 
                { 
                    backgroundColor: theme.secondary,
                    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.075)",
                },
                selected && {
                    borderColor: palette.blue,
                },
                style
            ]} 
            onPress={handlePress}
        >
            <Text style={[
                { color: theme.grey },
                selected && {
                    color: theme.text
                }
            ]}>
                ${valueFormatted}
            </Text>
        </TouchableOpacity>
    )
}

type DonateScreenProps = {
    navigation: any,
}

const DonateScreen : React.FC<DonateScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();

    const [ customDonateValue, setCustomDonateValue ] = useState<string | undefined>(undefined);

    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const [ donateValue, setDonateValue ] = useState<number | null>(null);

    const handleDonate = useCallback(async () => {
        const amount = formatCustomDonateValue()

        if (!amount) return; 

        const payment = new ApplePay({
            merchantIdentifier: config.applePay.merchantId,
            countryCode: "US",
            currencyCode: "USD",
            supportedNetworks: [ "AmEx", "MasterCard", "Visa" ]
        }, {
            total: {
                amount,
                label: "Contribution to Genesus"
            }
        });

        const canMakePayment = await payment.canMakePayments()
        if (!canMakePayment) return;

        const _paymentResponse = await payment.initApplePay()
    }, [ customDonateValue ]);

    const handleUpdateDonateValue = (value:number) => {
        setDonateValue(value);

        const formattedValue = value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });; 
        setCustomDonateValue(`$${formattedValue}`);
    };

    const formatCustomDonateValue = useCallback(() => {
        const formattedValue = customDonateValue?.replace(/[$,]+/g, "").trim();
        if (!formattedValue) { 
            setDonateValue(null);
            setCustomDonateValue(""); 
            return null; 
        }

        const parsedValue = parseFloat(formattedValue!).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (isNaN(parseFloat(parsedValue))) { 
            setDonateValue(null);
            setCustomDonateValue(""); 
            return null; 
        } 
        else setDonateValue(parseFloat(parsedValue.replace(/[$,]+/g, "").trim()));
        setCustomDonateValue(`$${parsedValue}`);

        return parseFloat(parsedValue.replace(/[$,]+/g, "").trim())
    }, [ customDonateValue ]);

    const handleChangeText = (text:string) => {
        setCustomDonateValue(text);
    }; 

    const { isDark } = useAppearanceTheme();

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Contribute to Genesus</Text>
                </View>
                <InputField 
                    onEndEditing={() => { formatCustomDonateValue() }}
                    onChangeText={handleChangeText}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder="Enter an Amount to Contribute"
                    style={[
                        styles.customDonationField,
                        {
                            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.075)",
                        }
                    ]}
                    value={customDonateValue}
                />
                <View style={styles.donationOptions}>
                    <DonateOption
                        onPress={handleUpdateDonateValue}
                        value={1}
                        selectedValue={donateValue}
                    />
                    <DonateOption
                        onPress={handleUpdateDonateValue}
                        value={3}
                        selectedValue={donateValue}
                    />
                    <DonateOption
                        onPress={handleUpdateDonateValue}
                        value={5}
                        selectedValue={donateValue}
                        style={{
                            marginRight: 0
                        }}
                    />
                </View>
                <ApplePayButton 
                    onPress={handleDonate}
                    cornerRadius={13.5}
                    buttonType={isDark ? "light" : "dark"}
                    style={{ 
                        height: 45, 
                        width: width * 0.9,
                        marginTop: 35
                    }} 
                />
                <View style={styles.captionContainer}>
                    <Text style={[{ color: theme.grey }]}>
                        Recently our server hosting providers stated they are shutting down their free tier, forcing Genesus to migrate to alternative solutions or pay expensive fees to the current provider. In order to save Genesus and continue to operate its servers, it is mandatory to raise the goal before November 28th, 2022 (Which is the last date for using the current free solution).
                    </Text>
                    <Text style={[{ color: theme.grey, marginTop: 15 }]}>
                        Even if only 1/3 of the active Genesus users donate 1 dollar, it will be enough to run Genesus for another year.
                    </Text>
                </View>
                <BannerAd />
            </ScrollView>
        </SafeAreaView>
    );
};

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
        fontWeight: "700",
        fontSize: 30,
    },
    scrollview: {
        display: "flex",
        alignItems: "center",
        minHeight: height - 150,
    },
    captionContainer: {
        width: width,
        padding: 25,
    },
    customDonationField: {
        height: 45,
        borderRadius: 15,
        borderWidth: 2,
        marginTop: 25
    },
    donationOptions: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        width: width * 0.9,
        maxWidth: 500,
        position: "relative"
    },
    donateOption: {
        height: 45,
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 5,
        borderRadius: 15,
        borderWidth: 2,
        marginRight: 10,
        zIndex: 1,
        shadowColor: Platform.OS === "ios" ? "#000" : "rgba(0, 0, 0, 0.35)",
        shadowRadius: Platform.OS === "ios" ? 5 : 15,
        shadowOpacity: Platform.OS === "ios" ? 0.075 : 0.15,
        shadowOffset: { width: 0, height: 0 },
        elevation: 7.5
    },
});

export default DonateScreen;