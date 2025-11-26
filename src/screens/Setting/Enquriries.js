import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ButtonWrapper from '../../components/ButtonWrapper';
import {
  COLORS,
  HEIGHT,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
import {otherQueries} from '../../constants/Static';
import CustomTextInput from '../../components/CustomTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {defaultStyles} from '../../constants/Styles';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {contactUs} from '../../reduxSlice/apiSlice';
import ScreenLoading from '../../components/ScreenLoading';

const Enquriries = () => {
  const changePAss = useSelector(state => state?.auth?.data?.contactUs);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const submitHandler = async value => {
    try {
      const formData = new FormData();
      Object.entries(value).forEach(([key, val]) => {
        formData.append(key, val ?? '');
      })
      const response = await dispatch(contactUs(value));
      if (response?.status == '1') {
        navigation.goBack();
      }
      console.log('ASDASDA', response);
    } catch (error) {
      console.log('SKAJhdjksah--->', error);
    }
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .required('First name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed'),

    last_name: Yup.string()
      .required('Last name is required')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed'),

    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number'),

    email: Yup.string()
      .required('Email is required')
      .email('Enter a valid email'),

    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters'),
  });

  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: COLORS.white, padding: 5, flex: 1}}
      contentContainerStyle={{
        paddingBottom: PADDING.extralarge,
        backgroundColor: COLORS.white,
      }}>
      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          phone: '',
          email: '',
          message: '',
        }}
        validationSchema={validationSchema}
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
                marginBottom: PADDING.large,
              }}>
              All other enquiries
            </Text>

            {otherQueries?.map(item => (
              <View style={{width: '100%'}} key={item?.label}>
                <CustomTextInput
                  key={item?.label}
                  label={item?.labelShow ? null : item?.label}
                  placeholder={item?.label}
                  name={item?.name}
                  inputContainer={{
                    height: item?.area ? 140 : 46,
                    alignItems: 'flex-start',
                  }}
                />
              </View>
            ))}

            <ButtonWrapper
              onClick={handleSubmit}
              label={'Send Message'}
              buttonMainStyle={{alignSelf: 'flex-end', width: '100%'}}
            />
          </View>
        )}
      </Formik>
      <View
        style={{
          marginHorizontal: 10,
          paddingVertical: PADDING.medium,
          marginTop: PADDING.large,
        }}>
        <Text style={styles?.bold}>Professional Companionship </Text>
        <Text style={{...styles?.bold, marginBottom: PADDING.medium}}>
          Melbourne, VIC 3000 Australia.
        </Text>

        <Text style={{...styles?.bold, marginBottom: PADDING.medium / 2}}>
          Email :{' '}
          <Text style={{...styles?.bold, color: COLORS.mainColor}}>
            pcompanionship@gmail.com
          </Text>
        </Text>

        <Text style={{...styles?.bold, marginBottom: PADDING.medium / 2}}>
          Our business hours:{' '}
          <Text style={{...styles?.bold, fontFamily: TYPOGRAPHY?.QUICKREGULAR}}>
            Monday to Friday 10am - 7pm VIC time. Closed Saturdays, Sundays &
            public holidays.
          </Text>
        </Text>
        <Text
          style={{
            ...styles?.bold,
            fontFamily: TYPOGRAPHY?.QUICKREGULAR,
            marginTop: PADDING.medium / 2,
          }}>
          We will endeavour to reply to your email at our first availability.
          Please allow up to 3 days for our reply.
        </Text>
      </View>
      <ScreenLoading loader={changePAss?.isLoading} />
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
  bold: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontSize: 15,
  },
  viewStyle: {
    alignSelf: 'center',
    width: '94%',
  },
});

export default Enquriries;
