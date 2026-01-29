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
import {detailsData, ServiceData} from '../../constants/Static';
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

const Opition = () => {
  const profileData = useSelector(state => state.profile);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const dropDownData = useSelector(state => state.dropDown);

  // Helper function to normalize services data (string/array to array)
  const normalizeServices = (services) => {
    if (!services) return [];

    // If it's already an array, return as is (filter out empty values)
    if (Array.isArray(services)) {
      return services.filter(service => service && service.toString().trim() !== '');
    }

    // If it's a string, handle different formats
    if (typeof services === 'string') {
      const trimmed = services.trim();
      if (trimmed === '') return [];

      // Handle comma-separated values like "37,42"
      if (trimmed.includes(',')) {
        return trimmed.split(',').map(s => s.trim()).filter(s => s !== '');
      }

      // Single value like "37"
      return [trimmed];
    }

    // Fallback for other types
    return [];
  };

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

  // Get normalized services data with fallback sources
  const getInitialServices = () => {
    // Try multiple data sources in priority order
    const servicesFromProfile = profileData?.user_profile?.services;
    const servicesFromProfileService = profileData?.user_profile_service;

    // Use the first available source
    const servicesData = servicesFromProfile || servicesFromProfileService;

    return normalizeServices(servicesData);
  };

  console.log('profileData services:', profileData?.user_profile?.services);
  console.log('normalized services:', getInitialServices());

  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: COLORS.white, padding: 5, flex: 1}}
      contentContainerStyle={{
        paddingBottom: PADDING.extralarge,
        backgroundColor: COLORS.white,
      }}>
      <Formik
        initialValues={{
          services: getInitialServices(),
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
            }}>

            <Text
              style={{
                ...defaultStyles.header,
                color: COLORS.mainColor,
                alignSelf: 'flex-start',
                width: '100%',
                marginVertical: PADDING.small,
                paddingTop: 10,
                marginHorizontal: 10,
              }}>
              Services
            </Text>
            {console.log(" initialValues ",values)}
            {ServiceData?.map(item => (
              <View style={{width: '100%'}} key={item?.label}>
                {item?.labelShow && (
                  <Text style={styles.label}>{item?.label}</Text>
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
                    data={dropDownData?.[item?.label]?.array}
                    containerStyle={{width: '92%'}}
                  />
                ) : (
                  <Select
                    key={item?.label}
                    label={item?.labelShow ? null : item?.label}
                    placeholder={item?.placeholder}
                    name={item?.name}
                    data={dropDownData?.[item?.label]?.array}
                    containerStyle={{width: '92%'}}
                  />
                )}
              </View>
            ))}
            <ButtonWrapper
              onClick={handleSubmit}
              label={'Update'}
              buttonMainStyle={{alignSelf: 'flex-end', width: '36%'}}
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
