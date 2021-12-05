import React from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { useTheme } from "../../hooks/useTheme"
import { LineChart, Grid, YAxis } from "react-native-svg-charts"

const { width, height } = Dimensions.get("window")

type GradeChartProps = {
    data: number[],
    stroke?: any,
    yAxis?: (e:any) => any,
}

const GradeChart : React.FC<GradeChartProps> = ({ data = [], stroke, yAxis }) => {
    const { palette, theme  }  = useTheme()

    return  (
        <View style={styles.graphContainer}>
            <View style={[ styles.graph, { backgroundColor: theme.secondary } ]}>
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
                    svg={{ 
                        stroke: stroke || palette.primary, 
                        strokeWidth: 3
                    }}
                    contentInset={{ top: 20, bottom: 20, left: 5, right: 5, }}
                >
                    <Grid svg={{ stroke: "rgba(0, 0, 0, 0.1)" }} />
                </LineChart>
            </View>
        </View>
    )
}

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
        shadowOffset: { width: 0, height: 0 }
    }
})

export default GradeChart 