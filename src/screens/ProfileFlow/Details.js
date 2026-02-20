/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  COLORS,
  HEIGHT,
  IOS,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
// import {ICONS} from '../../constants/Icons';
import { defaultStyles } from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {
  COUNTRYLIST,
  detailfirst,
  detailSecond,
  profileCategory,
} from '../../constants/Static';
import Select from '../../components/Select';
import CustomTextInput from '../../components/CustomTextInput';
import { Formik } from 'formik';
import RichTextEditor from '../../components/RichTextEditor';
import axios from 'axios';
import MultiDropDown from '../../components/MultiDropDown';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateProfile } from '../../reduxSlice/apiSlice';
import { setProfile } from '../../reduxSlice/profileSlice';
import ScreenLoading from '../../components/ScreenLoading';
import { fetchAllAPIs } from '../../apiConfig/Services';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {RichEditor} from 'react-native-pell-rich-editor';

const Details = () => {
  const formikRef = useRef();
  const profileData = useSelector(state => state?.profile || {});
  // console.log('profileDataprofileData', profileData);
  const dropDownData = useSelector(state => state?.dropDown || {});
  const navigation = useNavigation();
  const route = useRoute();
  const [loader, setLoader] = useState(false);
  const [userProfileType, setUserProfileType] = useState(null);
  const dispatch = useDispatch();

  const submitHanlder = async value => {
    try {
      setLoader(true);
      const formdata = new FormData();
      formdata.append('is_editing', true);
      for (const key in value) {
        // Skip companion_price for non-companions
        if (key === 'companion_price' && userProfileType !== 1 && userProfileType !== "1") {
          continue;
        }

        if (key === 'profile_categories') {
          formdata.append('profile_categories', value[key].join(','));
        } else if (key === 'height') {
          formdata.append('height', parseInt(value.height, 10)); // Convert to integer
        } else {
          // Handle array-to-comma string conversion for keys like "day"
          if (Array.isArray(value[key])) {
            formdata.append(key, value[key].join(','));
          } else {
            formdata.append(key, value[key]);
          }
        }
      }
      formdata.append('booking_preference', 3);

      console.log('FormData--->', formdata);
      // return;
      const response = await dispatch(UpdateProfile(formdata, { step: 4 }));
      console.log('success--->', response);
      if (response?.status === 200) {
        dispatch(
          setProfile({ user_profile: { ...profileData?.user_profile, ...value } }),
        );

        if (route.name === 'EditDetails') {
          navigation?.goBack(); // Go back if editing
        } else {
          await AsyncStorage.setItem('account_step', '4'); // Save progress
          navigation.navigate('Contact'); // Go to next step
        }
      }
    } catch (error) {
      console.log('Details submit error--->', error);
      // Show user-friendly error message
      Alert.alert(
        'Update Failed',
        'Unable to update profile details. Please check your information and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoader(false);
    }
  };

  const [states, setStates] = useState([]);

  const getStateHandler = useCallback(async id => {
    // console.log("id",id)
    try {
      const response = await axios({
        method: 'get',
        url: `https://thecompaniondirectory.com/states/${id}`,
      });
      if (response?.status === 200) {
        const data = response?.data?.map(Item => ({
          value: Item?.id?.toString(),
          item: Item.name,
        }));
        setStates(data);
        const suburbId = profileData?.user_profile?.suburbs;
        console.log('sdsadsad', typeof suburbId);
        if (suburbId && data.some(d => d.value === suburbId)) {
          formikRef.current?.setFieldValue('hdn_suburbs', suburbId);
        }
      }
      console.log('getStatehandler resposne-->', response);
    } catch (error) {
      console.log('getStatehandler resposne-->', error);
    }
  }, [profileData?.user_profile?.suburbs]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllAPIs(dispatch); // Pass dispatch to fetchAllAPIs
      } catch (error) {
        console.log('Error fetching APIs:', error);
      }
    };

    try {
      if (profileData?.user_profile?.homelocation) {
        getStateHandler(profileData?.user_profile?.homelocation);
      }
      fetchData();
    } catch (error) {
      console.log('Error in Details useEffect:', error);
    }
  }, [dispatch, profileData?.user_profile, getStateHandler]);

  // Get user profile type for conditional rendering
  useEffect(() => {
    const getUserProfileType = async () => {
      // Try to get from Redux state first
      let profileType = profileData?.user_profile?.profile_type;

      // If not in Redux, try AsyncStorage
      if (!profileType) {
        try {
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            profileType = parsedData?.profile_type ||
                         parsedData?.user?.profile_type ||
                         parsedData?.data?.profile_type;
          }
        } catch (error) {
          console.log('Error getting user profile type:', error);
        }
      }

      setUserProfileType(profileType);
    };

    getUserProfileType();
  }, [profileData]);

  const profileCategoires = profileData?.profile_category && Array.isArray(profileData.profile_category)
    ? profileData.profile_category
      .map((item) => item?.category_id?.toString())
      .filter(Boolean) // Remove null/undefined values
    : [];

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: COLORS.white, padding: 5 }}
      contentContainerStyle={{
        paddingBottom: PADDING.large,
        backgroundColor: COLORS.white,
      }}
      behavior={IOS ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: PADDING.extralarge }}
        showsVerticalScrollIndicator={false}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            homelocation: profileData?.user_profile?.homelocation || '',
            hdn_suburbs: '',
            postal_code: profileData?.user_profile?.postal_code || '',
            profile_name: profileData?.user_profile?.profile_name || '',
            age: profileData?.user_profile?.age?.toString() ?? '',
            height: profileData?.user_profile?.height
              ? profileData?.user_profile?.height + ' CM'
              : '',
            bust: profileData?.user_profile?.bust || '',
            dress_size: profileData?.user_profile?.dress_size || '',
            body_type: profileData?.user_profile?.body_type || '',
            hair_color: profileData?.user_profile?.hair_color || '',
            eyes: profileData?.user_profile?.eyes || '',
            hair_style: profileData?.user_profile?.hair_style || '',
            about_me: profileData?.user_profile?.about_me || '',
            education: profileData?.user_profile?.education || '',
            ethnicity: profileData?.user_profile?.ethnicity || '',
            gender_value: profileData?.user_profile?.gender_value || '',
            lifestyle_conditions:
              profileData?.user_profile?.lifestyle_conditions || '',
            preferred_events: profileData?.user_profile?.preferred_events || '',
            events_not_preferred:
              profileData?.user_profile?.events_not_preferred || '',
            listed_cities: profileData?.user_profile?.listed_cities || '',
            booking_preference:
              profileData?.user_profile?.booking_preference ?? 3,
            my_reviews: profileData?.user_profile?.my_reviews || ' ',
            profile_categories: profileCategoires || [],
            companion_price: profileData?.user_profile?.companion_price?.toString() || '',
            interestedBooking: profileData?.user_profile?.interestedBooking || '',
          }}
          enableReinitialize={true}
          onSubmit={values => submitHanlder(values)}>
          {({ handleSubmit, values, handleChange, setFieldValue }) => (
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                backgroundColor: COLORS.white,
              }}>
              {/*  What is your Home Base City   */}
              {/* {console.dir(values)} */}
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
                What is your Home Base City
              </Text>
              <Select
                label="Select Country"
                placeholder="Select Country"
                name="homelocation"
                data={COUNTRYLIST}
                onCountryChange={getStateHandler}
                containerStyle={{ width: WIDTH * 0.91 }}
              />
              <Select
                label="Select City"
                placeholder="Select City"
                name="hdn_suburbs"
                data={states}
                containerStyle={{ width: WIDTH * 0.91 }}
              />
              <CustomTextInput
                key={'Postal code'}
                label={'Postal code'}
                placeholder={'Postal code'}
                name={'postal_code'}
              />

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
                Details
              </Text>

              {detailfirst?.map(item =>
                item?.Select ? (
                  <Select
                    key={item?.label}
                    label={item?.label}
                    placeholder={item?.placeholder}
                    name={item?.name}
                    data={dropDownData?.[item?.label]?.array}
                    containerStyle={{ width: '92%' }}
                  />
                ) : (
                  <CustomTextInput
                    key={item?.label}
                    label={item?.label}
                    placeholder={item?.placeholder}
                    name={item?.name}
                  />
                ),
              )}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: 'space-between',
                  width: '100%',
                  flexWrap: 'wrap',
                }}>

                {/* Only show companion price for companions (profile_type 1) */}
                {(userProfileType === 1 || userProfileType === "1") && (
                  <CustomTextInput
                    label="Companion Price (per hour)"
                    placeholder="Enter your hourly rate"
                    name="companion_price"
                    keyboardType="numeric"
                    inputContainer={styles.priceInput}
                    noMargin={true}
                  />
                )}
                {detailSecond?.map(item => (
                  <Select
                    key={item?.label}
                    label={item?.label}
                    placeholder={item?.placeholder}
                    name={item?.name}
                    style={{ width: WIDTH * 0.484 }}
                    data={dropDownData?.[item?.label]?.array}
                    containerStyle={{ width: WIDTH * 0.434 }}
                  />
                ))}
              </View>

              {/*  Profile Categories   */}

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
                Profile Categories
              </Text>
              {/* <MultiSelectComponent/>*/}

              {profileCategory?.map(item => (
                <View style={{ width: '100%' }} key={item?.label}>
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
                      containerStyle={{ width: '92%' }}
                    />
                  ) : (
                    <Select
                      key={item?.label}
                      label={item?.labelShow ? null : item?.label}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      data={dropDownData?.[item?.label]?.array}
                      containerStyle={{ width: '92%' }}
                    />
                  )}
                </View>
              ))}

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
                Profile Categories
              </Text>
              <Text style={{ ...styles.label, marginBottom: 10 }}>
                {'Write About You'}
              </Text>
              <View style={{ ...styles.viewStyle, marginBottom: PADDING.large }}>
                <RichTextEditor
                  onChange={e => setFieldValue('about_me', e)}
                  placeholder="Tell us about yourself..."
                  name="about_me"
                  value={values?.about_me}
                />
              </View>

              <Text style={{ ...styles.label, marginBottom: 10 }}>
                {'My Review'}
              </Text>
              <View style={{ ...styles.viewStyle, marginBottom: PADDING.large }}>
                <RichTextEditor
                        onChange={e => setFieldValue('my_reviews', e)}
                        placeholder="Share your experience and reviews..."
                        name="my_reviews"
                        value={values?.my_reviews}
                      />
              </View>

              <ButtonWrapper
                onClick={handleSubmit}
                label={'Next'}
                buttonMainStyle={{ alignSelf: 'flex-end', width: '36%' }}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
      <ScreenLoading loader={loader} />
      {/* <Radio options={genderList} activeValue={values?.active?? ""} handleChange={(e)=>setFieldValue('active',e)}/> */}
    </KeyboardAvoidingView>
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
  priceInput: {
    width: WIDTH * 0.434,
    marginRight: 10,
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

export default Details;
