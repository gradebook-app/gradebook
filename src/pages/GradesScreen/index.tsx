import React, { useCallback, useEffect, useRef, useState } from "react";
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet,
    ScrollView,
    View,
    RefreshControl,
    Text,
    Button,
    Platform
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
import { useTheme } from "../../hooks/useTheme";
import GPASlideshow from "./components/GPASlideshow";
import { useGPA } from "../../hooks/useGPA";
import { usePastGPA } from "../../hooks/usePastGPA";
import messaging from "@react-native-firebase/messaging";
import BannerAd from "../../components/BannerAd";
import { useDynamicColor } from "../../hooks/useDynamicColor";
import NoCoursesSVG from "../../SVG/NoCoursesSVG";
import FadeIn from "../../components/FadeIn";

const { width, height } = Dimensions.get("window");

const sheetHeight = (() => {
    const minHeight = 350; 
    const dynamicHeight = height * 0.45; 
    return dynamicHeight < minHeight ? minHeight : dynamicHeight; 
})();

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
    const { pastGPA } = usePastGPA();


    useEffect(() => {
        const unsubscribe = messaging().onMessage(_ => {
            reload();
            reloadGPA();
        });

        return unsubscribe;
    }, []);
    
    const state = useSelector((state:IRootReducer) => state);
    const accessToken = getAccessToken(state);
    const isAccessToken = !!accessToken;

    const handleCourse = (course:ICourse) => {
        navigation.setParams({ course, markingPeriod: currentMarkingPeriod });
        navigation.navigate("assignments");
    };

    const setMarkingPeriod = useCallback(() => {
        AsyncStorage.setItem("@markingPeriod", currentMarkingPeriod);
        setSelectedValue(currentMarkingPeriod);
    }, [ currentMarkingPeriod ]);

    useEffect(setMarkingPeriod, [ setMarkingPeriod ]);

    const selectionSheet = React.useRef<null | any>(null);

    const handleAuth = useCallback(() => {
        if (!accessToken) return; 
        reload();
        reloadGPA();
    }, [ isAccessToken ]);

    useEffect(handleAuth, [ handleAuth ]);

    const onRefresh = () => {
        reload();
        reloadGPA();
    };

    const { theme, palette }  = useTheme();

    const handleGPAScreen = () => {
        navigation.navigate("gpa");
    };

    const renderMPSelector = () => {
        return (
            <View style={[ styles.selectContainer, { backgroundColor: theme.background } ]}>
                <View style={{ 
                    flexDirection: "row", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    display: "flex",
                    padding: 20,
                }}>
                    <Text style={[ styles.markingPeriod, { color: theme.text } ]}>Select Marking Period</Text>
                    <Button title="Done" onPress={handleSelectorBack} />
                </View>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                >
                    { markingPeriods.map((mp, index) => (
                        <Picker.Item color={theme.text} label={mp} value={mp} key={index} />
                    ))}
                </Picker>
            </View>
        );
    };

    const [ showSelector, setShowSelector ] = useState(false);

    const handleSelectorBack = () => {
        setShowSelector(false);
        selectionSheet.current.snapTo(1);

        setAdjustedMarkingPeriod(selectedValue);
    };

    const handleSelectionMenuPress = () => {
        setShowSelector(true);
        selectionSheet.current.snapTo(0);
    };

    //{/*  <IOSButton style={{ marginTop: 10 }}>{ selectedValue }</IOSButton> */} 

    const [ mpPickerOpen, setMPPickerOpen ] = useState(false);

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
               {
                   Platform.OS === "ios" ? (
                        <TouchableWithoutFeedback onPress={handleSelectionMenuPress}>
                            <Button title={selectedValue} onPress={handleSelectionMenuPress} />
                        </TouchableWithoutFeedback>
                   ) : (
                        <Picker
                            selectedValue={selectedValue}
                            mode="dropdown"
                            dropdownIconColor={useDynamicColor({ dark: theme.grey, light: "grey" })}
                            onFocus={() => { setMPPickerOpen(true) }}
                            onBlur={() => { setMPPickerOpen(false); }}
                            style={[styles.androidMPPicker,{backgroundColor: theme.secondary}]}
                            prompt="Marking Period"
                            onValueChange={(itemValue) => {
                                setMPPickerOpen(false);
                                setSelectedValue(itemValue);
                                setAdjustedMarkingPeriod(itemValue);
                            }}
                        >
                            { markingPeriods.map((mp, index) => (
                                <Picker.Item color={mpPickerOpen ? 'rgba(0, 0, 0, 0.75)' : palette.blue } label={mp} value={mp} key={index} />
                            ))}
                        </Picker>
                   )
               }
                <GPASlideshow handleGPAScreen={handleGPAScreen} pastGPA={pastGPA} gpa={gpa} />
                { courses.map((course, index) => {
                    return (
                        <CourseBox 
                            course={course} 
                            key={index} 
                            handleCourse={handleCourse}
                        />
                    );
                })}
                {
                    !courses.length && !loading && (
                        <FadeIn 
                        show={true}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 15,
                        }}>
                           <>
                                <NoCoursesSVG width={width * 0.65} />
                                <Text
                                    style={{ color: theme.grey, marginVertical: 15 }}
                                >
                                    No Courses Available.
                                </Text>
                            </>
                        </FadeIn>
                    )
                }
                { courses.length && loading ? <BannerAd style={{ marginTop: 15 }} /> : <></> }
            </ScrollView>
            <Blocker block={showSelector} onPress={handleSelectorBack} />
            <BottomSheet 
                ref={selectionSheet}
                initialSnap={1}
                snapPoints={[sheetHeight, 0]} 
                borderRadius={25}
                renderContent={renderMPSelector}
                onCloseEnd={handleSelectorBack}
            />
           
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    markingPeriod: {
        fontWeight: "500",
        fontSize: 25,
    },
    container: {
        width: width,
        height: height,
        backgroundColor: "#fff",
        marginTop: Platform.OS === "android" ? 25 : 0, 
    },
    courses: {
        display: "flex",
        alignItems: "center",
        paddingBottom: 100,
    },
    selectContainer: {
        height: sheetHeight,
        width: width,
        backgroundColor: "#fff",
    },
    androidMPPicker: {
        width: width * 0.9,
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowOpacity: 0.35,
        shadowRadius: 5,
        zIndex: 1,
        shadowOffset: { width: 0, height: 0 },
        marginTop: 15,
        elevation: 15,
    },
});
export default React.memo(GradesScreen); 