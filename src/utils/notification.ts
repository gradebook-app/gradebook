import * as Notifications from "expo-notifications"
import { Alert } from "react-native";

export const hasNotificationPermission = async () => {
    try {
        const permission = await Notifications.getPermissionsAsync();
        if (permission.granted) return true; 
        else if (permission.canAskAgain) {
            const { status } : any = await Notifications.requestPermissionsAsync();
            if (status === "granted") return true; 
            if (status !== "granted") {
                Alert.alert(
                    "Warning", 
                    "You Will not Receive Any Notifications for Grade, GPA, and Assignment Updates",
                    [
                        { text: "Dismiss" },
                    ]
                );
                return false; 
            }
        }
    } catch (e) { return false }
}