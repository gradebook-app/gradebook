import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import GradeChart from "../../../components/GradeChart";
import { IGPA } from "../../../hooks/useGPA";
import Slider from "../../../components/Slider";
import { useSelector } from "react-redux";
import { IRootReducer } from "../../../store/reducers";
import { getUser } from "../../../store/selectors";
import Box from "../../../components/Box";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { IGPAPast } from "../../../hooks/usePastGPA";

type GPASlideProps = {
    header: string,
    gpa?: number,
    gpaProgression: number[],
    fadeIn?: boolean,
}

const { width } = Dimensions.get("window");

const GPASlide : React.FC<GPASlideProps> = ({ fadeIn = false, header, gpa, gpaProgression = [] }) => {
    const { theme } = useTheme();

    const roundedGPA = useMemo(() => {
        if (!gpa) return gpa;
        return Math.round(gpa * Math.pow(10, 4)) / Math.pow(10, 4);
    }, [ gpa ]);

    const gpaHistory = useMemo(() => {
        if (!roundedGPA) return gpaProgression; 
        const response = [ ...gpaProgression, roundedGPA ];
        if (response.length == 1) {
            response.push(roundedGPA);
        }
        return response; 
    }, [ roundedGPA, gpaProgression ]);

    return (
        <View style={[ styles.slideContainer ]}>
            <View style={[ styles.slideHeaderContainer ]}>
                <Text style={[ styles.slideHeaderMain, { color: theme.text }]}>GPA: {roundedGPA || "-"}</Text>
                <Text style={[ styles.slideHeader, { color: theme.grey }]}>{ header }</Text>
            </View>
            <GradeChart fadeIn={fadeIn} fadeInDelay={1} data={gpaHistory}/>
        </View>
    );
};

const GPASlideMemoized = React.memo(GPASlide);

type GPASlideshowProps = {
    gpa: IGPA,
    pastGPA: IGPAPast[],
    handleGPAScreen: () => void,
}

const GPASlideshow : React.FC<GPASlideshowProps> = ({ gpa, pastGPA, handleGPAScreen }) => {
    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const roundGrade = (value:number | undefined) : number => {
        if (!value && value !== 0) return 0; 
        return Math.round(value * Math.pow(10, 4)) / Math.pow(10, 4);
    };

    const unweightedProgression = useMemo(() => {
        return user?.gpaHistory?.map(history => {
            return roundGrade(history.unweightedGPA);
        }) || [];
    }, [ user?.gpaHistory ]);

    const weightedProgression = useMemo(() => {
        return user?.gpaHistory?.map(history => {
            return roundGrade(history.weightedGPA);
        }) || [];
    }, [ user?.gpaHistory ]);

    const pastGPAUnweighted = useMemo(() => {
        let total = 0; 
        pastGPA.forEach((eachGPA) => { total += eachGPA.unweightedGPA; });
        return total; 
    }, [ pastGPA ]);

    const pastGPAWeighted = useMemo(() => {
        let total = 0;
        pastGPA.forEach((eachGPA) => { total += eachGPA.weightedGPA; });
        return total; 
    }, [ pastGPA ]);

    const highschoolGPAUnweighted = useMemo(() => {
        const unweightedGPA = gpa.unweightedGPA || user?.unweightedGPA;
        const total = pastGPAUnweighted + (unweightedGPA || 0);
        return (total / (pastGPA.length + 1));
    }, [ pastGPAUnweighted, gpa, user ]);

    const highschoolGPAWeighted = useMemo(() => {
        const weightedGPA = gpa.weightedGPA || user?.weightedGPA;
        const total = pastGPAWeighted + (weightedGPA || 0);
        return (total / (pastGPA.length + 1));
    }, [ pastGPAWeighted, gpa, user ]);

    const highschoolGPAUnweightedProgression = useMemo(() => {
        return unweightedProgression.map(value => {
            return (value + pastGPAUnweighted) / (pastGPA.length + 1);
        });
    }, [ unweightedProgression, pastGPAUnweighted ]);

    const highschoolGPAWeightedProgression = useMemo(() => {
        return weightedProgression.map(value => {
            return (value + pastGPAWeighted) / (pastGPA.length + 1);
        });
    }, [ weightedProgression, pastGPAWeighted ]);

    const handleMoreAboutGPA = () => {
        handleGPAScreen();
    };

    const renderCaption = () => {
        return (
            <Box style={styles.detail}>
                <Box.Clickable onPress={handleMoreAboutGPA}>
                    <Box.Content 
                        icon={faGraduationCap} 
                        title="More About GPA" 
                        iconColor={"#006B57"}
                    >
                        <Box.Arrow onPress={handleMoreAboutGPA} />
                    </Box.Content>  
                </Box.Clickable>
            </Box>
        );
    };
    
    return (
        <Slider caption={renderCaption}>
            <GPASlideMemoized 
                fadeIn={true}
                gpaProgression={unweightedProgression} 
                gpa={gpa?.unweightedGPA || user?.unweightedGPA} 
                header={"Unweighted GPA"}
            />
            <GPASlideMemoized 
                gpaProgression={weightedProgression} 
                gpa={gpa?.weightedGPA || user?.weightedGPA} 
                header={"Weighted GPA"}
            />
            {
                gpa.unweightedGPA ? (
                    <GPASlideMemoized 
                        gpaProgression={highschoolGPAUnweightedProgression}
                        gpa={highschoolGPAUnweighted} 
                        header={"Unweighted Total GPA"}
                    />
                ) : <></>
            }
            {
                gpa.weightedGPA ? (
                    <GPASlideMemoized 
                        gpaProgression={highschoolGPAWeightedProgression} 
                        gpa={highschoolGPAWeighted} 
                        header={"Weighted Total GPA"}
                    />
                ) : <></>
            }
        </Slider> 
    );
};

const styles = StyleSheet.create({
    slideContainer: {
        width: width,
        display: "flex",
        alignItems: "center",
    },
    slideHeaderContainer: {
        width: width,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        paddingHorizontal: 20,
        marginVertical: 5,
        alignItems: "flex-end",
    },
    slideHeaderMain: {
        fontWeight: "700",
        fontSize: 25,
    },
    slideHeader: {},
    detail: {
        marginBottom: 10,
    }
});

export default React.memo(GPASlideshow);