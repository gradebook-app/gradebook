import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from 'react-native-paper';
import GradeChart from '../../../components/GradeChart';
import { IGPA } from '../../../hooks/useGPA';
import Slider from "../../../components/Slider";
import { useSelector } from 'react-redux';
import { IRootReducer } from '../../../store/reducers';
import { getUser } from '../../../store/selectors';

type GPASlideProps = {
    header: string,
    gpa?: number,
    gpaProgression: number[],
}

const { width, height } = Dimensions.get('window');

const GPASlide : React.FC<GPASlideProps> = ({ header, gpa, gpaProgression = [] }) => {
    const { theme } : any = useTheme();

    const roundedGPA = useMemo(() => {
        if (!gpa) return gpa;
        return Math.round(gpa * Math.pow(10, 4)) / Math.pow(10, 4);
    }, [ gpa ]);

    const gpaHistory = useMemo(() => {
        if (!roundedGPA) return gpaProgression; 
        const response = [ ...gpaProgression, roundedGPA ];
        if (response.length == 1) {
            response.push(roundedGPA)
        }
        return response; 
    }, [ roundedGPA, gpaProgression ]);

    return (
        <View style={[ styles.slideContainer ]}>
            <View style={[ styles.slideHeaderContainer ]}>
                <Text style={[ styles.slideHeaderMain, { color: theme.text }]}>GPA: {roundedGPA || "-"}</Text>
                <Text style={[ styles.slideHeader, { color: theme.grey }]}>{ header }</Text>
            </View>
            <GradeChart data={gpaHistory}/>
        </View>
    )
}

type GPASlideshowProps = {
    gpa: IGPA,
}

const GPASlideshow : React.FC<GPASlideshowProps> = ({ gpa }) => {
    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const unweightedProgression = useMemo(() => {
        return user?.gpaHistory?.map(history => {
            return Math.round(history.unweightedGPA * Math.pow(10, 4)) / Math.pow(10, 4);
        }) || []
    }, [ user?.gpaHistory ]);

    const weightedProgression = useMemo(() => {
        return user?.gpaHistory?.map(history => {
            return Math.round(history.weightedGPA * Math.pow(10, 4)) / Math.pow(10, 4);
        }) || []
    }, [ user?.gpaHistory ]);

    return (
        <Slider>
            <GPASlide gpaProgression={unweightedProgression} gpa={gpa?.unweightedGPA} header={"Unweighted GPA"}/>
            <GPASlide gpaProgression={weightedProgression} gpa={gpa?.weightedGPA} header={"Weighted GPA"}/>
        </Slider> 
    )
}

const styles = StyleSheet.create({
    slideContainer: {
        width: width,
        display: 'flex',
        alignItems: 'center',
    },
    slideHeaderContainer: {
        width: width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 5,
        paddingHorizontal: 20,
        marginVertical: 5,
        alignItems: 'flex-end',
    },
    slideHeaderMain: {
        fontWeight: '700',
        fontSize: 25,
    },
    slideHeader: {
        
    }
});

export default GPASlideshow;