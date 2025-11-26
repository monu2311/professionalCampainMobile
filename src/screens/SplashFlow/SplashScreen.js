/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image, SafeAreaView} from 'react-native';
import {COLORS, HEIGHT, IOS, PADDING, WIDTH} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import {useNavigation} from '@react-navigation/native';
import OutlinedButton from '../../components/OutlinedButton';
import GradientButton from '../../components/GradientButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllAPIs, fetchProfile} from '../../apiConfig/Services';

const SplashScreen = () => {
  const profileData = useSelector(state => state.profile?.user_profile);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProfile(dispatch);
    fetchAllAPIs(dispatch);
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('ChapToken');
        const account_step = await AsyncStorage.getItem('account_step');
        // console.log('account_step', account_step);
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: 'Home'}],
        // });
        setTimeout(() => {
          if (token) {
            switch (account_step) {
              case '8':
              case '7':
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                });
                break;
              default:
                navigation.reset({
                  index: 0,
                  routes: [{name: 'CreateProfile1'}],
                });
                break;
            }
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'GetStarted'}],
            });
          }
        }, 3000); // 2-second delay
      } catch (error) {
        console.error('Token check error:', error);
        navigation.reset({
          index: 0,
          routes: [{name: 'GetStarted'}],
        });
      }
    };

    checkToken();
  }, [navigation, dispatch]);
  return (
    <>
      {/* <SafeAreaView style={{backgroundColor:COLORS.white}}/> */}
      <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.displayFlex}>
            <Image source={ICONS.LOGO} style={styles.logo} />
            <Text
              style={{
                ...defaultStyles.buttonTextSmall,
                marginLeft: 10,
                fontSize: 24,
                textAlign: 'center',
                marginTop: -10,
                lineHeight: 24,
              }}>
              {'Professional \nCompanionship'}
            </Text>
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
