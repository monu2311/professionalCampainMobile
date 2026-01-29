/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {
  COLORS,
  HEIGHT,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
// import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {detailsData} from '../../constants/Static';
import Select from '../../components/Select';
import CustomTextInput from '../../components/CustomTextInput';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {setProfile} from '../../reduxSlice/profileSlice';
import {UpdateProfile} from '../../reduxSlice/apiSlice';
import {useDispatch, useSelector} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import axios from 'axios';
import {fetchAllAPIs} from '../../apiConfig/Services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiDropDown from '../../components/MultiDropDown';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';
import { useLanguageContext } from '../../localization/LanguageProvider';
import { getFlexDirection, getJustifyContent, getTextAlign, getWritingDirection } from '../../localization/RTLProvider';

const Opition = () => {
  const profileData = useSelector(state => state.profile);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const dropDownData = useSelector(state => state.dropDown);
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.COMMON]);
  const { isRTL, currentLanguage, forceUpdate } = useLanguageContext();

  // Listen for language changes
  useEffect(() => {
    console.log(`🎯 Option Screen: Language changed to ${currentLanguage}, RTL: ${isRTL}`);
  }, [currentLanguage, isRTL, forceUpdate]);

  // Dynamic ServiceData with translations
  const localizedServiceData = [
    {
      label: t('screens:profile.serviceOptions.services'),
      placeholder: t('screens:profile.serviceOptions.servicesPlaceholder'),
      name: 'services',
      labelShow: false,
      multi: true,
      value:"Services"
    },
    {
      label: t('screens:profile.serviceOptions.interest'),
      placeholder: t('screens:profile.serviceOptions.interestPlaceholder'),
      name: 'interests',
      labelShow: false,
      textInputShow: true,
    },
    {
      label: t('screens:profile.serviceOptions.favouriteThings'),
      placeholder: t('screens:profile.serviceOptions.favouriteThingsPlaceholder'),
      name: 'favourite_things',
      labelShow: false,
      textInputShow: true,
    },
    {
      label: t('screens:profile.serviceOptions.wishList'),
      placeholder: t('screens:profile.serviceOptions.wishListPlaceholder'),
      name: 'wishlist',
      labelShow: false,
      textInputShow: true,
    },
  ];

  const route = useRoute();
  console.log('jklasdlkad', route);
  const submitHandler = async value => {
 
    try {
      setLoader(true);
      const formdata = new FormData();
      for (const key in value) {
        if (key == 'interests') {
          formdata.append(key, value[key]);
        }  else if (Array.isArray(value[key])) {
          formdata.append(key, value[key].join(','));
        } else {
          formdata.append(key, [value[key]]);
        }
      }
   
      route.name == 'Optional' && formdata.append('is_editing', true);
      // formdata.append('booking_preference', 3);
      dispatch(setProfile({user_profile: value}));

      console.log('FormData--->', formdata);
      const response = await dispatch(UpdateProfile(formdata, {step: 6}));
      console.log('success--->', response);
      if (response?.status === 200) {
        if (route.name === 'Optional') {
          navigation?.goBack(); // Go back if editing
        } else {
          await AsyncStorage.setItem('account_step', '6'); // Save progress
          navigation.navigate('Final'); // Go to next step
        }
      }
    } catch (error) {
      console.log('error--->', error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllAPIs(dispatch); // Pass dispatch to fetchAllAPIs
    };
    fetchData();
  }, [dispatch]);

  return (
    <KeyboardAwareScrollView
      style={{
        backgroundColor: COLORS.white,
        padding: 5,
        flex: 1,
        writingDirection: getWritingDirection(isRTL),
      }}
      contentContainerStyle={{
        paddingBottom: PADDING.extralarge,
        backgroundColor: COLORS.white,
        flexDirection: getFlexDirection(isRTL, 'column'),
      }}>
      <Formik
        initialValues={{
          services: profileData?.user_profile?.services || '',
          interests: profileData?.user_profile?.interests || '',
          favourite_things: profileData?.user_profile?.favourite_things || '',
          wishlist: profileData?.user_profile?.wishlist || '',
        }}
        onSubmit={values => submitHandler(values)}>
        {({handleSubmit, values, handleChange, setFieldValue}) => (
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              backgroundColor: COLORS.white,
              flexDirection: getFlexDirection(isRTL, 'column'),
            }}>

            <Text
              style={{
                ...defaultStyles.header,
                color: COLORS.mainColor,
                alignSelf: getJustifyContent(isRTL, 'flex-start'),
                width: '100%',
                marginVertical: PADDING.small,
                paddingTop: 10,
                marginHorizontal: 10,
                textAlign: getTextAlign(isRTL),
                writingDirection: getWritingDirection(isRTL),
              }}>
              {t('screens:profile.serviceOptions.title')}
            </Text>
            {console.log(" initialValues ",values)}
            {localizedServiceData?.map(item => (
              <View style={{
                width: '100%',
                flexDirection: getFlexDirection(isRTL, 'column'),
              }} key={item?.label}>
                {item?.labelShow && (
                  <Text style={{
                    ...styles.label,
                    textAlign: getTextAlign(isRTL),
                    writingDirection: getWritingDirection(isRTL),
                  }}>{item?.label}</Text>
                )}
                {item?.textInputShow ? (
                  <CustomTextInput
                    key={item?.label}
                    label={item?.labelShow ? null : item?.label}
                    placeholder={item?.placeholder}
                    name={item?.name}
                    inputContainer={{
                      height: item?.area ? 140 : 46,
                      alignItems: 'flex-start',
                    }}
                  />
                ) : item?.multi ? (
                  <MultiDropDown
                    key={item?.label}
                    label={item?.labelShow ? null : item?.label}
                    placeholder={item?.placeholder}
                    name={item?.name}
                    data={dropDownData?.[item?.value]?.array}
                    containerStyle={{
                      width: '92%',
                      alignSelf: getJustifyContent(isRTL, 'center'),
                    }}
                  />
                ) : (
                  <Select
                    key={item?.label}
                    label={item?.labelShow ? null : item?.label}
                    placeholder={item?.placeholder}
                    name={item?.name}
                    data={dropDownData?.[item?.label]?.array}
                    containerStyle={{
                      width: '92%',
                      alignSelf: getJustifyContent(isRTL, 'center'),
                    }}
                  />
                )}
              </View>
            ))}
            <ButtonWrapper
              onClick={handleSubmit}
              label={t('common:buttons.update')}
              buttonMainStyle={{alignSelf: getJustifyContent(isRTL, 'flex-end'), width: '36%'}}
            />
          </View>
        )}
      </Formik>
      <ScreenLoading loader={loader} />
    </KeyboardAwareScrollView>
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
  addStyles: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  deletedtyles: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 16,
  },
  boxStyles: {
    width: WIDTH * 0.416,
    height: HEIGHT * 0.18,
    backgroundColor: COLORS.boxColor,
    borderRadius: 8,
  },
  label: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontSize: 12,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    width: '94%',
    marginTop: 5,
    paddingTop: 10,
  },
  viewStyle: {
    alignSelf: 'center',
    width: '94%',
  },
});

export default Opition;
