/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GradientWrapper from '../../components/GradientWrapper';
import {Card} from 'react-native-paper';
import {COLORS, HEIGHT, PADDING, WIDTH} from '../../constants/theme';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {saveProfile} from '../../reduxSlice/apiSlice';
import ScreenLoading from '../../components/ScreenLoading';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import membershipService, { PROFILE_TYPES, MEMBER_STATUS } from '../../services/MembershipService';
import { getUserData } from '../../utils/authHelpers';

const Final = () => {
  const routes = useRoute();
  const data = routes?.params?.value;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [step, setStep] = useState(data ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const handleSubmit = () => {
    navigation.navigate('Submit');
  };
  const heading = {
    ...defaultStyles.header,
    color: COLORS.mainColor,
    fontSize: 20,
  };
  const heading1 = {
    ...defaultStyles.header,
    color: COLORS.black,
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
    // padding: PADDING.medium,
  };

  const nextHandler = async () => {
    //
    // navigation.navigate('Contact');
    setLoading(true);
    try {
      const response = await dispatch(saveProfile());
      if (response?.status === 1) {
        await AsyncStorage.setItem('account_step', '8'); // Save progress

        // Check if this is a Member who has paid for a plan
        const userData = await getUserData();
        if (userData?.profile_type === '2' || userData?.profile_type === 2) {
          // Member profile type
          const membershipData = await membershipService.getMembershipStatus();
          if (membershipData?.is_plan_paid === true) {
            // Member has paid, update status to Active since registration is complete
            const updatedData = {
              ...membershipData,
              is_user_can_logged_in: MEMBER_STATUS.ACTIVE,
              is_plan_paid: undefined, // Remove the temporary flag
              account_step: 8,
              status: true
            };
            await membershipService.storeMembershipData(updatedData);
            membershipService.membershipData = updatedData;
            membershipService.notifyListeners();
          }
        }

        setStep(1);
      }
    } catch (error) {
      // console.log('response->nextHandler', error);
    } finally {
      setLoading(false);
    }
  };

  const getServicesHandler = async () => {
    // console.log("id",id)
    try {
      const response = await axios({
        method: 'get',
        url: `https://thecompaniondirectory.com/services`,
      });
      if (response?.status === 200) {
        // setStates(data);
      }
      console.log('getStatehandler resposne-->', response);
    } catch (error) {
      console.log('getStatehandler resposne-->', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getServicesHandler();
    }
    if (data == 1) {
      setStep(1);
    }
  }, [isFocused, data]);

  return (
    <GradientWrapper>
      <Card
        mode="contained"
        style={{
          ...styles.cardStyle,
          height: step === 0 ? HEIGHT * 0.425 : HEIGHT * 0.345,
        }}
        contentStyle={styles.cardConatinStyle}>
        {step === 0 && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              borderBottomColor: COLORS.boxColor,
              borderBottomWidth: 1,
              padding: PADDING.large,
            }}>
            <Text style={heading}>Finish</Text>
            <Text
              style={{...defaultStyles.placeholderStyle, color: COLORS.black}}>
              Step 6 of 6
            </Text>
          </View>
        )}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: PADDING.small,
            paddingTop: step === 0 ? PADDING.medium : PADDING.extralarge,
          }}>
          <Text style={heading1}>
            {step === 0
              ? 'Submit your Profile'
              : 'Profile Submitted, under review'}
          </Text>

          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
              marginVertical: PADDING.small,
            }}>
            By submitting your profile it will go into moderation.
          </Text>
          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
              lineHeight: 22,
              textAlign: 'center',
              paddingHorizontal: PADDING.medium,
            }}>
            Once your profile is approved, you will receive a confirmation email
            about your payment and your profile will go online within 24 hours.
          </Text>
          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.mainColor,
              marginTop: PADDING.small,
              marginVertical: PADDING.medium,
              paddingHorizontal: PADDING.medium,
              textAlign: 'center',
              lineHeight: 22,
            }}>
            {
              'You will then have the ability to access and edit all \n aspects of your profile.'
            }
          </Text>
          {(step == 0 || step == 1) && (
            <ButtonWrapper
              label={'Submit'}
              onClick={() => {
                step === 0 ? nextHandler() : handleSubmit();
              }}
            />
          )}
        </View>
      </Card>
      <ScreenLoading loader={loading} />
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  cardStyle: {
    backgroundColor: COLORS.white,
    height: HEIGHT * 0.425,
    width: WIDTH * 0.9,
    alignSelf: 'center',
    borderColor: COLORS.white,
    borderWidth: 0,
    // flex:1
  },
  cardConatinStyle: {
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});

export default Final;
