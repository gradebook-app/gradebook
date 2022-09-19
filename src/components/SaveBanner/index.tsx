import React, { useState } from "react";
import { Dimensions, StyleSheet, Image, Text, TouchableOpacity, Linking, GestureResponderEvent, LayoutAnimation } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import LinearGradient from "react-native-linear-gradient";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import FadeIn from "../FadeIn";
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getShownSaveBanner } from "../../store/selectors/user.selectors";
import { setShownSaveBanner } from "../../store/actions/user.actions";
import config from "../../../config";
    
const { width } = Dimensions.get("screen");

const SaveBanner = () => {
    const { theme, palette } = useTheme();

    const state = useSelector((state:IRootReducer) => state);
    const shownSaveBanner = getShownSaveBanner(state);
    const dispatch = useDispatch();

    const [ unmount, setUnmount ] = useState(false);

    const handlePress = () => {
        Linking.openURL(config.donateLink);
    }

    const handleX = (e: GestureResponderEvent) => {
        e.preventDefault();
        e.stopPropagation()

        dispatch(setShownSaveBanner(true));
    };

    return (
        <FadeIn show={!shownSaveBanner} onHidden={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setUnmount(true);
        }}>
            {
                !unmount ? (
                    <TouchableOpacity style={{ position: "relative" }} onPress={handlePress}>
                        <LinearGradient 
                            colors={[ palette.secondary, "#a8c0ff" ]}
                            style={[ styles.container, { backgroundColor: theme.secondary  }]}>
                            <Image 
                                style={{ width, height: 60, position: "absolute" }}
                                source={require("../../../assets/coins.png")}
                            />
                            <Text style={[ styles.title, { color: "#fff" }]}>#SaveGenesus</Text>
                            <Text style={[ styles.caption, { color: "#fff" }]}>Click to Fund.</Text>
                        </LinearGradient>
                        <TouchableOpacity style={styles.x} onPress={handleX}>
                            <FontAwesomeIcon color="#fff" size={17.5} icon={faXmark} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ) : <></>
            }
        </FadeIn>

    )
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        height: 60,
        width: width * 0.9,
        marginVertical: 10,
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
    },
    caption: {
        fontWeight: "600",
        fontSize: 12,
        marginTop: 2
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    x: {
        position: "absolute",
        top: 20,
        right: 10,
        zIndex: 1
    }
});

export default SaveBanner;