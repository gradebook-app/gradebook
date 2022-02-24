import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, SafeAreaView, Text, ScrollView, Dimensions, RefreshControl, View } from "react-native";
import { useSelector } from "react-redux";
import { useSchedule } from "../../hooks/useSchedule";
import { useTheme } from "../../hooks/useTheme";
import { IRootReducer } from "../../store/reducers";
import { getAccessToken } from "../../store/selectors";
import DatePicker from "./components/DatePicker";
import ScheduleTable from "./components/ScheduleTable";
import { ISchedule } from "../../store/interfaces/schedule.interface";
import BannerAd from "../../components/BannerAd";

interface IScheduleScreenProps {
    navigation: any,
}

const { width, height } = Dimensions.get("window");

const ScheduleScreen : React.FC<IScheduleScreenProps> = ({ navigation }) => {
    const { theme } = useTheme();

    const state = useSelector((state:IRootReducer) => state);
    const accessToken = getAccessToken(state);
    const isAccessToken = !!accessToken;

    const [ dateSelected, setDateSelected ] = useState(moment().format());
    const { reload, loading, schedule, fetching } = useSchedule({ dateSelected });

    const schedules = useRef<any | null>();


    const handleDateChange = (e:string) => {
        if (moment(e).isSame(dateSelected, "day")) return; 
        setDateSelected(e);
        const isNext = moment(e).isAfter(dateSelected); 
        // if (isNext) schedules.current.snapToNext();
        // else schedules.current.snapToPrev();
    };

    const CLONES_NUMBER = 2; 

    const handleNextSnap = (nextIndex:number) => {
        //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // let index = schedules.current.currentIndex;
        // let swipeDirection:"right" | "left"; 
        // if (nextIndex === 0 && index === CLONES_NUMBER) swipeDirection = "right";
        // else if (nextIndex === CLONES_NUMBER && index === 0) swipeDirection = "left";
        // else swipeDirection = nextIndex < index ? "left" : "right";
        
        // if (swipeDirection === 'right')
        //     setDateSelected(moment(dateSelected).add(1, 'day').format());
        // else setDateSelected(moment(dateSelected).subtract(1, 'day').format());
    };

    const handleAuth = useCallback(() => {
        if (!accessToken) return; 
        reload();
    }, [ isAccessToken ]);

    useEffect(handleAuth, [ handleAuth ]);

    const onRefresh = () => {
        reload();
    };  
   
    const renderSchedule = ({ item, index } : { item: ISchedule, index:number }) => {
        return (
            <ScheduleTable fetching={fetching} key={index} schedule={item} />
        );
    };

    const dateFormatted = useMemo(() => {
        return moment(dateSelected).format("MMM DD, YYYY");
    }, [ dateSelected ]);

    return (
        <SafeAreaView style={[ styles.container, { backgroundColor: theme.background }]}>
            <ScrollView 
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={[ styles.title, { color: theme.text }]}>Schedule</Text>
                    <Text style={[ styles.date, { color: theme.text }]}>{ dateFormatted }</Text>
                </View>
                <DatePicker dateSelected={dateSelected} handleDateChange={handleDateChange}/>
                <ScheduleTable fetching={fetching} schedule={schedule} />
                {/* <Timeline  
                        loop={true}
                        loopClonesPerSide={CLONES_NUMBER}
                        onBeforeSnapToItem={handleNextSnap}
                        ref={schedules}
                        layout={'default'}
                        data={[ schedule, schedule, schedule ]}
                        itemWidth={width}
                        sliderWidth={width}
                        renderItem={renderSchedule}
                    /> */}
                <BannerAd style={styles.adContainer}/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
    adContainer: {
        marginLeft: -15,
    },
    title: {
        fontWeight: "700",
        fontSize: 30,
    },
    scrollView: {
        padding: 15,
        height: height - 125,
        display: "flex",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    date: {
        fontSize: 20,
        fontWeight: "500",
    }
});

export default ScheduleScreen; 