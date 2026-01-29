/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import * as Yup from 'yup';
// Removed hardcoded arrays - now using localized versions
import CustomTextInput from '../../components/CustomTextInput';
import {Formik} from 'formik';
import Radio from '../../components/Radio';
import CheckBox from '../../components/CheckBox';
import Availability from '../../components/Availability';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import {setProfile} from '../../reduxSlice/profileSlice';
import {UpdateProfile} from '../../reduxSlice/apiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';
import { useLanguageContext } from '../../localization/LanguageProvider';
import { getAlignSelf, getFlexDirection, getJustifyContent, getTextAlign, getWritingDirection } from '../../localization/RTLProvider';

const Contact = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const profileData = useSelector(state => state.profile)
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);
  const { isRTL, currentLanguage, forceUpdate } = useLanguageContext();
  console.log("isRTL--->", isRTL);

  // Localized contact form arrays
  const localizedContactFields = [
    {
      label: t('forms:labels.emailForClientEnquiries'),
      placeholder: t('forms:placeholders.emailForClientEnquiries'),
      name: 'email_client_enquiries',
    },
    {
      label: t('forms:labels.confirmEmailAddress'),
      placeholder: t('forms:placeholders.confirmEmailAddress'),
      name: 'cnf_email_client_enquiries',
    },
    {
      label: t('forms:labels.phoneNumber'),
      placeholder: t('forms:placeholders.phoneNumber'),
      name: 'phone_no',
    },
    {
      label: t('forms:labels.confirmPhoneNumber'),
      placeholder: t('forms:placeholders.confirmPhoneNo'),
      name: 'cnf_phone_no',
    },
    {
      label: t('forms:labels.additionalPhoneNumber'),
      placeholder: t('forms:placeholders.additionalPhoneNo'),
      name: 'additional_phone_no',
    },
    {
      label: t('forms:labels.confirmAdditionalPhoneNumber'),
      placeholder: t('forms:placeholders.confirmAdditionalPhoneNo'),
      name: 'cnf_additional_phone_no',
    },
  ];

  const localizedSocialMediaFields = [
    {
      label: t('forms:labels.facebook'),
      placeholder: t('forms:placeholders.facebook'),
      name: 'social_fb',
    },
    {
      label: t('forms:labels.twitter'),
      placeholder: t('forms:placeholders.twitter'),
      name: 'social_x',
    },
    {
      label: t('forms:labels.instagram'),
      placeholder: t('forms:placeholders.instagram'),
      name: 'social_insta',
    },
    {
      label: t('forms:labels.pinterest'),
      placeholder: t('forms:placeholders.pinterest'),
      name: 'social_pinterest',
    },
    {
      label: t('forms:labels.tumbler'),
      placeholder: t('forms:placeholders.tumbler'),
      name: 'social_tumblr',
    },
    {
      label: t('forms:labels.tiktok'),
      placeholder: t('forms:placeholders.tiktok'),
      name: 'social_tiktok',
    },
  ];

  const localizedDateArray = [
    {
      isChecked: true,
      day: t('forms:contact.monday'),
      from: '10:00 AM',
      until: '10:00 PM',
    },
    {
      isChecked: true,
      day: t('forms:contact.tuesday'),
      from: '10:00 AM',
      until: '10:00 PM',
    },
    {
      isChecked: true,
      day: t('forms:contact.wednesday'),
      from: '10:00 AM',
      until: '10:00 PM',
    },
    {
      isChecked: true,
      day: t('forms:contact.thursday'),
      from: '10:00 AM',
      until: '10:00 PM',
    },
    {
      isChecked: true,
      day: t('forms:contact.friday'),
      from: '10:00 AM',
      until: '10:00 PM',
    },
    {
      isChecked: true,
      day: t('forms:contact.saturday'),
      from: '10:00 AM',
      until: '10:00 PM',
    },
    {
      isChecked: true,
      day: t('forms:contact.sunday'),
      from: '10:00 AM',
      until: '10:00 PM',
    },
  ];

  // Listen for language changes
  useEffect(() => {
    console.log(`📞 Contact: Language changed to ${currentLanguage}, RTL: ${isRTL}`);
  }, [currentLanguage, isRTL, forceUpdate]);

  const submitHandler = async value => {
    try {
      setLoader(true);
      const formData = new FormData();
      const day_from = [];
      const day_until = [];
      const day_unavailable=[];
      const day=[];
      Object.entries(value).forEach(([key, val]) => {
        if (key === 'avail' && Array.isArray(val)) {
          val.forEach((item, index) => {
            day.push(item.day);
            if (item.isChecked) {
              day_from.push(item.from || '10:00 AM');
              day_until.push(item.until || '10:00 PM');
              day_unavailable.push(0);
            } else {
              day_unavailable.push(1)
            }
          });
        } else {
          formData.append(key, val ?? '');
        }
      });
      if(day_unavailable?.length != 0){
        formData.append(`day_unavailable`,day_unavailable.join(","));

      }
      formData.append(`day_from`,day_from.join(","));
      formData.append(`day_until`,day_until.join(","));
      formData.append(`day`,day.join(","));
      if( route.name ==   "EditContact"){
        formData.append('is_editing',true);
      }

      dispatch(setProfile({ user_profile: value}));
      const response = await dispatch(UpdateProfile(formData, {step: 5}));
      if (response?.status === 200) {

        if (route.name === 'EditContact') {
          navigation?.goBack(); // Go back if editing
        } else {
          await AsyncStorage.setItem('account_step', '5'); // Save progress
          navigation.navigate('Opition'); // Go to next step
        }       
      }
    } catch (error) {
      console.log('error--->', error);
    } finally {
      setLoader(false);
    }
  };


  const validationSchema = Yup.object().shape({
    email_client_enquiries: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),

    cnf_email_client_enquiries: Yup.string()
      .oneOf([Yup.ref('email_client_enquiries'), null], 'Emails must match')
      .required('Please confirm your email'),

    phone_no: Yup.string()
      .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number')
      .required('Phone number is required'),

    cnf_phone_no: Yup.string()
      .oneOf([Yup.ref('phone_no'), null], 'Phone numbers must match')
      .required('Please confirm your phone number'),

    additional_phone_no: Yup.string()
      .matches(/^[0-9]{10,15}$/, 'Enter a valid additional phone number')
      .notRequired(),

    cnf_additional_phone_no: Yup.string()
      .oneOf(
        [Yup.ref('additional_phone_no'), null],
        'Additional phone numbers must match',
      )
      .when('additional_phone_no', {
        is: val => !!val,
        then: Yup.string().required(
          'Please confirm your additional phone number',
        ),
        otherwise: Yup.string().notRequired(),
      }),

    website: Yup.string().url('Enter a valid URL').notRequired(),

    service_incall: Yup.string().required(
      'Please select a service incall option',
    ),

    clients_with_disability: Yup.string().required('This field is required'),

    contact_method_phonecalls: Yup.string().required('This field is required'),

    flexRadioDefault: Yup.string().required('Please make a selection'),

    more_contact_instructions: Yup.string().max(
      500,
      'Max 500 characters allowed',
    ),

    social_fb: Yup.string().url('Enter a valid Facebook URL').notRequired(),
    social_x: Yup.string().url('Enter a valid X (Twitter) URL').notRequired(),
    social_insta: Yup.string().url('Enter a valid Instagram URL').notRequired(),
    social_pinterest: Yup.string()
      .url('Enter a valid Pinterest URL')
      .notRequired(),
    social_tumblr: Yup.string().url('Enter a valid Tumblr URL').notRequired(),
    social_tiktok: Yup.string().url('Enter a valid TikTok URL').notRequired(),

    notice_req_24hrs: Yup.string().required('This field is required'),

    availabity_extras: Yup.string().max(300, 'Max 300 characters allowed'),

    display_different_availabilities: Yup.string().required(
      'This field is required',
    ),

    // avail: Yup.array()
    //   .of(
    //     Yup.object().shape({
    //       isChecked: Yup.boolean().nullable(),
    //       day: Yup.string().when('isChecked', {
    //         is: true,
    //         then: Yup.string().required('Day is required'),
    //         otherwise: Yup.string().notRequired(),
    //       }),
    //       from: Yup.string().when('isChecked', {
    //         is: true,
    //         then: Yup.string().required('From time is required'),
    //         otherwise: Yup.string().notRequired(),
    //       }),
    //       until: Yup.string().when('isChecked', {
    //         is: true,
    //         then: Yup.string()
    //           .required('Until time is required')
    //           .test(
    //             'isLater',
    //             '"Until" time must be later than "From" time',
    //             function (value) {
    //               const {from} = this.parent;
    //               return from && value
    //                 ? dayjs(value, 'HH:mm').isAfter(dayjs(from, 'HH:mm'))
    //                 : true;
    //             },
    //           ),
    //         otherwise: Yup.string().notRequired(),
    //       }),
    //     }),
    //   )
    //   .test(
    //     'atLeastOneChecked',
    //     'At least one availability must be selected',
    //     arr => (arr ? arr.some(item => item.isChecked) : false),
    //   ),
  });

  const [arrayOfObject,setArrayOfObject] = useState(localizedDateArray);

const isFocused  = useIsFocused();


  useEffect(()=>{

    if(isFocused){
      // const allData = profileData?.user_availability?.reduce((acc, res, idx) => {
      //   // console.log("resres",res);
      //   acc[idx] =  {
      //     isChecked: res?.unavailable ?  true : false,
      //     day: res?.day,
      //     from: res?.from,
      //     until: res?.until,
      //   }
      //   return acc;
      // }, []);

      const allData = localizedDateArray?.reduce((acc,res,idx) => {
        const data = profileData?.user_availability?.filter((item)=> item?.day == res?.day);
        acc[idx] = {
          isChecked: data?.[0]?.unavailable ?  true : false,
              day: res?.day,
              from:  data?.[0]?.from ||  res?.from,
              until: data?.[0]?.until || res?.until,
        }
        return acc
      },[]);
      setArrayOfObject(allData);
    }


  },[isFocused]);


  return (
    <KeyboardAvoidingView
      style={{backgroundColor: COLORS.white, padding: 5}}
      contentContainerStyle={{
        paddingBottom: PADDING.extralarge,
        backgroundColor: COLORS.white,
      }}>
      <ScrollView
        contentContainerStyle={{
          marginBottom: PADDING.extralarge,
          paddingBottom: PADDING.extralarge,
        }}
        showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={{
            email_client_enquiries:profileData?.user_profile?.email_client_enquiries || '',
            cnf_email_client_enquiries: profileData?.user_profile?.email_client_enquiries || '',
            phone_no: profileData?.user_profile?.phone_no ||'',
            cnf_phone_no: profileData?.user_profile?.phone_no ||'',
            additional_phone_no: profileData?.user_profile?.additional_phone_no ||'',
            cnf_additional_phone_no: profileData?.user_profile?.additional_phone_no ||'',
            website: profileData?.user_profile?.website ||'',
            service_incall:profileData?.user_profile?.service_incall || '',
            clients_with_disability: profileData?.user_profile?.clients_with_disability ||'',
            contact_method_phonecalls: profileData?.user_profile?.contact_method_phonecalls ||'',
            flexRadioDefault: profileData?.user_profile?.sms_option ||'',
            more_contact_instructions: profileData?.user_profile?.more_contact_instructions ||'',
            social_fb:profileData?.user_profile?.social_fb ||'',
            social_x:profileData?.user_profile?.social_x || '',
            social_insta:profileData?.user_profile?.social_insta || '',
            social_pinterest:profileData?.user_profile?.social_pinterest || '',
            social_tumblr:profileData?.user_profile?.social_tumblr || '',
            social_tiktok: profileData?.user_profile?.social_tiktok || '',
            social_onlyfans: profileData?.user_profile?.social_onlyfans || '',
            social_snapchat:profileData?.user_profile?.social_snapchat || '',
            notice_req_24hrs:profileData?.user_profile?.notice_req_24hrs || '',
            availabity_extras:profileData?.user_profile?.availabity_extras || '',
            display_different_availabilities: profileData?.user_profile?.display_different_availabilities ||'',
            avail: arrayOfObject,
          }}
          enableReinitialize={true}
          // validationSchema={validationSchema}
          onSubmit={values => submitHandler(values)}>
          {({
            handleSubmit,
            values,
            handleChange,
            setFieldValue,
            errors,
            touched,
          }) => (
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                backgroundColor: COLORS.white,
              }}>
                {console.log("asdasdasd",errors)}
              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  // alignSelf: getAlignSelf(isRTL),
                  // width: '100%',
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL),
                }}>
                {t('screens:profile.contact.title')}
              </Text>
              {localizedContactFields?.map(item => (
                <CustomTextInput
                  key={item?.label}
                  label={item?.label}
                  placeholder={item?.placeholder}
                  name={item?.name}
                />
              ))}
              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  alignSelf: getAlignSelf(isRTL),
                  width: '100%',
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL, 'left'),
                }}>
                {t('screens:profile.contact.miscellaneous')}
              </Text>
              <CustomTextInput
                label={t('forms:labels.website')}
                placeholder={t('forms:placeholders.website')}
                name={'website'}
              />
              <View
                style={{
                  flexDirection: getFlexDirection(isRTL, 'row'),
                  //   alignItems: 'center',
                  width: WIDTH * 0.94,
                  alignSelf: 'center',
                }}>
                <View style={{width: '54%'}}>
                  <Text
                    style={{
                      ...styles.label,
                      fontSize: 13,
                      marginTop: 0,
                      paddingTop: 0,
                      textAlign: getTextAlign(isRTL, 'left'),
                    }}>
                    {t('screens:profile.contact.ableToOffer')}
                  </Text>
                  <CheckBox
                    options={[
                      {
                        item: t('forms:contact.youCanComeToMe'),
                        value: '1',
                      },
                      {
                        item: t('forms:contact.iCanComeToYou'),
                        value: '2',
                      },
                    ]}
                    activeValue={values?.service_incall ?? ''}
                    handleChange={e => setFieldValue('service_incall', e)}
                  />
                </View>
                <View style={{width: '46%'}}>
                  <Text
                    style={{
                      ...styles.label,
                      fontSize: 13,
                      marginTop: 0,
                      paddingTop: 0,
                      textAlign: getTextAlign(isRTL, 'left'),
                    }}>
                    {t('screens:profile.contact.clientsWithDisability')}
                  </Text>
                  <CheckBox
                    options={[
                      {
                        item: t('forms:contact.servicingDisabledClients'),
                        value: '1',
                      },
                    ]}
                    activeValue={values?.clients_with_disability ?? ''}
                    handleChange={e =>
                      setFieldValue('clients_with_disability', e)
                    }
                  />
                </View>
              </View>

              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  alignSelf: getAlignSelf(isRTL),
                  width: '100%',
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL, 'left'),
                }}>
                {t('screens:profile.contact.preferredContact')}
              </Text>
              <View
                style={{
                  width: '94%',
                  alignSelf: 'center',
                  marginTop: PADDING.medium,
                }}>
                <Text
                  style={{
                    ...styles.label,
                    fontSize: 13,
                    marginTop: 0,
                    paddingTop: 0,
                    width: '100%',
                    textAlign: getTextAlign(isRTL, 'left'),
                  }}>
                  {t('screens:profile.contact.preferredContactMethod')}
                </Text>
                <CheckBox
                  options={[
                    {
                      item: t('forms:contact.phoneCalls'),
                      value: '1',
                    },
                    {
                      item: t('forms:contact.smsMessages'),
                      value: '2',
                    },
                  ]}
                  activeValue={values?.contact_method_phonecalls ?? ''}
                  handleChange={e =>
                    setFieldValue('contact_method_phonecalls', e)
                  }
                />
              </View>
              <View
                style={{
                  width: '94%',
                  alignSelf: 'center',
                  marginTop: PADDING.large,
                }}>
                <Text
                  style={{
                    ...styles.label,
                    fontSize: 13,
                    marginTop: 0,
                    paddingTop: 0,
                    width: '100%',
                  }}>
                  {t('screens:profile.contact.smsOption', { defaultValue: 'SMS Option' })}
                </Text>
                <Radio
                  options={[
                    {
                      item: t('forms:contact.letClientsFillSms'),
                      value: t('forms:contact.letClientsFillSms'),
                    },
                    {
                      item: t('forms:contact.turnOffPreFill'),
                      value: t('forms:contact.turnOffPreFill'),
                    },
                  ]}
                  activeValue={values?.flexRadioDefault ?? ''}
                  handleChange={e => setFieldValue('flexRadioDefault', e)}
                />
              </View>
              <Text style={{...styles.label, textAlign: getTextAlign(isRTL, 'left')}}>{t('screens:profile.contact.furtherInstructions')}</Text>
              <CustomTextInput
                label={null}
                placeholder={t('forms:contact.writeHere')}
                name={'more_contact_instructions'}
                inputContainer={{
                  height: 140,
                  alignItems: 'flex-start',
                }}
              />

              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  alignSelf: getAlignSelf(isRTL),
                  width: '100%',
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL, 'left'),
                }}>
                {t('screens:profile.contact.socialMedia')}
              </Text>
              {localizedSocialMediaFields?.map(item => (
                <CustomTextInput
                  key={item?.label}
                  label={item?.label}
                  placeholder={item?.placeholder}
                  name={item?.name}
                />
              ))}
              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  alignSelf: getAlignSelf(isRTL),
                  width: '100%',
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL, 'left'),
                }}>
                {t('screens:profile.contact.availabilitySchedule')}
              </Text>
              <Availability
                activeValue={values.avail}
                handleChange={newAvail => setFieldValue('avail', newAvail)}
                errors={errors}
                touched={touched}
              />
              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  alignSelf: getAlignSelf(isRTL),
                  width: '100%',
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  textAlign: getTextAlign(isRTL, 'left'),
                }}>
                {t('screens:profile.contact.availabilityExtras')}
              </Text>

              <View
                style={{
                  width: '94%',
                  alignSelf: 'center',
                  marginTop: PADDING.medium,
                }}>
                <CheckBox
                  options={[
                    {
                      item: t('forms:contact.availableByAppointment'),
                      value: '1',
                    },
                    {
                      item: t('forms:contact.twentyFourHoursNotice'),
                      value: '2',
                    },
                    
                  ]}
                  activeValue={values?.notice_req_24hrs ?? ''}
                  handleChange={e => setFieldValue('notice_req_24hrs', e)}
                />
              </View>
              <View
                style={{
                  width: '94%',
                  alignSelf: 'center',
                  marginTop: PADDING.large,
                }}>
                {/* <Text
                  style={{
                    ...styles.label,
                    fontSize: 13,
                    marginTop: 0,
                    paddingTop: 0,
                    width: '100%',
                  }}>
                  {t('screens:profile.contact.smsOption', { defaultValue: 'SMS Option' })}
                </Text> */}
                <Radio
                  options={[
                    {
                      item: t('forms:contact.yes'),
                      value: t('forms:contact.available24Hours'),
                    },
                    {
                      item: t('forms:contact.flexibleHours'),
                      value: t('forms:contact.flexibleHours'),
                    },
                    {
                      item: t('forms:contact.preBookingsPreferred'),
                      value: t('forms:contact.preBookingsPreferred'),
                    },
                    {
                      item: t('forms:contact.available7Days'),
                      value: '3',
                    },
                  ]}
                  activeValue={values?.availabity_extras ?? ''}
                  handleChange={e => setFieldValue('availabity_extras', e)}
                />
              </View>

              <Text
                style={{
                  ...defaultStyles.header,
                  color: COLORS.mainColor,
                  marginVertical: PADDING.small,
                  paddingTop: 10,
                  marginHorizontal: 10,
                  marginTop: PADDING.small,
                  textAlign: getTextAlign(isRTL, 'left'),
                }}>
                {t('screens:profile.contact.touringAvailability')}
              </Text>
              <Text
                style={{
                  ...styles.label,
                  fontSize: 13,
                  // marginTop: 0,
                  paddingTop: 0,
                  // width: '100%',
                  width: '92%',
                  alignSelf: 'center',
                  marginTop: PADDING.small,
                  textAlign: getTextAlign(isRTL, 'left'),
                }}>
                {t('screens:profile.contact.touringDescription')}
              </Text>
              <View
                style={{
                  width: '94%',
                  alignSelf: 'center',
                  marginTop: PADDING.large,
                  //   marginBottom:PADDING.extralarge
                }}>
                <Text
                  style={{
                    ...styles.label,
                    fontSize: 13,
                    marginTop: 0,
                    paddingTop: 0,
                    width: '100%',
                    textAlign: getTextAlign(isRTL, 'left'),
                  }}>
                  {t('screens:profile.contact.differentAvailabilityQuestion')}
                </Text>
                <Radio
                  options={[
                    {
                      item: t('forms:contact.yes'),
                      value: t('forms:contact.yes'),
                    },
                    {
                      item: t('forms:contact.no'),
                      value: t('forms:contact.no'),
                    },
                  ]}
                  activeValue={values?.display_different_availabilities ?? ''}
                  handleChange={e =>
                    setFieldValue('display_different_availabilities', e)
                  }
                />
              </View>

              <ButtonWrapper
                onClick={handleSubmit}
                label={t('common:buttons.next')}
                buttonMainStyle={{alignSelf: getJustifyContent(isRTL, 'flex-end'), width: '36%'}}
              />
            </View>
          )}
        </Formik>
        <ScreenLoading loader={loader} />
      </ScrollView>
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

export default Contact;
