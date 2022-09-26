import React, { useCallback, useState } from "react";
import { View, StyleSheet, Dimensions, Button, Text, ActivityIndicator } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { ECourseWeight } from "../../../store/enums/weights";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { getIsUpdatingCourseWeight } from "../../../store/selectors/user.selectors";
import { IRootReducer } from "../../../store/reducers";

const { width } = Dimensions.get("window");

interface WeightSheetProps {
    weight: ECourseWeight | null,
    setWeight: (value: ECourseWeight) => void;
    onDismiss: () => void; 
}

const WeightSheet : React.FC<WeightSheetProps> = ({ weight, setWeight, onDismiss }) => {
    const { theme } = useTheme();

    const [ selectedValue, setSelectedValue ] = useState<ECourseWeight | null>(weight);

    const state = useSelector((state:IRootReducer) => state);
    const isUpdating = getIsUpdatingCourseWeight(state);

    const handleUpdateWeight = useCallback(() => {
        if (isUpdating) return; 

        if (weight === selectedValue || selectedValue === null) {
            onDismiss();
            return;
        }
        setWeight(selectedValue);
    }, [ selectedValue, weight, isUpdating ]);

    return (
        <View style={[ styles.selectContainer, { backgroundColor: theme.background } ]}>
            <View style={{ 
                flexDirection: "row", 
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
                padding: 20,
            }}>
                <Text style={[ styles.title, { color: theme.text } ]}>Select Weight</Text>
                <View style={[ styles.buttons ]}>
                    {
                        !isUpdating ? (
                            <Button color="red" title="Cancel" onPress={onDismiss} />
                        ) : (
                            <ActivityIndicator animating={isUpdating} />
                        )
                    }
                    <Button disabled={isUpdating} title="Update" onPress={handleUpdateWeight} />
                </View>
            </View>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
                <Picker.Item color={theme.text} label={"Unweighted (4.0)"} value={"unweighted"} />
                <Picker.Item color={theme.text} label={"Honors (4.5)"} value={"honors"} />
                <Picker.Item color={theme.text} label={"AP (5.0)"} value={"ap"} />
            </Picker>
        </View>
    )
};

const styles = StyleSheet.create({  
    selectContainer: {
        height: 400,
        width: width,
        backgroundColor: "#fff",
    },
    title: {
        fontWeight: "500",
        fontSize: 25,
    },
    buttons: {
        display: "flex",
        flexDirection: "row"
    }
})

export default WeightSheet; 