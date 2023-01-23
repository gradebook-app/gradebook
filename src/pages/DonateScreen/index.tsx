import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Dimensions, Image, LayoutAnimation, Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { getProducts, useIAP, withIAPContext } from "react-native-iap";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../config";
import BannerAd from "../../components/BannerAd";
import FadeIn from "../../components/FadeIn";
import InputField from "../../components/InputField";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";
import { useTheme } from "../../hooks/useTheme";
import { setDonateProducts } from "../../store/actions";
import { IRootReducer } from "../../store/reducers";
import { getDonateProducts } from "../../store/selectors";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");

interface IDonateOption {
    value: string; 
    onPress: (value:string) => void;
    selectedValue: string | null;
    style?: ViewStyle;
}

const DonateOption : React.FC<IDonateOption> = ({ value, onPress, selectedValue, style }) => {

    const selected = useMemo(() => selectedValue === value, [ value, selectedValue ]);

    const handlePress = useCallback(() => {
       if (!selected) onPress(value)
    }, [ value, selected ])

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
                { value }
            </Text>
        </TouchableOpacity>
    )
}

type DonateScreenProps = {
    navigation: any,
}

const DonateScreen : React.FC<DonateScreenProps> = ({ navigation }) => {
    useEffect(() => {
        navigation?.setOptions({ headerStyle: { 
            backgroundColor: theme.background,
        }});
    }, []);

    const { theme, palette } = useTheme();

    const state = useSelector((state:IRootReducer) => state);
    const donateProducts = getDonateProducts(state);
    const dispatch = useDispatch();

    const [ donateValue, setDonateValue ] = useState<string | null>(null);
    const [ isSuccess, setIsSuccess ] = useState<boolean>(false);
    const [ fetchingProducts, setFetchingProducts ] = useState<boolean>(false);

    const resetConfirmation = useCallback(() => {
        LayoutAnimation.easeInEaseOut();
        setIsSuccess(false)
    }, []);

    const { 
        connected,
        currentPurchase,
        finishTransaction,
        requestPurchase
    } = useIAP();

    const handleDonate = useCallback(async () => {
        resetConfirmation();

        if (!connected || !donateValue) return;

        const productId = donateProducts.find(product => product.localizedPrice === donateValue)?.productId;

        if (!productId) return; 

        const response = await requestPurchase({ sku: productId })
            .catch(e => console.log('Failed Donation: ', e));

        if (!response) {
            return; // handle failure
        }

        LayoutAnimation.easeInEaseOut();
        setIsSuccess(true);
        setDonateValue(null);
    }, [ donateProducts, donateValue, connected ]);

    const handleGetProducts = useCallback(async () => {
        if (!!donateProducts.length) return; 

        setFetchingProducts(true);
        const products = await getProducts({ skus: config.iap.skus })
            .catch(() => null)

        setFetchingProducts(false);

        if (products && products.length) {
          dispatch(setDonateProducts(products));
        }
 
    }, [ donateProducts ]);

    const handleForceGetProducts = useCallback(async () => {    
        setFetchingProducts(true);

        const products = await getProducts({ skus: config.iap.skus })
            .catch(() => null)

        if (products && products.length) {
            dispatch(setDonateProducts(products));
        }

        setFetchingProducts(false);
    }, []);

    const handleCheckCurrentPurchase = useCallback(async () => {    
        if (!currentPurchase) return; 
        const receipt = currentPurchase.transactionReceipt; 
        if (!receipt) return;

        try {
            await finishTransaction({ purchase: currentPurchase, isConsumable: true });
        } catch (ackErr) {
            console.log("Failed to Acknowledge: ", ackErr)
        }
    }, [ currentPurchase, finishTransaction ]);

    useEffect(() => { handleCheckCurrentPurchase() }, [ handleCheckCurrentPurchase ]);
    useEffect(() => { handleGetProducts() }, [ handleGetProducts ]);
    
    const { isDark } = useAppearanceTheme();

    const handleUpdateDonateValue = (value:string) => {
        resetConfirmation();
        setDonateValue(value);
    }; 

    const sortedProducts = useMemo(() => {
        for (const prod of donateProducts) {
            if (isNaN(parseFloat(prod.price))) return donateProducts;
            else continue; 
        }
        return donateProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }, [ donateProducts ]);

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={fetchingProducts}
                        onRefresh={handleForceGetProducts}
                    />
                }
                contentContainerStyle={styles.scrollview}>
                <View style={styles.headerContainer}>
                    <Text style={[ styles.header, { color: theme.text }]}>Contribute to Genesus</Text>
                </View>
                {
                    isSuccess && (
                        <View style={[ styles.confirmationContainer ]}>
                            <Text style={[ styles.successfulText, { color: palette.blue }]} >Payment Successful 🚀</Text>
                            <Text style={[ styles.gratitudeText, { color: theme.grey } ]}>Thank You for Your Contribution!</Text>
                            <TouchableOpacity onPress={resetConfirmation} style={{ marginTop: 10 }}>
                                <FontAwesomeIcon color={"#fff"} icon={faXmark} size={20} />
                            </TouchableOpacity>
                        </View>
                    )
                }
                <InputField 
                    editable={false}
                    placeholder="Choose an Option to Contribute"
                    style={[
                        styles.customDonationField,
                        {
                            borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.075)",
                        }
                    ]}
                    value={donateValue || ""}
                />
                <View style={styles.donationOptionsWrapper}>
                    <FadeIn show={!!sortedProducts.length} style={styles.donationOptions}>
                        <>
                        {
                            sortedProducts.map((product, index) => (
                                <DonateOption 
                                    key={product.productId}
                                    onPress={handleUpdateDonateValue}
                                    value={product.localizedPrice}
                                    selectedValue={donateValue}
                                    style={index === donateProducts.length - 1 ? { 
                                        marginRight: 0
                                    } : undefined}
                                />
                            ))
                        }
                        </>
                    </FadeIn>
                    {
                        (!sortedProducts.length && !fetchingProducts) && (
                            <FadeIn show={true} delay={250}>
                                <View style={styles.donateErrorMSG}>
                                    <Text style={[{ color: theme.grey, textAlign: "center" }]}>
                                        No Donation Options Available Currently.
                                    </Text>
                                </View>
                            </FadeIn>
                        )
                    }
                    {
                        (fetchingProducts && !sortedProducts.length) && (
                            <FadeIn show={true} delay={250}>
                                <ActivityIndicator animating style={{ marginTop: 5 }} />
                            </FadeIn>
                        )
                    }
                </View>
                <TouchableOpacity 
                    disabled={!donateValue}
                    onPress={handleDonate}
                    style={[ 
                        styles.donateButton,
                        {
                            backgroundColor: isDark ? "#fff" : "#000",
                            opacity: !donateValue  ? (isDark ? 0.5 : 0.2) : 1
                        }
                    ]}>
                    <Text 
                        style={[ styles.donateButtonText, { color: !isDark ? "#fff" : "#000" }]}
                        >Contribute to
                    </Text>
                    <Image 
                        style={{ width: 30, height: 30, borderRadius: 8, marginLeft: 5 }}
                        source={require("../../../assets/gradebook-1024.png")}
                    />
                </TouchableOpacity>
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
    donateErrorMSG: {
        width: "100%",
        padding: 10
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
    donationOptionsWrapper: {
        width: width * 0.9,
        minHeight: 55,
        maxWidth: 500,
    },
    donationOptions: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        width: "100%",
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
    donateButton: {
        width: width * 0.9,
        height: 45,
        borderRadius: 15,
        marginTop: 15,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row"
    },
    donateButtonText: {
        fontWeight: "500",
        fontSize: 20
    },
    confirmationContainer:{
        height: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    successfulText: {
        fontWeight: "500",
        fontSize: 20,
        textAlign: "center",
        marginLeft: 15
    },
    gratitudeText: {
        textAlign: "center",
        marginTop: 5
    }
});

export default withIAPContext(DonateScreen);