import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { 
    Dimensions, 
    StyleSheet, 
    View, 
    Animated
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { loadingConfig } from "./constant";

const { width, height } = Dimensions.get("window");

type SlideProps = {
    icon: any,
    slideTranslate: any
}

const Slide : React.FC<SlideProps> = ({ icon, slideTranslate }) => {
    const { palette } = useTheme();

    return (
        <Animated.View style={[styles.doc, { transform: [{ translateX: slideTranslate }]}]}>
            <FontAwesomeIcon 
                size={65} 
                color={palette.primary} 
                icon={icon} 
            />
        </Animated.View>
    );
};


type LoadingScreenProps = {
    loading?: boolean,
}


const LoadingBox: React.FC<LoadingScreenProps> = ({ loading = false }) => {
    const { theme } = useTheme();

    const slides = loadingConfig.slide.slides;

    const containerOpacity = useRef(new Animated.Value(1)).current;
    const slideTranslate = useRef(new Animated.Value(0)).current;

    const [ currentSlides, setCurrentSlides ] = useState([faFileInvoice, faFileInvoice]);
    const [ currentSlide, setCurrentSlide ] = useState(1);

    useEffect(() => {
        const slideTranslateMin = width * 0.35 > 100 ? width * 0.35 : 100;
        const slideTranslateMax = slideTranslateMin < 200 ? slideTranslateMin : 200;

        Animated.timing(
            slideTranslate,
            {
                toValue: -slideTranslateMax,
                duration: loadingConfig.slide.transition,
                delay: loadingConfig.slide.interval -  loadingConfig.slide.transition,
                useNativeDriver: true,
            }
        ).start(() => {
            slideTranslate.setValue(0);
        });
    });

    const handleLoading = useCallback(() => {
        Animated.timing(
            containerOpacity, {
                duration: 150,
                toValue: loading ? 1 : 0,
                useNativeDriver: true,
            }
        ).start();
    }, [ loading ]);

    useEffect(handleLoading, [ handleLoading ]);

    const slideAnimation = useCallback(() => {
        const slideInterval = setInterval(() => {
            const visibleSlide = slides[currentSlide];
            const nextSlide = currentSlide + 1 < slides.length ? slides[currentSlide + 1] : slides[0];
            setCurrentSlide(currentSlide + 1 < slides.length ? currentSlide + 1 : 0);
            setCurrentSlides([ visibleSlide, nextSlide ]);
        }, loadingConfig.slide.interval);
        
        return () => clearInterval(slideInterval);
    }, []);

    useEffect(slideAnimation, [ slideAnimation ]);

    return (
        <Animated.View 
            pointerEvents={loading ? "box-only" : "none" }
            style={[ styles.container, { 
                opacity: containerOpacity,
            }]}>
            <View style={[styles.loadingContainer, { 
                backgroundColor: theme.secondary,
                borderColor: theme.border
            }]}>
                <Animated.View
                    style={[ styles.track, { 
                        transform: [{
                            translateX: 0,
                        }]
                    }]}>
                    { currentSlides.map((_, index ) => {
                        return (
                            <Slide 
                                key={index} 
                                icon={currentSlides[index]}
                                slideTranslate={slideTranslate} 
                            />
                        );
                    })}
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0, 0, 0, 0.15)",
        width: width,
        height: height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        zIndex: 1,
    },
    loadingContainer: {
        position: "absolute",
        zIndex: 1,
        borderWidth: 2,
        borderStyle: "solid",
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        backgroundColor: "#fff",
        maxWidth: 200,
        borderRadius: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.075,
        shadowOffset: { width: 0, height: 0 },
        overflow: "hidden",
    },
    track: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
    doc: {
        width: width * 0.35,
        height: width * 0.35,
        minWidth: 100,
        minHeight: 100,
        maxHeight: 200,
        maxWidth: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
});

export default React.memo(LoadingBox);