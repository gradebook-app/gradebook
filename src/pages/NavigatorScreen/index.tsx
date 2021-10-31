import "react-native-gesture-handler";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import GradesScreen from "../GradesScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBook, faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "react-native-paper";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import AccountScreen from "../AccountScreen";

type TabIconProps = {
    focused: boolean,
    iconSize?: number,
    icon: IconProp,
}

const TabIcon : React.FC<TabIconProps> = ({ focused, iconSize, icon, ...props }) => {
    const size = iconSize || 25; 
    const { colors } = useTheme();
    const color = focused ? colors.primary : "rgba(0, 0, 0, 0.15)";

    return (
        <FontAwesomeIcon 
            color={color}
            size={size} 
            icon={icon} 
            { ...props } 
        />
    )
}

type INavigatorScreenProps = {
    navigation: any,
}

const NavigatorScreen : React.FC<INavigatorScreenProps> = ({ navigation, ...props }) => {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator 
            initialRouteName="Grades"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    switch(route.name) {
                        case "Grades": {
                            return <TabIcon icon={faBook} focused={focused} />
                        }
                        case "Schedule": {
                            return <TabIcon icon={faCalendarAlt} focused={focused} />
                        }
                        case "Account": {
                            return <TabIcon icon={faUser} focused={focused} />
                        }
                        default: {
                            return; 
                        }
                    }
                },
                headerShown: false,
                tabBarLabel: '',
                tabBarIconStyle: {
                    marginTop: 15,
                }
                })}
            >
            <Tabs.Screen 
                name="Grades" 
                children={() => <GradesScreen navigation={navigation} { ...props } />}
            />
            {/* <Tabs.Screen 
                name="Schedule" 
                children={() => <GradesScreen navigation={navigation} { ...props } />}
            /> */}
             <Tabs.Screen 
                name="Account" 
                children={() => <AccountScreen navigation={navigation} { ...props } />}
            />
        </Tabs.Navigator>
    )
}  



export default NavigatorScreen;