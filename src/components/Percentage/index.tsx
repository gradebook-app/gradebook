import React from 'react';
import { StyleProp, TextStyle, Text } from 'react-native';
import { useGradeColor } from '../../hooks/useGradeColor';
import { useLetterColor } from '../../hooks/useLetterColor';
import GradientText from '../GradientText';

interface PercentageProps {
    grade: number | string,
    label: string | number,
    style?: StyleProp<TextStyle>,
}

const Percentage : React.FC<PercentageProps> = ({ grade = 0, label, style }) => {
    const gradeColor = useGradeColor(parseInt(grade as any));
    const letterColor = useLetterColor(grade as any);

    return (
        <>
            {
               grade > 100 ? (
                <GradientText style={ style } colors={['#32FF8C', '#32F6FF']}>{ label.toString() }</GradientText>
               ) :  <Text style={[ style, { color: letterColor ?? gradeColor} ]}>{ label }</Text>
           }
        </>
    )
}

export default Percentage;