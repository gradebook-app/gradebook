import React from "react";
import { View, Button, StyleSheet, Text, Dimensions } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { Picker } from "@react-native-picker/picker";
import { IGeneralUserAccount } from "../../../hooks/useAccounts";

interface AccountSelectorProps {
    setSelectedValue: (value:string) => void; 
    selectedValue: string; 
    accounts: IGeneralUserAccount[];
    handleSelectorBack: () => void;
    sheetHeight: number; 
}

const { width } = Dimensions.get("window");

const AccountSelector : React.FC<AccountSelectorProps> = ({ 
    accounts,
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
                <Text style={[ styles.accountsTitle, { color: theme.text } ]}>Select Student Account</Text>
                <Button title="Done" onPress={handleSelectorBack} />
            </View>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
                { accounts.map(({ name, studentId}, index) => (
                    <Picker.Item color={theme.text} label={`${name} (${studentId})`} value={studentId} key={index} />
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
    accountsTitle: {
        fontWeight: "500",
        fontSize: 25,
    },
});

export default AccountSelector; 