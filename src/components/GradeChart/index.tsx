import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { LineChart, Grid, YAxis } from "react-native-svg-charts";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";
// import Svg, { Path, Text as SVGText, G } from "react-native-svg";

import * as shape from 'd3-shape';
// import * as scale from 'd3-scale';
import FadeIn from "../FadeIn";

const { width } = Dimensions.get("window");

type GradeChartProps = {
    data: number[],
    stroke?: any,
    yAxis?: (e:any) => any,
}

const GradeChart : React.FC<GradeChartProps> = ({  data = [], stroke, yAxis }) => {
    const { palette, theme  }  = useTheme();

    const { isDark } = useAppearanceTheme();

    // const graphPoints = useMemo(() => {
    //     const line = shape.line().curve(shape.curveMonotoneX);

    //     const strokeWidth = 3; 
    //     const topInset = 20; 
    //     const bottomInset = 20; 
    //     const leftInset = 10; 
    //     const rightInset = 10;

    //     const graphWidth = (width * 0.8) - rightInset - leftInset - (strokeWidth * 2); 
    //     const graphHeight = 300 - (strokeWidth * 2) - bottomInset - topInset; 

    //     const maxVal = data.reduce((a, b) => Math.max(a, b), 0);
    //     const minVal = data.reduce((a, b) => Math.min(a, b));
    //     const range  = maxVal - minVal; 

    //     const mappedPoints = data.map((yCoord, i) : [ number, number ] => {
    //         const x = (i / (data.length - 1)) * graphWidth; 
    //         const y = range ? ((maxVal - yCoord) / range) * graphHeight : graphHeight;
    //         return [ x + strokeWidth + leftInset, y + strokeWidth + topInset ];
    //     });

    //     return line(mappedPoints);
    // }, [ data ]);

    // const ticks = useMemo(() => {
    //     const y = scale.scaleLinear().domain(data).range([0, 70]); 
    //     return y.ticks(5).map((value) => [ y(value), value ]);
    // }, [ data ]);

    return  (
        <View style={styles.graphContainer}>
            <View style={[ styles.graph, { backgroundColor: theme.secondary } ]}>
                {/* <Svg width={30}>
                    <G>
                        {
                            ticks.map(([ y, value ], index) => {
                                return (
                                    <SVGText
                                        originY={y}
                                        textAnchor={'middle'}
                                        x={'50%'}
                                        fill="grey"
                                        fontSize={10}
                                        alignmentBaseline={'middle'}
                                        key={index}
                                        y={y}
                                    >
                                        { value }
                                    </SVGText>
                                )
                            })
                        }
                    </G>
                </Svg> */}
                {/* <Svg width={"100%"} height={"100%"}>
                    <Path 
                        scale={1}
                        stroke={stroke || palette.primary}
                        strokeWidth={3}
                        d={graphPoints!} 
                    />
                </Svg> */}
                <YAxis
                    data={data}
                    contentInset={{ top: 20, bottom: 20 }}
                    svg={{
                        fill: "grey",
                        fontSize: 10,
                    }}
                    numberOfTicks={5}
                    formatLabel={(value) => yAxis ? yAxis(value) : value}
                />
                <LineChart
                    style={{ height: 300, width: width * 0.8 }}
                    data={data}
                    curve={shape.curveMonotoneX}
                    svg={{ 
                        stroke: stroke || palette.primary, 
                        strokeWidth: 3
                    }}
                    contentInset={{ top: 20, bottom: 20, left: 5, right: 5, }}
                >
                    <Grid svg={{ 
                        stroke: isDark ? "rgba(255,255,255, 0.1)" : "rgba(0,0,0, 0.1)" 
                    }} />
                </LineChart>
            </View>
        </View>
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
    }
});

interface IChartFadeConfig {
    fadeIn?: boolean; 
    fadeInDelay?: number; 
}

const withFadeIn = (Component: React.FC<GradeChartProps & IChartFadeConfig>) => ({ 
    fadeIn = false, fadeInDelay = 0, ...props 
} : GradeChartProps & IChartFadeConfig) => {

    return fadeIn ? (
        <FadeIn show={true} delay={fadeInDelay}>
            <Component { ...props }  />
        </FadeIn>
    ) : <Component { ...props } />
};

export default withFadeIn(React.memo(GradeChart)); 