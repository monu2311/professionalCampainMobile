/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY} from '../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import {ICONS} from '../../constants/Icons';
import ButtonWrapper from '../../components/ButtonWrapper';
import {defaultStyles} from '../../constants/Styles';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Faq from './Faq';
import { useSelector } from 'react-redux';
import PackageScreen from './PackageScreen';

const Tab = createMaterialTopTabNavigator();


const CustomTabBar = ({state, descriptors, navigation, position}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.boxColor, // Bottom underline color
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

        const isFocused = state.index === index;

        return (
          <Pressable
            key={index}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
              borderBottomColor: isFocused ? COLORS.mainColor : 'transparent',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate(route.name)}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isFocused ? '#0057B7' : 'gray',
                fontFamily: TYPOGRAPHY.DMSERIF,
                // textDecorationLine: isFocused ? 'underline' : 'none',
              }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const AdvertisingRate = () => {

  const plansData = useSelector((state)=>state.planData?.plans);

  return (
    <View
      style={{backgroundColor: COLORS.white, padding: 5, flex: 1,paddingHorizontal:16}}
     
    >
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Packages" component={PackageScreen} />
        <Tab.Screen name="FAQ" component={Faq} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  flexstyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PADDING.medium,
    paddingHorizontal: PADDING.large,
  },
  circleBox: {
    backgroundColor: COLORS.mainColor,
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdvertisingRate;
