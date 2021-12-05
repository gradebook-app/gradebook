import { faBinoculars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { useTheme } from "../../hooks/useTheme"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet, 
    Button,
    View, Text, KeyboardAvoidingView, TouchableOpacity, ScrollView
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import BrandButton from "../../components/BrandButton"
import LoadingBox from "../../components/LoadingBox"
import InputField from "../../components/InputField"
import { setLoginClient } from "../../store/actions/auth.actions"
import { IRootReducer } from "../../store/reducers"
import { getAccessToken, isAccessDenied, isLoading } from "../../store/selectors"
import BottomSheet from "reanimated-bottom-sheet"
import PasswordField from "../../components/PasswordField"

import EducationSVG from "../../SVG/EducationSVG"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { Picker } from "@react-native-picker/picker"
import { schoolDistrictsMapped } from "../../utils/mapping"
import { ESchoolDistricts } from "../../store/enums/school-districts.enum"
import Blocker from "../../components/Blocker"
import messaging from "@react-native-firebase/messaging"

const { width, height } = Dimensions.get("window")

const sheetHeight = (() => {
    const minHeight = 500 
    const dynamicHeight = height * 0.45 
    return dynamicHeight < minHeight ? minHeight : dynamicHeight 
})()

interface IFormValues {
    userId: string,
    pass: string
    passError: boolean,
    userIdError: boolean,
    schoolDistrict?: string,
    errorMessage: string,
}

type LoginScreenProps = {
    navigation: any,
}

const LoginScreen : React.FC<LoginScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch()

    const state = useSelector((state:IRootReducer) => state)
    const loading = isLoading(state)
    const isAccessToken = !!getAccessToken(state)
    const accessDenied = isAccessDenied(state)

    const { theme } = useTheme()

    const [ values, setValues ] = useState<IFormValues>({
        userId: "",
        pass: "",
        passError: false,
        userIdError: false,
        errorMessage: "",
    })

    const handleAccessDenied = useCallback(() => {
        if (accessDenied) {
            const message = "Password or Email is not Valid."
            handleValueChange("errorMessage")(message)
        }
    }, [ accessDenied ])


    useEffect(handleAccessDenied, [ handleAccessDenied ])

    const handleLogin = (useCallback(async () => {
        if (!values.pass) {
            handleValueChange("passError")(true)
            return 
        } else if (!values.userId) {
            handleValueChange("userIdError")(true)
            return 
        } else if (!values.schoolDistrict) {
            return 
        }
                                             
        let notificationToken = null 

        try {
            const authStatus = await messaging().hasPermission()
            const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                            authStatus === messaging.AuthorizationStatus.PROVISIONAL
            if (enabled) {
                notificationToken = await messaging().getToken()
            } else {
                try {
                    await messaging().requestPermission()
                    notificationToken = await messaging().getToken()
                } catch {}
            }
        } catch(e) {
            console.log(e)
        }

        dispatch(setLoginClient({ ...values, notificationToken: notificationToken }))
    }, [ values ]))
    
    const handleNavigate = useCallback(() => {
        if (isAccessToken) {
            navigation.navigate("navigator")
        }
    }, [ isAccessToken ])

    useEffect(handleNavigate, [ handleNavigate ])

    const handleValueChange = (type:keyof IFormValues) => (text:any) => { 
        setValues({ ...values, errorMessage: "", [ type ]: text })
    }

    const [ sheetOpen, setSheetOpen ] = useState(false)
    const [ termsSheetOpen, setTermsSheetOpen ] = useState(false)

    const schoolDistrictSheet = useRef<any | null>(null)
    const termsSheet = useRef<any | null>(null)

    const handleSchoolDistrictOpen = () => {
        setSheetOpen(true)
        schoolDistrictSheet.current.snapTo(0)
    }

    const handleSchoolDistrictClose = () => {
        setSheetOpen(false)
        schoolDistrictSheet.current.snapTo(1)
    }

    const handleTermsOpen = () => {
        setTermsSheetOpen(true)
        termsSheet.current.snapTo(0)
    }  

    const handleTermsClose = () => {
        setTermsSheetOpen(false)
        termsSheet.current.snapTo(1)
    }

    const renderSchoolDistrictSheet = () => {
        return (
            <View style={[styles.schoolDistrictSheet, { backgroundColor: theme.background }]}>
                <View style={{ 
                    flexDirection: "row", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                }}>
                    <Text style={[ styles.sheetHeader, { color: theme.text }]}>Select School District</Text>
                    <Button title="Done" onPress={handleSchoolDistrictClose} />
                </View>
                <Picker 
                    onValueChange={(itemValue) => handleValueChange("schoolDistrict")(itemValue)}
                    selectedValue={values.schoolDistrict}
                >
                    <Picker.Item 
                        color={theme.text}
                        label={"Choose School District"} 
                        value={undefined} 
                    />
                    { Object.keys(schoolDistrictsMapped).map((schoolDistrict, index) => {
                        return (
                            <Picker.Item 
                                key={index}
                                color={theme.text}
                                label={schoolDistrictsMapped[schoolDistrict as ESchoolDistricts]} 
                                value={schoolDistrict} 
                            />
                        )
                    })}
                </Picker>
            </View>
        )
    }

    const renderTermsSheet = () => {
        return (
            <View style={[ styles.termsSheet, { backgroundColor: theme.background }]}>
                <View style={{ 
                    flexDirection: "row", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                }}>
                    <Text style={[ styles.sheetHeader, { color: theme.text }]}>Terms & Conditions</Text>
                    <Button title="Accept" onPress={handleTermsClose} />
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 110 }} style={styles.termsList}>
                    <Text style={[ styles.termItem, { color: theme.grey }]}>
                        1. All data, including the client's password, is securely stored on Genesus's servers 
                        for providing clients with access to their grades. Passwords and other client data
                        are not shared or sold, Genesus respects everyone's privacy. Passwords are used to login to 
                        Genesis Parent Portal and periodically query client's current grades, assignments, and past grades. 
                        Additionally, passwords are used to query account details, grades, assignments, and past grades live every
                        time a client uses Genesus.
                    </Text>
                    <Text style={[ styles.termItem, { color: theme.grey }]}>
                        2. By entering your credentials and clicking the "View Grades" button clients are giving Genesus
                        the authority to query data from Genesis Parent Portal on behalf of the client. 
                    </Text>
                    <Text style={[ styles.termItem, { color: theme.grey }]}>
                        3. Client passwords and other data are securely encrypted on Genesus's database to maximize security.
                        Furthermore, client passwords are encrypted with AES in CBC mode with a 128-bit key for encryption; using PKCS7 padding. 
                    </Text>
                    <Text style={[ styles.termItem, { color: theme.grey }]}>
                        4. Genesus is not to be held responsible for any malicious activity regarding a client's Genesis Parent Portal account. 
                        Upon signing up, it is the client's own risk of providing their credentials to Genesus.
                    </Text>
                </ScrollView>
            </View>
        )
    }  

    const handleSheetClose = () => {
        handleSchoolDistrictClose()
        handleTermsClose()
    }

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <LoadingBox loading={loading}/>
            <Blocker onPress={handleSheetClose} block={sheetOpen || termsSheetOpen}/>
            <KeyboardAvoidingView behavior={"padding"}>
                <View style={ styles.imageContainer }>
                    {/* <Image style={styles.image} source={EducationPNG} /> */}
                    <EducationSVG width={width * 0.85}/>
                </View>
                <View style={styles.form}>
                    <TouchableWithoutFeedback onPress={handleSchoolDistrictOpen}>
                        <InputField 
                            value={schoolDistrictsMapped[values.schoolDistrict as ESchoolDistricts]}
                            editable={false}
                            placeholder={"Select School District"}
                        />
                    </TouchableWithoutFeedback>
                    <InputField 
                        value={values.userId}
                        returnKeyType={"done"}
                        autoCompleteType={"off"}
                        onChangeText={handleValueChange("userId")}
                        placeholder="Email"
                        onSubmitEditing={handleLogin}
                    /> 
                    <PasswordField 
                        value={values.pass}
                        returnKeyLabel={"Login"}
                        returnKeyType={"done"}
                        placeholder="Password"
                        onChangeText={handleValueChange("pass")}
                        onSubmitEditing={handleLogin}
                    />
                    <View style={ styles.errorContainer }>
                        <Text style={styles.errorMessage}>{ values.errorMessage }</Text>
                    </View>
                    <BrandButton 
                        title="View Grades"
                        color="#fff"
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <FontAwesomeIcon color={"#fff"} icon={faBinoculars} />
                    </BrandButton>
                    <TouchableOpacity onPress={handleTermsOpen} style={styles.conditionContainer}>
                        <Text 
                            style={[{ color: theme.grey }]}
                        >
                            I Accept the <Text style={styles.terms}>Terms & Conditions</Text> by Proceeding.
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <BottomSheet
                ref={termsSheet}
                initialSnap={1}
                snapPoints={[sheetHeight, 0]}
                borderRadius={25}
                onCloseEnd={handleTermsClose}
                renderContent={renderTermsSheet}
            />
            <BottomSheet
                ref={schoolDistrictSheet}
                initialSnap={1}
                snapPoints={[sheetHeight, 0]}
                borderRadius={25}
                onCloseEnd={handleSchoolDistrictClose}
                renderContent={renderSchoolDistrictSheet}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        marginTop: 25,
    },
    image: {
        width: width * 0.85,
        height: width * 0.85,
    },
    imageContainer: {
        width: width,
        display: "flex",
        alignItems: "center",
    },
    schoolDistrictSheet: {
        width: width,
        height: sheetHeight,
        padding: 15,
    },
    sheetHeader: {
        fontWeight: "600",
        fontSize: 25,
    },
    errorContainer: {
        width: width * 0.9,
    },
    errorMessage: {
        color: "red",

    },
    conditionContainer: {
        marginTop: 25, 
        marginBottom: 5,
    },
    terms: { 
        textDecorationLine: "underline",
    },
    termsSheet: {
        width: width,
        height: 500,
        padding: 25,
    },
    termsList: {
        marginVertical: 15,
    },
    termItem: {
        marginBottom: 15,
    }
}) 

export default LoginScreen