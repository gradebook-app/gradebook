import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTheme } from 'react-native-paper';
import GradeChart from '../../../components/GradeChart';
import { useCategoryColor } from '../../../hooks/useCategoryColor';
import { IAssignment } from '../../../store/interfaces/assignment.interface';

const { width, height } = Dimensions.get('window');

type GradeGraphSliderProps = {
    assignments: IAssignment[],
}

type GradeSlideProps= {
    category: string,
    value: IAssignment[],
} 

const GradeSlide : React.FC<GradeSlideProps> = ({ category, value }) => {
    const points = useMemo(() => {
        return value
            .filter((value) => !!value?.grade?.percentage)
            .map((value) => (value.grade.percentage || 0)).reverse();
    }, []);

    const formattedCategory = useMemo(() => {
        return `${category.substring(0, 1).toUpperCase()}${category.substring(1)}` 
    }, [ category ]);

    const categoryColor = useCategoryColor(category);

    return (
        <View style={styles.slide}>
           <View>
                <Text style={[ styles.category, { color: categoryColor } ]}>{ formattedCategory } Progess</Text>
                <GradeChart stroke={categoryColor} data={points} />
           </View>
        </View>
    )
}

const GradeGraphSlider : React.FC<GradeGraphSliderProps> = ({ assignments }) => {
    const [ slideNumber, setSlideNumber ] = useState<number>(0);

    const { colors } = useTheme();

    const grouped = useMemo(() => {
        const sortingHandler = <Object, Key>(list:Object[], keyGetter:(e:Object) => Key) => {
            const map = new Map<Key, Object[]>();

            list.forEach((item) => {
               const key = keyGetter(item);
               const collection = map.get(key);
               
               if (!collection) {
                    map.set(key, [ item ]) 
               } else {
                   collection.push(item);
               }
            });

            let arrayMap: { key: Key, value:  Object[];}[] = [];
            map.forEach((value, key) => {
                arrayMap.push({ key, value });
            });

            arrayMap = arrayMap.filter(({ value, key }) => value.length > 1); 
            return arrayMap;
        }
    
        return sortingHandler<IAssignment, string>(assignments, (e) => e.category.toLowerCase());
    }, [ assignments ]);

    const handleScrollEnd = (e:NativeSyntheticEvent<NativeScrollEvent>) => {
        const { targetContentOffset, layoutMeasurement } = e.nativeEvent; 
        const slideWidth = layoutMeasurement.width; 
        const sliderOffset = targetContentOffset?.x;

        if (sliderOffset === undefined) return; 

        const currentSlide = Math.floor(sliderOffset / slideWidth); 
        setSlideNumber(currentSlide);
    };

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
            { grouped.map(({ key, value }, index) => {
                return <GradeSlide key={index} category={key} value={value} />
            })}
            </ScrollView>
            <View style={ styles.dots }>
                {
                    new Array(grouped.length).fill(0).map((_, index) => {
                        return (
                            <View 
                                key={index} 
                                style={[ 
                                    styles.dot, 
                                    index === slideNumber ?  { backgroundColor: colors.primary } : null 
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
    slide: {
        width: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden',
    },
    category: {
        textAlign: 'right',
        marginBottom: 7.5,
    },
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

export default GradeGraphSlider; 