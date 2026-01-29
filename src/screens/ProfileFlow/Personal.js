/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  COLORS,
  HEIGHT,
  IOS,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
// import {ICONS} from '../../constants/Icons';
import ButtonWrapper from '../../components/ButtonWrapper';
import { genderList } from '../../constants/Static';
import Select from '../../components/Select';
import CustomTextInput from '../../components/CustomTextInput';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector, useDispatch } from 'react-redux';
import { updatePersonalDetails, fetchProfile, fetchAllAPIs } from '../../apiConfig/Services';
import * as Yup from 'yup';
import axios from 'axios';

// Validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required('User name is required'),
  gender: Yup.string().required('Gender is required'),
  country_id: Yup.string().required('Country is required'),
  city_id: Yup.string().required('City is required'),
});

const Personal = () => {
   const formikRef = useRef();
  const navigation = useNavigation();
  const dropDownData = useSelector((state) => state.dropDown);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const userProfiles = useSelector(state => state.profile);

  const userProfile = useSelector(state => state.profile?.user_profile);

  console.log('userProfileuserProfile', userProfile);
  console.log('dropDownData', dropDownData);
  console.log('userProfilesuserProfilesuserProfilesuserProfiles', userProfiles);

  const submitHandler = async (values) => {
    setLoading(true);

    // Prepare payload as per API requirement
    const payload = {
      user_name: values.name,
      gender: values.gender,
      country_id: parseInt(values.country_id) || 1, // Default to 1 if not selected
      city_id: parseInt(values.city_id) || 1, // Default to 1 if not selected
    };
    console.log('Payload for updating personal details:', payload);
    try {
      const result = await updatePersonalDetails(payload);
      console.log('Update personal details result:', result);
      if (result.success) {
        // Refresh profile data
        await fetchProfile(dispatch);

        Alert.alert(
          'Success',
          'Personal details updated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update personal details');
      }
    } catch (error) {
      console.error('Error updating personal details:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const isFocused = useIsFocused();

  // Function to fetch cities/states based on selected country
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
        setCities(data);
        const suburbId = userProfile.country_id;
        console.log('sdsadsad', typeof suburbId);
        if (suburbId && data.some(d => d.value === suburbId)) {
          formikRef.current?.setFieldValue('city_id', suburbId);
        }
      }
      console.log('getStatehandler resposne-->', response);
    } catch (error) {
      console.log('getStatehandler resposne-->', error);
    }
  }, [userProfile?.country_id]);

  useEffect(() => {
    // Fetch dropdown data when the component mounts
    const fetchData = async () => {
      await fetchAllAPIs(dispatch);
    };
    fetchData();
  }, [dispatch, isFocused]);



  // Fetch cities when component mounts if user has pre-selected country
  useEffect(() => {
    if (userProfile?.country_id) {
      getStateHandler(userProfile.country_id);
    }
  }, [userProfile]);

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: COLORS.white, padding: 5 }}
      contentContainerStyle={{
        paddingBottom: PADDING.large,
        backgroundColor: COLORS.white,
        paddingTop: PADDING.extralarge,
      }}
      behavior={IOS ? 'padding' : 'height'}>ssss
      <Formik
       innerRef={formikRef}
        initialValues={{
          gender: userProfile?.gender || '',
          name: userProfile?.profile_name || userProfile?.user_name || '',
          profile_type: userProfile?.profile_type || '',
          country_id: userProfile?.country_id || '',
          city_id: userProfile?.city_id || userProfile?.state_id || '',
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={values => submitHandler(values)}>
        {({ handleSubmit, values, handleChange, setFieldValue, errors, touched }) => (
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              backgroundColor: COLORS.white,
            }}>
            <CustomTextInput
              label={'Working Name (User Name) *'}
              placeholder={'Enter user name'}
              name={'name'}
              value={values.name}
              onChangeText={handleChange('name')}
              error={touched.name && errors.name}
            // inputContainer={{
            //   height: item?.area ? 140 : 46,
            //   alignItems: 'flex-start',
            // }}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <Select
              label={'Gender *'}
              placeholder={'Select gender'}
              name={'gender'}
              data={genderList}
              value={values.gender}
              onValueChange={value => setFieldValue('gender', value)}
              containerStyle={{ width: '92%' }}
            />
            {touched.gender && errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}
            <Select
              label="Country"
              placeholder="Select Country"
              name="country_id"
              data={dropDownData?.Countries?.array || [{ item: 'No countries available', value: '' }]}
              onCountryChange={getStateHandler}
              containerStyle={{ width: WIDTH * 0.91 }}
            />

            {touched.country_id && errors.country_id && (
              <Text style={styles.errorText}>{errors.country_id}</Text>
            )}
             <Select
                            label="Select City"
                            placeholder="Select City"
                            name="city_id"
                            data={cities}
                            containerStyle={{ width: WIDTH * 0.91 }}
                          />
           
            {touched.city_id && errors.city_id && (
              <Text style={styles.errorText}>{errors.city_id}</Text>
            )}

            <ButtonWrapper
              onClick={handleSubmit}
              label={loading ? 'Updating...' : 'Update'}
              disabled={loading}
              buttonMainStyle={{
                alignSelf: 'flex-end',
                width: '36%',
                opacity: loading ? 0.7 : 1,
              }}
            />
            {loading && (
              <ActivityIndicator
                size="large"
                color={COLORS.specialTextColor}
                style={styles.loader}
              />
            )}
          </View>
        )}
      </Formik>

      {/* <Radio options={genderList} activeValue={values?.active?? ""} handleChange={(e)=>setFieldValue('active',e)}/> */}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 20,
    marginTop: -10,
    marginBottom: 10,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
  },
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
