import React, { useCallback, useEffect, useMemo, useState } from "react";
import { 
    Dimensions, 
    SafeAreaView, 
    StyleSheet,
    RefreshControl,
    Text,
    Platform,
    View,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { useGrades } from "../../hooks/useGrades";
import { ICourse } from "../../store/interfaces/course.interface";
import { IRootReducer } from "../../store/reducers";
import { getUser } from "../../store/selectors";
import CourseBox from "./components/CourseBox";
import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../hooks/useTheme";
import { useGPA } from "../../hooks/useGPA";
import { usePastGPA } from "../../hooks/usePastGPA";
import messaging from "@react-native-firebase/messaging";
import { useDynamicColor } from "../../hooks/useDynamicColor";
import NoCoursesSVG from "../../SVG/NoCoursesSVG";
import FadeIn from "../../components/FadeIn";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";
import BottomSheetBackdrop from "../../components/BottomSheetBackdrop";
import MPSelector from "./components/MPSelector";
import { Picker } from "@react-native-picker/picker";
import { revalidateClient } from "../../utils/api";
import { useAccounts } from "../../hooks/useAccounts";
import AccountSelector from "./components/AccountSelector";
import { useIsFocused } from "@react-navigation/native";
import CourseHeader from "./components/CourseHeader";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../AppNavigator";
import InterstitialAd from "../../components/InterstitialAd";

const { width, height } = Dimensions.get("window");

const sheetHeight = (() => {
    const minHeight = 400; 
    const dynamicHeight = height * 0.45; 
    return dynamicHeight < minHeight ? minHeight : dynamicHeight; 
})();

type GradesScreenProps = StackScreenProps<RootStackParamList, "navigator">

const GradesScreen : React.FC<GradesScreenProps> = ({ navigation, route }) => {
    const { params: { cachedMarkingPeriod = null } = {}} = 
        navigation.getState().routes.find((route) => (route.name == "loading"));
        

    const [selectedValue, setSelectedValue] = useState(cachedMarkingPeriod ?? "");
    const [ adjustedMarkingPeriod, setAdjustedMarkingPeriod ] = useState(cachedMarkingPeriod ?? "");

    const { courses, markingPeriods, currentMarkingPeriod, loading: loadingGrades, reload } = useGrades({
        markingPeriod: adjustedMarkingPeriod
    });

    const { reload:reloadGPA, loading:loadingGPA, gpa } = useGPA();
    const { reload:reloadPastGPA , pastGPA } = usePastGPA();

    useEffect(() => {
        const unsubscribe = messaging().onMessage(() => {
            reload();
            reloadGPA();
        });

        return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const handleCourse = (course:ICourse) => {
        navigation.navigate("assignments", {
            course,
            markingPeriod: currentMarkingPeriod
        });
    };

    const setMarkingPeriod = useCallback(() => {
        AsyncStorage.setItem("@markingPeriod", currentMarkingPeriod);
        setSelectedValue(currentMarkingPeriod);
    }, [ currentMarkingPeriod ]);

    useEffect(setMarkingPeriod, [ setMarkingPeriod ]);

    const selectionSheet = React.useRef<BottomSheet | null>(null);
    const accountsSheet = React.useRef<BottomSheet | null>(null);

    const { accounts, reload:reloadAccounts } = useAccounts();

    const handleAuth = useCallback(() => {
        if (!user?._id) return; 
        reload();
        reloadGPA();
        reloadPastGPA();
        reloadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id]);

    useEffect(handleAuth, [ handleAuth ]);

    const onRefresh = () => {
        reload();
        reloadGPA();
        reloadPastGPA();
    };

    const { theme, palette }  = useTheme();

    const [ showSelector, setShowSelector ] = useState(false);
    const [ mpPickerOpen, setMPPickerOpen ] = useState(false);

    const [ showAccountSelector, setShowAccountSelector ] = useState(false);

    const [aspiredAccount, setAspiredAccount] = useState(user?.studentId);
    const [ changingToAspiredAccount, setChangingToAspiredAccount ] = useState(false);


    const handleSelectorBack = () => {
        setShowSelector(false);
        selectionSheet.current?.snapToIndex(0);
        setAdjustedMarkingPeriod(selectedValue);
    };

    const handleSelectionMenuPress = () => {
        setShowSelector(true);
        selectionSheet.current?.snapToIndex(1);
    };

    const handleAccountSelectorClose= (refresh = false) => () => {
        setShowAccountSelector(false);
        accountsSheet.current?.snapToIndex(0);
        
        if (aspiredAccount != user?.studentId && !!aspiredAccount && refresh) {
            setChangingToAspiredAccount(true);

            revalidateClient(aspiredAccount).then(() => {
                setAdjustedMarkingPeriod("");
                reloadPastGPA();
                reloadGPA();
                setChangingToAspiredAccount(false);
            }).catch(() => {
                setChangingToAspiredAccount(false);
            });
        }
    };

    const handleAccountSelectorOpen = () => {
        setShowAccountSelector(true);
        accountsSheet.current?.snapToIndex(1);
    };

  

    const { isDark } = useAppearanceTheme();

    const dropdownColor = useDynamicColor({ dark: theme.grey, light: "grey" }); 
    const loading = useMemo(() => loadingGPA || loadingGrades, [ loadingGPA, loadingGrades ]);

    const isFocused = useIsFocused();
    
    const renderCourse = ({ item:course } : { item: ICourse }) => {
        return (
            <CourseBox 
                course={course} 
                handleCourse={handleCourse}
            />
        );
    };

    const ListEmptyComponent = useCallback(() => {
        return !loadingGrades ? (
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
        ) : <></>;
    }, [loadingGrades, theme.grey]);

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            {
                Platform.OS === "ios" ? (
                    <View style={{ 
                        display: "flex", 
                        flexDirection: "row", 
                        justifyContent: "space-between",
                        width: "100%", 
                        paddingHorizontal: 20, 
                        paddingBottom: 5,
                    }}>
                        <TouchableOpacity 
                            style={[
                                styles.selectorButtonContainer,
                                {
                                    backgroundColor: theme.secondary, 
                                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                                }
                            ]}
                            onPress={handleAccountSelectorOpen}>
                            { changingToAspiredAccount && (
                                <ActivityIndicator style={{ 
                                    position: "absolute", 
                                    alignSelf: "center",
                                    transform: [{
                                        translateY: 5
                                    }]
                                }}
                                />
                            )}
                            <Text style={{ color: palette.blue, fontSize: 17, opacity: changingToAspiredAccount ? 0.5 : 1 }}>{user?.studentId}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.selectorButtonContainer,
                                {
                                    backgroundColor: theme.secondary, 
                                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                                }
                            ]}
                            onPress={handleSelectionMenuPress}>
                            <Text style={{ color: palette.blue, fontSize: 17 }}>{selectedValue}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Picker
                        selectedValue={selectedValue}
                        mode="dropdown"
                        dropdownIconColor={dropdownColor}
                        onFocus={() => { setMPPickerOpen(true); }}
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
                            <Picker.Item color={mpPickerOpen ? "rgba(0, 0, 0, 0.75)" : palette.blue } label={mp} value={mp} key={index} />
                        ))}
                    </Picker>
                )
            }
            <FlatList 
                contentContainerStyle={[styles.courses]}
                ListHeaderComponent={
                    <CourseHeader gpa={gpa} pastGPA={pastGPA} navigation={navigation} />
                }
                ListEmptyComponent={ListEmptyComponent}
                ListHeaderComponentStyle={{ display: "flex", alignItems: "center" }}
                refreshControl={
                    <RefreshControl
                        refreshing={isFocused && loading}
                        onRefresh={onRefresh}
                    />
                }
                data={courses}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderCourse}
            />
            <BottomSheet
                ref={selectionSheet}
                index={0}
                containerStyle={{
                    zIndex: 1
                }}
                backgroundStyle={{
                    borderRadius: 25,
                    borderColor: theme.secondary,
                    borderWidth: 1,
                    backgroundColor: theme.background
                }}
                handleIndicatorStyle={{
                    backgroundColor: isDark ? theme.text : theme.grey
                }}
                backdropComponent={({ ...props }) => (
                    <BottomSheetBackdrop 
                        open={showSelector}
                        onClose={handleSelectorBack}
                        { ...props} 
                    />
                )}
                onChange={(i) => {
                    if (i === 0) handleSelectorBack();
                }}
                enablePanDownToClose={true}
                enableHandlePanningGesture={true}
                snapPoints={[1, sheetHeight]}
            >        
                <MPSelector 
                    sheetHeight={sheetHeight}
                    handleSelectorBack={handleSelectorBack}
                    markingPeriods={markingPeriods}
                    setSelectedValue={setSelectedValue} 
                    selectedValue={selectedValue} 
                />
            </BottomSheet>
            <BottomSheet
                ref={accountsSheet}
                index={0}
                containerStyle={{
                    zIndex: 1
                }}
                backgroundStyle={{
                    borderRadius: 25,
                    borderColor: theme.secondary,
                    borderWidth: 1,
                    backgroundColor: theme.background
                }}
                handleIndicatorStyle={{
                    backgroundColor: isDark ? theme.text : theme.grey
                }}
                onChange={(i) => {
                    if (i === 0) handleAccountSelectorClose(false)();
                }}
                backdropComponent={({ ...props }) => (
                    <BottomSheetBackdrop 
                        open={showAccountSelector}
                        onClose={handleAccountSelectorClose(true)}
                        { ...props} 
                    />
                )}
                enablePanDownToClose={true}
                enableHandlePanningGesture={true}
                snapPoints={[1, sheetHeight]}
            >        
                <AccountSelector 
                    sheetHeight={sheetHeight}
                    handleSelectorBack={handleAccountSelectorClose(true)}
                    accounts={accounts}
                    setSelectedValue={setAspiredAccount} 
                    selectedValue={aspiredAccount || ""} 
                />
            </BottomSheet>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    androidMPPicker: {
        width: width * 0.9,
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowOpacity: 0.35,
        shadowRadius: 5,
        zIndex: 1,
        shadowOffset: { width: 0, height: 0 },
        marginTop: 15,
        elevation: 15,
    },
    selectorButtonContainer: { 
        marginTop: 5, 
        padding: 5, 
        borderRadius: 10, 
        borderWidth: 1, 
    }
});
export default React.memo(GradesScreen); 