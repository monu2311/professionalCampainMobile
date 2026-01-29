/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useRef} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  COLORS,
  HEIGHT,
  IOS,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
// import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {
  detailfirst,
  detailsData,
  detailSecond,
  genderList,
  homeBase,
  profileCategory,
  PROFILETYPELIST,
} from '../../constants/Static';
import Select from '../../components/Select';
import CustomTextInput from '../../components/CustomTextInput';
import {Formik} from 'formik';
import RichTextEditor from '../../components/RichTextEditor';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';

const Personal = () => {
  const navigation = useNavigation();
  const profileData = useSelector(state => state?.profile);
  const userProfile = useSelector(state => state.profile?.user_profile);
  const register = useSelector(
    state => state?.auth?.data?.userByID?.data?.user,
  );
  console.log('registerregister', register);

  const submitHandler = () => {
    navigation.goBack();
  };
  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: COLORS.white, padding: 5}}
      contentContainerStyle={{
        paddingBottom: PADDING.large,
        backgroundColor: COLORS.white,
        paddingTop: PADDING.extralarge,
      }}
      behavior={IOS ? 'padding' : 'height'}>ssss
      <Formik
        initialValues={{
          gender: register?.gender || '',
          name: userProfile?.profile_name || '',
          profile_type: register?.profile_type || '',
          state_id: register?.state_id || '',
        }}
        enableReinitialize={true}
        onSubmit={values => submitHandler()}>
        {({handleSubmit, values, handleChange, setFieldValue}) => (
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              backgroundColor: COLORS.white,
            }}>
            <CustomTextInput
              label={'Working Name (User Name) *'}
              placeholder={'adm'}
              name={'name'}
              // inputContainer={{
              //   height: item?.area ? 140 : 46,
              //   alignItems: 'flex-start',
              // }}
            />

            <Select
              label={'Gender'}
              placeholder={'Men'}
              name={'gender'}
              data={genderList}
              containerStyle={{width: '92%'}}
            />
            <Select
              label={'Profile Type *'}
              placeholder={'A cup'}
              name={'profile_type'}
              data={PROFILETYPELIST}
              containerStyle={{width: '92%'}}
            />
            <Select
              label={'Select City'}
              placeholder={'Sudney'}
              name={'state_id'}
              data={
                detailsData?.['What Cities would you like to be listed under?']
                  ?.array
              }
              containerStyle={{width: '92%'}}
            />

            <ButtonWrapper
              onClick={handleSubmit}
              label={'Update'}
              buttonMainStyle={{alignSelf: 'flex-end', width: '36%'}}
            />
          </View>
        )}
      </Formik>

      {/* <Radio options={genderList} activeValue={values?.active?? ""} handleChange={(e)=>setFieldValue('active',e)}/> */}
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

export default Personal;
