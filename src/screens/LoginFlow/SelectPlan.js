/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { COLORS, PADDING, WIDTH } from '../../constants/theme';
import { ICONS } from '../../constants/Icons';
import { defaultStyles } from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import { Plans } from '../../constants/Static';
import GradientBox from '../../components/GradientBox';
import GradientButton from '../../components/GradientButton';
import { fetchPlans, fetchProfile } from '../../apiConfig/Services';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, transactions } from '../../reduxSlice/apiSlice';

const SelectPlan = () => {
  const plansData = useSelector((state) => state.planData?.planManagemetData);
  console.log("dropDownDatadropDownData", plansData);
  const navigation = useNavigation();
  const [activePlan, setActivePlan] = React.useState(0);
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const nextHandler = async () => {
    // Validate plan selection
    if (!activePlan || !activePlan.id) {
      console.error('No plan selected or plan missing ID:', activePlan);
      return;
    }

    // Log plan data for debugging
    console.log('Selected plan data:', {
      plan: activePlan,
      plan_id: activePlan.id,
      cost: activePlan.cost,
      no_of_days: activePlan.no_of_days,
      plan_title: activePlan.plan_title
    });

    navigation.navigate('SelectMethod', {
      plan: activePlan,
      totalAmount: activePlan?.cost,
      // selectedHours: activePlan?.no_of_days,
      paymentType: 'subscription'  // Add payment type for consistency
    });
    return;


    try {
      const response = await dispatch(transactions({ plan_id: activePlan }))
      console.log("response-->", response);
      if (response?.success) {
        navigation.navigate('CreateProfile');
      }
    } catch (error) {
      console.log("response-->error", error);
    }
    // navigation.navigate('CreateProfile');
  };

  useEffect(() => {
    if (isFocused) {
      fetchPlans(dispatch);
      fetchProfile(dispatch)
      // dispatch(getProfile());
    }

  }, [isFocused, dispatch])




  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <KeyboardAvoidingScrollView>
        <View style={styles.displayFlex}>
          <Image source={ICONS.LOGO} style={styles.logo} />
          <Text style={{ ...defaultStyles.buttonTextSmall, marginLeft: 10 }}>
            {'Professional \nCompanionship'}
          </Text>
        </View>
        <View
          style={{
            width: WIDTH * 0.96,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              ...defaultStyles.header,
              ...styles.heading,
              color: COLORS.black,
              marginBottom: 0,
              marginTop: 20,
            }}>
            Create Profile with
          </Text>
          <Text
            style={{
              ...defaultStyles.header,
              ...styles.heading,
              marginTop: 0,
              marginBottom: PADDING.small,
            }}>
            Professional Companionship
          </Text>
          <View
            style={{
              alignSelf: 'center',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {plansData?.map((item, index) => (
              <Pressable onPress={() => setActivePlan(item)}>
                <GradientBox
                  item={item}
                  activeColor={activePlan?.id === item?.id ? true : false}
                  heightBox={200}
                  length={WIDTH * 0.9}
                  activePlan={activePlan?.id}
                  buttonMainStyle={{ marginTop: PADDING.large }}
                  textColor={activePlan?.id === item?.id ? COLORS.white : COLORS.black}
                />
              </Pressable>
            ))}
          </View>

          <View style={{ marginTop: PADDING.small }}>
            <GradientButton label={'Buy Plan'} onClick={nextHandler} buttonMainStyle={{ width: WIDTH * 0.9, alignSelf: 'center', marginTop: PADDING.extralarge }} />
          </View>
        </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  displayFlex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: PADDING.medium,
    paddingTop: PADDING.medium,
  },
  heading: {
    color: COLORS.mainColor,
    marginTop: PADDING.medium,
    marginBottom: PADDING.small,
    paddingLeft: 10,
  },
  img: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  containerStyle: {
    width: WIDTH * 0.9,
    alignSelf: 'center',
    height: 269,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: PADDING.large,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgstyle: {
    height: 68,
    width: 68,
    resizeMode: 'contain',
    marginTop: PADDING.small,
  },
});

export default SelectPlan;
