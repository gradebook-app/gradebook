import React, { useMemo, useRef, useState } from "react";
import { 
    StyleSheet, 
    View, 
    Text, 
    Dimensions, 
    TouchableWithoutFeedback,
} from "react-native";
import moment from "moment";
import { useTheme } from "../../../hooks/useTheme";
import Timeline from "react-native-snap-carousel";
import * as Haptics from "expo-haptics";

type IWeekDayProps = {
    start: string,
    index: number,
    dateSelected: string,
    handleSelect: (e:string) => void,
}

const WeekDay: React.FC<IWeekDayProps> = ({ start, index, dateSelected, handleSelect }) => {
    const { theme, palette } = useTheme();

    const day = moment(start).add(index, "day").format();
    const weekday = moment(day).format("ddd").toUpperCase();
    const monthDay = moment(day).format("D");
    const selected = useMemo(() => moment(dateSelected).isSame(day, "day"), [ dateSelected ]);
    const highlightToday = false; // useMemo(() => moment().isSame(day, 'day') && !selected, []);

    const handlePress = () => {
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }
        catch (e) {
            console.log(e);
        }
        handleSelect(day);
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress} >
            <View style={[
                styles.date, 
                highlightToday ? { borderColor: palette.primary } : null,
                selected ? { backgroundColor: theme.secondary } : null 
            ]}>
                <Text
                    style={[ 
                        styles.weekday,{ color: theme.grey },
                        selected ? { color: palette.primary } : null 
                    ]}
                >{ weekday }</Text>
                <Text style={[ styles.monthDay,{ color: theme.grey }]}>{ monthDay }</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

type WeekTimelineProps = {
    week: { 
        start: string, 
        end: string 
    },
    dateSelected: string,
    handleSelect: (e:string) => void,
}

const { width } = Dimensions.get("window");

const WeekTimeline : React.FC<WeekTimelineProps> = ({ week: { start, end }, dateSelected, handleSelect }) => {
    const days = useMemo(() => {
        const dayCount = Math.round(moment.duration(moment(end).diff(start)).asDays());
        return dayCount;
    }, [ start, end ]);

    const { theme } = useTheme();

    const handleSelectDate = (e:string) => handleSelect(e); 

    return (
        <View style={[ styles.timeline, { backgroundColor: theme.background }]}>
            {
                new Array(days).fill(0).map((_, index) => (
                    <WeekDay handleSelect={handleSelectDate} dateSelected={dateSelected} start={start} index={index} key={index} />
                ))
            }
        </View>
    );
};

type DatePickerProps = {
    handleDateChange: (e:any) => void,
    dateSelected: string,
}

const DatePicker : React.FC<DatePickerProps> = ({ handleDateChange, dateSelected }) => {
    const [ currentWeek, setCurrentWeek ] = useState<{
        start: string,
        end: string,
    }>({
        start: moment().startOf("week").format(),
        end: moment().endOf("week").format(),
    });

    // const currentDate = useMemo(() => moment().format("L"),[]);
    // const [ today, setToday ] = useState<string>(currentDate);

    const renderWeekTimeline = ({ item, index } : { item: any, index: number }) => {
        return <WeekTimeline handleSelect={handleDateChange} dateSelected={dateSelected} key={index} week={item}/>;
    };
    
    const schedules = useRef<any | null>(null);
    const CLONES_NUMBER = 2; 

    const handleSnap = (nextIndex:number) => {
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const index = schedules.current.currentIndex;
        let swipeDirection:"right" | "left"; 
        if (nextIndex === 0 && index === CLONES_NUMBER) swipeDirection = "right";
        else if (nextIndex === CLONES_NUMBER && index === 0) swipeDirection = "left";
        else swipeDirection = nextIndex < index ? "left" : "right";

        const updatedStart = swipeDirection === "right" ?
            moment(currentWeek.start).add(1, "week").format() :
            moment(currentWeek.start).subtract(1, "week").format();
        const updatedEnd = swipeDirection === "right" ?
            moment(currentWeek.end).add(1, "week").format() :
            moment(currentWeek.end).subtract(1, "week").format();

        setCurrentWeek({
            start: updatedStart,
            end: updatedEnd
        });

        if (swipeDirection === "left") handleDateChange(moment(dateSelected).subtract(1, "week").format());
        else handleDateChange(moment(dateSelected).add(1, "week").format());
    };

    return (
        <View style={styles.container}>
            <Timeline 
                loop={true}
                ref={schedules}
                layout={"default"}
                loopClonesPerSide={CLONES_NUMBER}
                data={[ currentWeek, currentWeek, currentWeek ]}
                itemWidth={width}
                sliderWidth={width}
                onBeforeSnapToItem={handleSnap}
                renderItem={renderWeekTimeline}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
    },
    timeline: {
        display: "flex",
        flexDirection: "row",
        width: width,
        paddingRight: 45,
        height: 65,
        alignItems: "center",
        justifyContent: "space-around",
    },
    weekday: {
        marginBottom: 2.5,
        fontSize: 12.5,
    },
    date: {
        zIndex: 1,
        marginLeft: 15,
        display: "flex",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,
        width: 55,
        height: 55,
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0, },
    },
    monthDay: {
        fontWeight: "500",
    },
    scrollView: {
        display: "flex",
        flexDirection: "row",
    },
});

export default DatePicker; 