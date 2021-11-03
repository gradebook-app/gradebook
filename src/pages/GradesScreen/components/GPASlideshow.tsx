import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useTheme } from 'react-native-paper';
import GradeChart from '../../../components/GradeChart';
import { IGPA } from '../../../hooks/useGPA';
import Slider from "../../../components/Slider";

type GPASlideProps = {
    header: string,
    gpa?: number,
    gpaProgression: number[],
}

const { width, height } = Dimensions.get('window');

const GPASlide : React.FC<GPASlideProps> = ({ header, gpa, gpaProgression = [] }) => {
    const { theme } : any = useTheme();

    const gpaHistory = useMemo(() => {
        if (!gpa) return gpaProgression; 
        const response = [ ...gpaProgression, gpa ];
        if (response.length == 1) {
            response.push(gpa)
        }
        return response; 
    }, [ gpa, gpaProgression ]);

    return (
        <View style={[ styles.slideContainer ]}>
            <View style={[ styles.slideHeaderContainer ]}>
                <Text style={[ styles.slideHeaderMain, { color: theme.text }]}>GPA: {gpa || "-"}</Text>
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
    return (
        <Slider>
            <GPASlide gpaProgression={[]} gpa={gpa?.unweightedGPA} header={"Unweighted GPA"}/>
            <GPASlide gpaProgression={[]} gpa={gpa?.weightedGPA} header={"Weighted GPA"}/>
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