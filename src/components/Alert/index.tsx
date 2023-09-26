import React, { ReactChild, useState } from "react";
import { Dimensions, StyleSheet, View, Text, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../hooks/useTheme";
import Blocker from "../Blocker";
import FadeIn from "../FadeIn";

interface IAlertButton {
    title: string,
    onPress: () => void,
}

type AlertProps = {
    title: string,
    children: ReactChild,
    buttons?: IAlertButton[],
    visible: boolean,
    delay?: number,
};

const { width, height } = Dimensions.get("screen");

const Alert : React.FC<AlertProps> = ({ title, children, buttons, visible, delay = 0 }) => {
    const { theme } = useTheme();

    const [ isComponentMounted, setIsComponentMounted ] = useState(false);

    React.useEffect(() => {
        setIsComponentMounted(true);
        return () => setIsComponentMounted(false);
    }, []);

    return (
        <View pointerEvents={isComponentMounted && visible ? "auto" : "none"} style={styles.container}>
            <Blocker block={isComponentMounted && visible} />
            <FadeIn delay={delay} show={visible && isComponentMounted} style={[ styles.alert, { backgroundColor: theme.background }]}>
                <>
                    <Text style={[ styles.header, { color: theme.text }]}>{ title }</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200, margin: 10 }}>
                        { children }
                    </ScrollView>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        { 
                            buttons?.map(({ title, onPress } : IAlertButton, index:number) => (
                                <View key={index} style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    <Button 
                                        onPress={onPress} 
                                        title={title} 
                                    />
                                    { index !== buttons?.length - 1 && <Text style={{ color: theme.text }}>|</Text> }
                                </View>
                            ))
                        }
                    </View>
                </>
            </FadeIn>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        fontSize: 20,
        fontWeight: "700",
    },
    alert: {
        width: width * 0.75 > 300 ? 300 : width * 0.75,
        minHeight: 150,
        borderRadius: 25,
        display: "flex",
        alignItems:"center",
        padding: 15,
        zIndex: 1,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
    }
});

export default Alert; 