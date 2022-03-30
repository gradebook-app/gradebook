import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import MaskedView from "@react-native-community/masked-view";
import LinearGradient from "react-native-linear-gradient";
    
interface GradientTextProps {
    style?: StyleProp<TextStyle>,
    children: string,
    colors: string[],
    end?: number,
}

const GradientText : React.FC<GradientTextProps> = ({ colors, end=1, ...props }) => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: end || 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;