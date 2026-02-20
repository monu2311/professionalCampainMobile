/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
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
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';
import { useLanguageContext } from '../../localization/LanguageProvider';
import { getAlignSelf, getButtonAlignSelf, getFlexDirection, getJustifyContent, getTextAlign, getWritingDirection } from '../../localization/RTLProvider';
// import {ICONS} from '../../constants/Icons';
import { defaultStyles } from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {
  COUNTRYLIST,
  detailsData,
} from '../../constants/Static';
import Select from '../../components/Select';
import CustomTextInput from '../../components/CustomTextInput';
import { Formik } from 'formik';
import RichTextEditor from '../../components/RichTextEditor';
import axios from 'axios';
import MultiSelectComponent from '../../components/MultiSelectComponent';
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
  const profileData = useSelector(state => state?.profile);
  // console.log('profileDataprofileData', profileData);
  const dropDownData = useSelector(state => state.dropDown);
  const navigation = useNavigation();
  const route = useRoute();
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);
  const { isRTL, currentLanguage, forceUpdate } = useLanguageContext();

  // Localized arrays for form fields
  const detailfirst = [
    {
      label: t('forms:labels.profileName') + ' *',
      placeholder: t('forms:placeholders.profileName'),
      name: 'profile_name',
    },
    {
      label: t('forms:labels.age'),
      placeholder: t('forms:placeholders.age'),
      name: 'age',
    },
  ];

  const detailSecond = [
    {
      label: t('forms:labels.height'),
      placeholder: t('forms:placeholders.height'),
      name: 'height',
    },
    {
      label: t('forms:labels.dressSize'),
      placeholder: t('forms:placeholders.dressSize'),
      name: 'dress_size',
    },
    {
      label: t('forms:labels.bodyType'),
      placeholder: t('forms:placeholders.bodyType'),
      name: 'body_type',
    },
    {
      label: t('forms:labels.eyes'),
      placeholder: t('forms:placeholders.eyes'),
      name: 'eyes',
    },
    {
      label: t('forms:labels.hairColor'),
      placeholder: t('forms:placeholders.hairColor'),
      name: 'hair_color',
    },
    {
      label: t('forms:labels.hairStyle'),
      placeholder: t('forms:placeholders.hairStyle'),
      name: 'hair_style',
    },
    {
      label: t('forms:labels.gender'),
      placeholder: t('forms:placeholders.gender'),
      name: 'gender_value',
    },
    {
      label: t('forms:labels.ethnicity'),
      placeholder: t('forms:placeholders.ethnicity'),
      name: 'ethnicity',
    },
    {
      label: t('forms:labels.education'),
      placeholder: t('forms:placeholders.education'),
      name: 'education',
    },
  ];

  const profileCategory = [
    {
      label: t('forms:labels.profileCategories'),
      placeholder: t('forms:placeholders.profileCategories'),
      name: 'profile_categories',
      multi: true,
    },
    {
      label: t('forms:labels.optionalProfileCategories'),
      placeholder: t('forms:placeholders.optionalProfileCategories'),
      name: 'profileCategoryExtra',
      labelShow: false,
      textInputShow: true,
    },
    {
      label: t('forms:labels.interestedBooking'),
      placeholder: t('forms:placeholders.interestedBooking'),
      name: 'interestedBooking',
      labelShow: false,
    },
    {
      label: t('forms:labels.listedCities'),
      placeholder: t('forms:placeholders.listedCities'),
      name: 'listed_cities',
      labelShow: false,
    },
    {
      label: t('forms:labels.lifestyleConditions') + ' *',
      placeholder: t('forms:placeholders.lifestyleConditions'),
      name: 'lifestyle_conditions',
      labelShow: true,
      textInputShow: true,
      area: true,
    },
    {
      label: t('forms:labels.preferredEvents') + ' *',
      placeholder: t('forms:placeholders.preferredEvents'),
      name: 'preferred_events',
      labelShow: true,
      textInputShow: true,
      area: true,
    },
    {
      label: t('forms:labels.eventsNotPreferred') + ' *',
      placeholder: t('forms:placeholders.eventsNotPreferred'),
      name: 'events_not_preferred',
      labelShow: true,
      textInputShow: true,
      area: true,
    },
  ];

  const submitHanlder = async value => {
    try {
      setLoader(true);
      const formdata = new FormData();
      formdata.append('is_editing', true);
      for (const key in value) {
        if (key === 'profile_categories') {
          formdata.append('profile_categories', value[key].join(','));
        } else if (key === 'height') {
          formdata.append('height', parseInt(value.height)); // Convert to integer
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
      console.log('error--->', error);
    } finally {
      setLoader(false);
    }
  };

  const [states, setStates] = useState([]);

  const getStateHandler = async id => {
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
        if (suburbId && data.some(d => d.value == suburbId)) {
          formikRef.current?.setFieldValue('hdn_suburbs', suburbId);
        }
      }
      console.log('getStatehandler resposne-->', response);
    } catch (error) {
      console.log('getStatehandler resposne-->', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllAPIs(dispatch); // Pass dispatch to fetchAllAPIs
    };
    if (profileData?.user_profile?.homelocation) {
      getStateHandler(profileData?.user_profile?.homelocation);
    }

    fetchData();
  }, [dispatch, profileData?.user_profile]);

  // Listen for language changes and force re-render to apply new RTL/LTR alignment
  useEffect(() => {
    console.log(`📱 Details: Language changed to ${currentLanguage}, RTL: ${isRTL}`);
    // Component will automatically re-render due to state change
  }, [currentLanguage, isRTL, forceUpdate]);

  const profileCategoires = profileData?.profile_category?.map((item) => item?.category_id?.toString())

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
              {console.dir(values)}
              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  // alignSelf: 'flex-start',
                  // width: '100%',
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL),
                }}>
                {t('screens:profile.details.homeBaseCity')}
              </Text>
              <Select
                label={t('forms:location.selectCountry')}
                placeholder={t('forms:location.selectCountry')}
                name="homelocation"
                data={COUNTRYLIST}
                onCountryChange={getStateHandler}
                containerStyle={{ width: WIDTH * 0.91 }}
              />
              <Select
                label={t('forms:location.selectCity')}
                placeholder={t('forms:location.selectCity')}
                name="hdn_suburbs"
                data={states}
                containerStyle={{ width: WIDTH * 0.91 }}
              />
              <CustomTextInput
                key={'Postal code'}
                label={t('forms:location.postalCode')}
                placeholder={t('forms:location.postalCode')}
                name={'postal_code'}
              />

              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,

                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL),
                }}>
                {t('screens:profile.details.details')}
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
                  flexDirection: getFlexDirection(isRTL, 'row'),
                  alignItems: 'center',
                  // justifyContent: 'space-between',
                  width: '100%',
                  flexWrap: 'wrap',
                }}>

                <CustomTextInput
                  label={t('forms:labels.companionPrice')}
                  placeholder={t('forms:placeholders.companionPricePlaceholder')}
                  name="companion_price"
                  keyboardType="numeric"
                  inputContainer={styles.priceInput}
                  noMargin={true}
                />
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
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL),
                }}>
                {t('forms:labels.profileCategories')}
              </Text>
              {/* <MultiSelectComponent/>*/}

              {profileCategory?.map(item => (
                <View style={{ width: '100%' }} key={item?.label}>
                  {item?.labelShow && (
                    <Text style={{
                      ...styles.label, marginVertical: PADDING.small,
                      paddingTop: 10,
                      marginHorizontal: 10,
                      textAlign: getTextAlign(isRTL),
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
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL),
                }}>
                {t('screens:profile.details.aboutSection')}
              </Text>
              <Text style={{
                ...styles.label, marginBottom: 10,
                marginVertical: PADDING.small,
                paddingTop: 10,
                marginHorizontal: 10,
                textAlign: getTextAlign(isRTL),
              }}>
                {t('screens:profile.details.writeAboutYou')}
              </Text>
              <View style={{ ...styles.viewStyle, marginBottom: PADDING.large }}>
                <RichTextEditor
                  onChange={e => setFieldValue('about_me', e)}
                  placeholder={t('forms:placeholders.writeAboutYou')}
                  name="about_me"
                  value={values?.about_me}
                />
              </View>

              <Text style={{
                ...styles.label, marginBottom: 10, marginVertical: PADDING.small,
                paddingTop: 10,
                marginHorizontal: 10,
                textAlign: getTextAlign(isRTL),
              }}>
                {t('screens:profile.details.myReviews')}
              </Text>
              <View style={{ ...styles.viewStyle, marginBottom: PADDING.large }}>
                <RichTextEditor
                  onChange={e => setFieldValue('my_reviews', e)}
                  // onChange={handleChange}
                  placeholder={t('forms:placeholders.myReviews')}
                  name="my_reviews"
                  value={values?.my_reviews}
                />
              </View>

              <ButtonWrapper
                onClick={handleSubmit}
                label={t('common:buttons.next')}
                buttonMainStyle={{ alignSelf: getButtonAlignSelf(isRTL,'flex-end'), width: '36%' }}
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
    // alignSelf: 'center',
    // width: '94%',
    marginTop: 5,
    paddingTop: 10,
  },
  viewStyle: {
    alignSelf: 'center',
    width: '94%',
  },
});

export default Details;
