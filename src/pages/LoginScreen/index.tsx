import { faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useTheme } from 'react-native-paper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet, 
    Button,
    View, Text, KeyboardAvoidingView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BrandButton from '../../components/BrandButton';
import LoadingBox from '../../components/LoadingBox';
import InputField from '../../InputField';
import { setLoginClient } from '../../store/actions/auth.actions';
import { IRootReducer } from '../../store/reducers';
import { getAccessToken, isAccessDenied, isLoading } from '../../store/selectors';
import BottomSheet from "reanimated-bottom-sheet";

import EducationSVG from "../../SVG/EducationSVG";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { schoolDistrictsMapped } from '../../utils/mapping';
import { ESchoolDistricts } from '../../store/enums/school-districts.enum';
import Blocker from '../../components/Blocker';


const { width, height } = Dimensions.get('window');

interface IFormValues {
    userId: string,
    pass: string
    passError: boolean,
    userIdError: boolean,
    schoolDistrict?: string,
}

type LoginScreenProps = {
    navigation: any,
}

const LoginScreen : React.FC<LoginScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();

    const state = useSelector((state:IRootReducer) => state);
    const loading = isLoading(state);
    const isAccessToken = !!getAccessToken(state);

    const { theme } : any = useTheme();

    const [ values, setValues ] = useState<IFormValues>({
        userId: "",
        pass: "",
        passError: false,
        userIdError: false,
    });

    const handleLogin = (useCallback(() => {
        if (!values.pass) {
            handleValueChange("passError")(true);
            return; 
        } else if (!values.userId) {
            handleValueChange("userIdError")(true);
            return; 
        } else if (!values.schoolDistrict) {
            return; 
        }

        dispatch(setLoginClient(values));
    }, [ values ]))
    
    const handleNavigate = useCallback(() => {
        if (isAccessToken) {
            navigation.navigate('navigator');
        }
    }, [ isAccessToken ]);

    useEffect(handleNavigate, [ handleNavigate ]);

    const handleValueChange = (type:keyof IFormValues) => (text:any) => {
        setValues({ ...values, [ type ]: text });
    };

    const [ sheetOpen, setSheetOpen ] = useState(false);
    const schoolDistrictSheet = useRef<any | null>(null);

    const handleSchoolDistrictOpen = () => {
        setSheetOpen(true);
        schoolDistrictSheet.current.snapTo(0);
    };

    const handleSchoolDistrictClose = () => {
        setSheetOpen(false);
        schoolDistrictSheet.current.snapTo(1);
    }

    const renderSchoolDistrictSheet = () => {
        return (
            <View style={[styles.schoolDistrictSheet, { backgroundColor: theme.background }]}>
                <View style={{ 
                    flexDirection: "row", 
                    justifyContent: "space-between",
                    alignItems: 'center',
                    display: 'flex',
                }}>
                    <Text style={[ styles.schoolDistrictHeader, { color: theme.text }]}>Select School District</Text>
                    <Button title="Done" onPress={handleSchoolDistrictClose} />
                </View>
                <Picker 
                    onValueChange={(itemValue) => handleValueChange('schoolDistrict')(itemValue)}
                    selectedValue={values.schoolDistrict}
                >
                    <Picker.Item 
                        color={theme.text}
                        label={"Choose School District"} 
                        value={undefined} 
                    />
                    { Object.keys(schoolDistrictsMapped).map((schoolDistrict) => {
                        return (
                            <Picker.Item 
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

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <LoadingBox loading={loading}/>
            <Blocker onPress={handleSchoolDistrictClose} block={sheetOpen}/>
            <KeyboardAvoidingView behavior={'padding'}>
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
                        returnKeyType={'done'}
                        autoCompleteType={'off'}
                        onChangeText={handleValueChange('userId')}
                        placeholder="Email"
                    /> 
                    <InputField 
                        value={values.pass}
                        returnKeyLabel={'Login'}
                        returnKeyType={'done'}
                        placeholder="Password"
                        onChangeText={handleValueChange('pass')}
                        secureTextEntry={true}
                    /> 
                    <BrandButton 
                        title="View Grades"
                        color="#fff"
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <FontAwesomeIcon color={"#fff"} icon={faBinoculars} />
                    </BrandButton>
                </View>
            </KeyboardAvoidingView>
            <BottomSheet
                ref={schoolDistrictSheet}
                initialSnap={1}
                snapPoints={[500, 0]}
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
        display: 'flex',
        alignItems: 'center',
    },
    schoolDistrictSheet: {
        width: width,
        height: 500,
        padding: 15,
    },
    schoolDistrictHeader: {
        fontWeight: '600',
        fontSize: 25,
    }
}); 

export default LoginScreen;