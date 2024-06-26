import React from "react";
import { View, Button, StyleSheet, Text, Dimensions } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { Picker } from "@react-native-picker/picker";

interface IMPSelectorProps {
    setSelectedValue: (value:string) => void; 
    selectedValue: string; 
    markingPeriods: string[];
    handleSelectorBack: () => void;
    sheetHeight: number; 
}

const { width } = Dimensions.get("window");

const MPSelector : React.FC<IMPSelectorProps> = ({ 
    markingPeriods,
    setSelectedValue, 
    selectedValue,
    handleSelectorBack,
    sheetHeight
}) => {
    const { theme } = useTheme();

    return (
        <View style={[ styles.selectContainer, { 
            backgroundColor: theme.background,
            borderColor: theme.secondary,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            height: sheetHeight
        }]}>
            <View style={{ 
                flexDirection: "row", 
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
                padding: 20,
                paddingTop: 5,
            }}>
                <Text style={[ styles.markingPeriod, { color: theme.text } ]}>Select Marking Period</Text>
                <Button title="Done" onPress={handleSelectorBack} />
            </View>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
                { markingPeriods.map((mp, index) => (
                    <Picker.Item color={theme.text} label={mp} value={mp} key={index} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    selectContainer: {
        width: width,
        backgroundColor: "#fff",
    },
    markingPeriod: {
        fontWeight: "500",
        fontSize: 25,
    },
});

export default MPSelector; 