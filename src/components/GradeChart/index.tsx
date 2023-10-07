import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";
import FadeIn from "../FadeIn";
import { LineChart, CurveType } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

type GradeChartProps = {
    data: number[],
    stroke?: string,
    yAxisSuffix?: string,
}

const Y_TICKS = 5; 

const GradeChart : React.FC<GradeChartProps> = ({  data = [], stroke, yAxisSuffix = "" }) => {
    const { palette }  = useTheme();
    const { isDark } = useAppearanceTheme();
    
    const outlineColor = useMemo(() => (
        isDark ? "rgba(255,255,255, 0.1)" : "rgba(0,0,0, 0.1)"
    ), [ isDark ]);

    const formattedData = useMemo(() => {
        return data.map((point) => ({ value: point }));
    }, [ data ]);

    const [ minValue, maxValue ] = useMemo(() => {
        const sortedValues = [ ...data ].sort((a, b) => a - b);
        const min = sortedValues[0]; 
        const max = sortedValues[sortedValues.length - 1]; 
        return [min - (max - min) * 0.025 , max];
    }, [ data ]);

    const decimalPlaces = useMemo(() => {
        let prev = data[0];
        for (let i = 1; i < data.length; i++) {
            if (prev != data[i]) break; 
            else if (i == data.length - 1) return 1;
            prev = data[i];
        }

        const increment = (maxValue - minValue) / Y_TICKS;
        return ~Math.floor(Math.log10(increment)) + 1;
    }, [ minValue, maxValue, data ]);

    const yAxisLabelWidth = useMemo(() => {
        return (yAxisSuffix.length + (maxValue << 0).toString().length + decimalPlaces) * 10 + 10;
    }, [ yAxisSuffix, maxValue, decimalPlaces ]);
    
    const graphWidth = useMemo(() => {
        return width * 0.9 - yAxisLabelWidth;
    }, [yAxisLabelWidth]);

    const spacing = useMemo(() => {
        return (graphWidth - 10) / (data.length - 1);
    }, [ data, graphWidth ]);

    return  (
        <LineChart 
            dashWidth={5}
            initialSpacing={5}
            endSpacing={0}
            width={graphWidth}
            showFractionalValues
            spacing={spacing}
            yAxisOffset={minValue}
            roundToDigits={decimalPlaces}
            data={formattedData}
            yAxisLabelSuffix={yAxisSuffix}
            yAxisLabelWidth={yAxisLabelWidth}
            noOfSections={Y_TICKS}
            yAxisColor={"transparent"}
            xAxisColor={"transparent"}
            yAxisTextStyle={{ color: "grey", fontSize: 12 }}
            rulesColor={outlineColor}
            thickness={3}
            maxValue={maxValue - minValue}
            height={260}
            curved
            curvature={0.15}
            curveType={CurveType.CUBIC}
            hideDataPoints
            color={stroke || palette.primary}
        />
    );
};

const styles = StyleSheet.create({
    graphContainer: {
        width: width * 0.9,
        height: 315,
        zIndex: 1,
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
    },
    graph: {
        width: width * 0.9,
        height: 300,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        zIndex: 1,
        backgroundColor: "#fff",
        shadowColor: "rgba(0, 0, 0, 0.35)",
        shadowOpacity: 0.35,
        borderRadius: 5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        elevation: 15,
    },
    graphWrapper: {
        display: "flex",
        flexDirection: "row",
        marginTop: -5
    }
});

interface IChartFadeConfig {
    fadeIn?: boolean; 
    fadeInDelay?: number; 
}

const withFadeIn = (Component: React.FC<GradeChartProps & IChartFadeConfig>) => ({ 
    fadeIn = false, fadeInDelay = 0, ...props 
} : GradeChartProps & IChartFadeConfig) => {

    const { theme }  = useTheme();

    return (
        <View style={styles.graphContainer}>
            <View style={[ styles.graph, { backgroundColor: theme.secondary } ]}>
                {
                    fadeIn ? (
                        <FadeIn style={styles.graphWrapper} show={true} delay={fadeInDelay}>
                           { props.data.length ? <Component { ...props } /> : <></> }
                        </FadeIn>
                    ) : (
                        <View style={styles.graphWrapper}>
                            { props.data.length ? <Component { ...props } /> : <></> }
                        </View> 
                    )
                }
            </View>
        </View>
    );
};

export default withFadeIn(React.memo(GradeChart)); 