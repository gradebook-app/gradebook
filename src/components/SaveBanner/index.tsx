import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Image, Text, TouchableOpacity, GestureResponderEvent, LayoutAnimation, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import LinearGradient from "react-native-linear-gradient";
import { faHeart, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import FadeIn from "../FadeIn";
import { useDispatch, useSelector } from "react-redux";
import { IRootReducer } from "../../store/reducers";
import { getShownSaveBanner } from "../../store/selectors/user.selectors";
import { setShownSaveBanner } from "../../store/actions/user.actions";

const { width } = Dimensions.get("screen");

interface ISaveBannerProps {
    onPress: () => void; 
}

const SaveBanner : React.FC<ISaveBannerProps>  = ({ onPress }) => {
    const { theme, palette } = useTheme();

    const state = useSelector((state:IRootReducer) => state);
    const shownSaveBanner = getShownSaveBanner(state);
    const dispatch = useDispatch();

    const [ unmount, setUnmount ] = useState(false);

    const handlePress = () => {
        onPress()
    }

    const handleX = (e: GestureResponderEvent) => {
        e.preventDefault();
        e.stopPropagation()

        dispatch(setShownSaveBanner(true));
    };

    const wasBeingShown = useRef(false);

    useEffect(() => {
        if (!shownSaveBanner) wasBeingShown.current = true;
    }, [ shownSaveBanner ]);

    return (
        <FadeIn style={{ display: wasBeingShown.current ? undefined : "none" }} show={!shownSaveBanner} onHidden={() => {
            if (wasBeingShown.current) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
                            <Text style={[ styles.title, { color: "#fff", marginLeft: 5 }]}>Love Genesus?</Text>
                            <Text style={[ styles.caption, { color: "#fff" }]}>Click to Contribute.</Text>
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