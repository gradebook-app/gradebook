import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, SafeAreaView, Text, ScrollView, Dimensions, RefreshControl, View, Platform } from "react-native";
import { useSelector } from "react-redux";
import { useSchedule } from "../../hooks/useSchedule";
import { useTheme } from "../../hooks/useTheme";
import { IRootReducer } from "../../store/reducers";
import { getAccessToken } from "../../store/selectors";
import DatePicker from "./components/DatePicker";
import ScheduleTable from "./components/ScheduleTable";
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

    const handleDateChange = (e:string) => {
        if (moment(e).isSame(dateSelected, "day")) return; 
        setDateSelected(e);
    };

    const handleAuth = useCallback(() => {
        if (!accessToken) return; 
        reload();
    }, [ isAccessToken ]);

    useEffect(handleAuth, [ handleAuth ]);

    const onRefresh = () => {
        reload();
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
                <BannerAd style={styles.adContainer}/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        marginTop: Platform.OS === "android" ? 25 : 0, 
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
        paddingBottom: 100,
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