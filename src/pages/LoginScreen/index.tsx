import React, { useCallback, useEffect, useState } from 'react';
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet, 
    View, Image, KeyboardAvoidingView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BrandButton from '../../components/BrandButton';
import LoadingBox from '../../components/LoadingBox';
import InputField from '../../InputField';
import { setLoginClient } from '../../store/actions/auth.actions';
import { IRootReducer } from '../../store/reducers';
import { getAccessToken, isLoading } from '../../store/selectors';

const EducationPNG = require('../../../assets/education.png');

const { width, height } = Dimensions.get('window');

interface IFormValues {
    userId: string,
    pass: string
    passError: boolean,
    userIdError: boolean,
}

type LoginScreenProps = {
    navigation: any,
}

const LoginScreen : React.FC<LoginScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch();

    const state = useSelector((state:IRootReducer) => state);
    const loading = isLoading(state);
    const isAccessToken = !!getAccessToken(state);

    const [ values, setValues ] = useState<IFormValues>({
        userId: "",
        pass: "",
        passError: false,
        userIdError: false
    });

    const handleLogin = (useCallback(() => {
        if (!values.pass) {
            handleValueChange("passError")(true);
            return; 
        } else if (!values.userId) {
            handleValueChange("userIdError")(true);
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

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: "#fff" }]}>
            <LoadingBox loading={loading}/>
            <KeyboardAvoidingView behavior={'padding'}>
                <View>
                    <Image style={styles.image} source={EducationPNG} />
                </View>
                <View style={styles.form}>
                    <InputField 
                        value={values.userId}
                        returnKeyType={'done'}
                        keyboardType="numeric"
                        autoCompleteType={'off'}
                        onChangeText={handleValueChange('userId')}
                        placeholder="Student ID"
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
                        title="View Grades 😆"
                        color="#fff"
                        style={styles.button}
                        onPress={handleLogin}
                    />
                </View>
            </KeyboardAvoidingView>
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
    }
}); 

export default LoginScreen;