/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import { COLORS, HEIGHT, IOS, PADDING, WIDTH } from '../../constants/theme';
import { ICONS } from '../../constants/Icons';
import { defaultStyles } from '../../constants/Styles';
import { useNavigation } from '@react-navigation/native';
import OutlinedButton from '../../components/OutlinedButton';
import GradientButton from '../../components/GradientButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAPIs, fetchProfile } from '../../apiConfig/Services';
import { search } from '../../reduxSlice/apiSlice';
import { getPostLoginNavigation, ROUTES } from '../../utils/navigationHelper';
import { getUserData } from '../../utils/authHelpers';

const SplashScreen = () => {
  const profileData = useSelector(state => state.profile?.user_profile);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Call public APIs immediately (no token needed)
    fetchAllAPIs(dispatch);

    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('ChapToken');
        const account_step = await AsyncStorage.getItem('account_step');
        const userData = await AsyncStorage.getItem('userData');
        console.log("Token Chap-->", account_step)
        console.log("Token Chap-->account_step", account_step)
        console.log("Token Chap-->userData", userData)


        if (token) {
          // Only call authenticated APIs if token exists
          fetchProfile(dispatch);
          dispatch(search({
            city: null,
            category: null,
            filter_type: null,
            page: 1,
            page_size: 32
          }));

          // Navigation logic for logged-in users
          setTimeout(async () => {
            console.log('Account Step splash:', account_step);

            try {
              // First try to get stored userData, then fall back to Redux profileData
              const storedUserData = await getUserData();
              console.log('Stored user data:', storedUserData);

              let userDetails;

              if (storedUserData) {
                // Use stored userData as primary source
                userDetails = {
                  account_step: parseInt(account_step) || storedUserData.account_step || 0,
                  is_plan_purchased: storedUserData.is_plan_purchased || false,
                  profile_type: parseInt(storedUserData.profile_type) || storedUserData.profile_type,
                  status: storedUserData.status || false,
                  is_user_can_logged_in: storedUserData.is_user_can_logged_in
                };
              } else if (profileData) {
                // Fall back to Redux profileData
                userDetails = {
                  account_step: parseInt(account_step) || profileData.account_step || 0,
                  is_plan_purchased: profileData.is_plan_purchased,
                  profile_type: parseInt(profileData.profile_type) || profileData.profile_type,
                  status: profileData.status,
                  is_user_can_logged_in: profileData.is_user_can_logged_in
                };
              } else {
                // Last resort fallback
                console.log('No user data available, redirecting to Home');
                navigation.reset({
                  index: 0,
                  routes: [{ name: ROUTES.HOME }],
                });
                return;
              }

              const destination = getPostLoginNavigation(userDetails, navigation);
              console.log('Navigation destination:', destination, 'User details:', userDetails);

              // Special case for Final screen that needs parameters
              if (destination === 'Final') {
                navigation.reset({
                  index: 0,
                  routes: [{
                    name: destination,
                    params: { value: userDetails?.status || 2 }
                  }],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: destination }],
                });
              }
            } catch (error) {
              console.error('Error in navigation logic:', error);
              // Fallback to home on error
              navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.HOME }],
              });
            }
          }, 3000); // 3-second delay
        } else {
          // For new users, skip authenticated API calls and go to GetStarted
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'GetStarted' }],
            });
          }, 3000); // 3-second delay
        }
      } catch (error) {
        console.error('Token check error:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'GetStarted' }],
        });
      }
    };

    checkToken();
  }, [navigation, dispatch]);
  return (
    <>
      {/* <SafeAreaView style={{backgroundColor:COLORS.white}}/> */}
      <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={styles.displayFlex}>
            <Image source={ICONS.LOGO} style={styles.logo} />
            {/* <Text
              style={{
                ...defaultStyles.buttonTextSmall,
                marginLeft: 10,
                fontSize: 24,
                textAlign: 'center',
                marginTop: -10,
                lineHeight: 24,
              }}>
              {'Professional \nCompanionship'}
            </Text> */}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: WIDTH * 0.3,
    height: WIDTH * 0.3,
    resizeMode: 'contain',
  },
  displayFlex: {
    // backgroundColor:'red',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    paddingHorizontal: PADDING.medium,
    // paddingTop: PADDING.medium,
    backgroundColor: COLORS.white,
    // paddingBottom:PADDING.small
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
    height: HEIGHT * 0.46,
    width: WIDTH * 0.92,
    resizeMode: 'cover',
    alignSelf: 'center',
    // marginHorizontal:PADDING.medium,
    marginTop: PADDING.small,
  },
});

export default SplashScreen;
