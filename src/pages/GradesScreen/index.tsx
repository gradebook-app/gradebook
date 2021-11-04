import React, { useCallback, useEffect, useRef, useState } from "react";
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet,
    ScrollView,
    View,
    RefreshControl,
    Text,
    Button
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { useGrades } from "../../hooks/useGrades";
import { ICourse } from "../../store/interfaces/course.interface";
import { IRootReducer } from "../../store/reducers";
import { getAccessToken } from "../../store/selectors";
import CourseBox from "./components/CourseBox";
import BottomSheet from "reanimated-bottom-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Blocker from "../../components/Blocker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "react-native-paper";
import GPASlideshow from "./components/GPASlideshow";
import { useGPA } from "../../hooks/useGPA";
import * as Notifications from "expo-notifications";

const { width, height } = Dimensions.get('window');

type GradesScreenProps = {
    navigation: any,
}

interface INavigationParams {
    params: { 
        cachedMarkingPeriod?: string | null 
    }
}

const GradesScreen : React.FC<GradesScreenProps> = ({ navigation }) => {
    const { params: { cachedMarkingPeriod = null  } = {} as any} : INavigationParams = 
        navigation?.getState()?.routes?.find((route:any) => (route.name == "loading"));

    const [selectedValue, setSelectedValue] = useState(cachedMarkingPeriod ?? "");
    const [ adjustedMarkingPeriod, setAdjustedMarkingPeriod ] = useState(cachedMarkingPeriod ?? "");

    const { courses, markingPeriods, currentMarkingPeriod, loading, reload } = useGrades({
        markingPeriod: adjustedMarkingPeriod
    });

    const { reload:reloadGPA, loading:loadingGPA, gpa } = useGPA();
    const notificationListener = useRef<any | null>(null);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            reload()
            reloadGPA();
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
        }
    });
    
    const state = useSelector((state:IRootReducer) => state);
    const isAccessToken = !!getAccessToken(state);

    const handleCourse = (course:ICourse) => {
        navigation.setParams({ course, markingPeriod: currentMarkingPeriod });
        navigation.navigate('assignments');
    };

    const setMarkingPeriod = useCallback(() => {
        AsyncStorage.setItem("@markingPeriod", currentMarkingPeriod);
    }, [ currentMarkingPeriod ]);

    useEffect(setMarkingPeriod, [ setMarkingPeriod ]);

    const selectionSheet = React.useRef<null | any>(null);

    const handleAuth = useCallback(() => {
        reload();
        reloadGPA();
    }, [ isAccessToken ]);

    useEffect(handleAuth, [ handleAuth ]);

    const onRefresh = () => {
        reload();
        reloadGPA();
    };

    const { theme } : any = useTheme();

    const renderMPSelector = () => {
        return (
            <View style={[ styles.selectContainer, { backgroundColor: theme.background } ]}>
                <Text style={[ styles.markingPeriod, { color: theme.text } ]}>Select Marking Period</Text>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                >
                    { markingPeriods.map((mp, index) => (
                        <Picker.Item color={theme.text} label={mp} value={mp} key={index} />
                    ))}
                </Picker>
            </View>
        )
    }

    const [ showSelector, setShowSelector ] = useState(false);

    const handleSelectorBack = () => {
        setShowSelector(false);
        selectionSheet.current.snapTo(1);

        setAdjustedMarkingPeriod(selectedValue);
    }

    const handleSelectionMenuPress = () => {
        setShowSelector(true);
        selectionSheet.current.snapTo(0);
    }

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView 
                contentContainerStyle={styles.courses}
                refreshControl={
                    <RefreshControl
                    refreshing={loading || loadingGPA}
                    onRefresh={onRefresh}
                    />
                }>
               <TouchableWithoutFeedback onPress={handleSelectionMenuPress}>
                   <Button title={selectedValue} onPress={handleSelectionMenuPress} />
                </TouchableWithoutFeedback>
                <GPASlideshow gpa={gpa} />
                { courses.map((course, index) => {
                    return (
                        <CourseBox 
                            course={course} 
                            key={index} 
                            handleCourse={handleCourse}
                        />
                    )
                })}
            </ScrollView>
            <Blocker block={showSelector} onPress={handleSelectorBack} />
            <BottomSheet 
                ref={selectionSheet}
                initialSnap={1}
                snapPoints={[350, 0]} 
                borderRadius={25}
                renderContent={renderMPSelector}
                onCloseEnd={handleSelectorBack}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    markingPeriod: {
        fontWeight: '500',
        fontSize: 25,
        marginTop: 25,
        marginLeft: 25,
    },
    container: {
        width: width,
        height: height,
        backgroundColor: "#fff",
    },
    courses: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 100,
    },
    selectContainer: {
        height: 350,
        width: width,
        backgroundColor: "#fff",
    }
})
export default React.memo(GradesScreen); 