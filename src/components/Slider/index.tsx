import React, { ReactChild, useState } from "react";
import { 
    NativeScrollEvent, 
    NativeSyntheticEvent,
    ScrollView,
    View, 
    StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";
import { useAppearanceTheme } from "../../hooks/useAppearanceTheme";

type SliderProps = {
    children: ReactChild[],
}

const Slider : React.FC<SliderProps> = ({ children }) => {
    const [ slideNumber, setSlideNumber ] = useState<number>(0);

    const handleScrollEnd = (e:NativeSyntheticEvent<NativeScrollEvent>) => {
        const { targetContentOffset, layoutMeasurement } = e.nativeEvent; 
        const slideWidth = layoutMeasurement.width; 
        const sliderOffset = targetContentOffset?.x;

        if (sliderOffset === undefined) return; 

        const currentSlide = Math.floor(sliderOffset / slideWidth); 
        setSlideNumber(currentSlide);
    };
    
    const { isDark } = useAppearanceTheme();

    const { colors, theme } : any = useTheme();

    
    return (
        <>
            <ScrollView 
                    horizontal={true}
                    centerContent={true}
                    alwaysBounceHorizontal={true}
                    pagingEnabled={true}
                    onScrollEndDrag={handleScrollEnd}
                    showsHorizontalScrollIndicator={false}
            >
                { children }
            </ScrollView>
            <View style={ styles.dots }>
                {
                    new Array(React.Children.count(children)).fill(0).map((_, index) => {
                        return (
                            <View 
                                key={index} 
                                style={[ 
                                    styles.dot, 
                                    index === slideNumber ?  
                                    { backgroundColor: colors.primary } : 
                                    { backgroundColor: isDark ? theme.grey : "rgba(0, 0, 0, 0.1)"} 
                                ]}
                            ></View>
                        )
                    })
                }
            </View>
    </>
    )
}

const styles = StyleSheet.create({
    dots: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 0,
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
        zIndex: 1,
        marginHorizontal: 2,
    }
});

export default Slider; 