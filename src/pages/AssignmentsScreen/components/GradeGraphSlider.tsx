import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTheme } from 'react-native-paper';
import GradeChart from '../../../components/GradeChart';
import { useAppearanceTheme } from '../../../hooks/useAppearanceTheme';
import { useCategoryColor } from '../../../hooks/useCategoryColor';
import { IAssignment } from '../../../store/interfaces/assignment.interface';
import Slider from "../../../components/Slider";

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
    const { theme } : any = useTheme();

    const formattedCategory = useMemo(() => {
        return `${category.substring(0, 1).toUpperCase()}${category.substring(1)}` 
    }, [ category ]);

    const categoryColor = useCategoryColor(category);

    return (
        <View style={[ styles.slide, { backgroundColor: theme.background } ]}>
           <View>
                <Text style={[ styles.category, { color: categoryColor } ]}>{ formattedCategory } Progess</Text>
                <GradeChart stroke={categoryColor} data={points} />
           </View>
        </View>
    )
}

const GradeGraphSlider : React.FC<GradeGraphSliderProps> = ({ assignments }) => {
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

    return (
        <>
            <Slider>
                { grouped.map(({ key, value }, index) => {
                    return <GradeSlide key={index} category={key} value={value} />
                })}
            </Slider>
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
});

export default GradeGraphSlider; 