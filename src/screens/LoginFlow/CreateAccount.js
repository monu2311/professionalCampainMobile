/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  Alert,
  // Modal,
} from 'react-native';
import GradientWrapper from '../../components/GradientWrapper';
import {Avatar, Button, Card, Modal, Portal} from 'react-native-paper';
import {COLORS, PADDING, TYPOGRAPHY, WIDTH} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import CustomTextInput from '../../components/CustomTextInput';
import ButtonWrapper from '../../components/ButtonWrapper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation, useRoute} from '@react-navigation/native';
import Select from '../../components/Select';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {COUNTRYLIST, genderList, PROFILETYPELIST} from '../../constants/Static';
import { Provider } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../reduxSlice/apiSlice';
import ScreenLoading from '../../components/ScreenLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllAPIs, fetchPlans } from '../../apiConfig/Services';
import { storeUserData, storeAccountStep } from '../../utils/authHelpers';

const CreateAccount = () => {
  const dropDownData = useSelector((state)=>state.dropDown);
  // console.log("dropDownDatadropDownData",dropDownData)
  const navigation = useNavigation();
  const  route = useRoute();
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [loading,setLoading] =  useState(false);
  const [member,setMember] =  useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  

  const  nextHandler = ()=>{
    hideModal();
    console.log("jashdkjas",member);
    fetchPlans(dispatch);
    navigation.navigate(member != 1 ? 'SelectPlan'  : 'CreateProfile');
  }

  const [states,setStates]  = useState([]);

  const validationSchema = Yup.object({
    user_name: Yup.string()
      .min(3, 'User name must be at least 3 characters')
      .max(50, 'User name must be at most 50 characters')
      .required('User name is required'),
  
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),

    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),

      confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  
    gender: Yup.string()
      .required('Gender is required'),
  
    // country: Yup.string()
    //   .required('Country is required'),
  
    // state: Yup.number()
    //   .required('State is required'),
  
    profile_type: Yup.string()
      .required('Profile type is required'),
  
    agree_to_terms: Yup.number()
      .oneOf([1], 'You must agree to the terms')
      .required('You must agree to the terms'),
  });

  const getStateHandler  = async(id)=>{
    console.log("id",id)
      try {
        const response = await axios({
          method:'get',
          url:`https://thecompaniondirectory.com/states/${id}`,
        })
        if(response?.status ===  200){
          const data = response?.data?.map((Item) => ({
            value: Item?.id,
            item: Item.name
          }));
          
          setStates(data);
        }
        console.log("getStatehandler resposne-->",response)
      } catch (error) {
        console.log("getStatehandler resposne-->",error)
      }
  }

  const submitHanlder  =async(value)=>{
    try {
      setLoading(true)
      const payload = {...value};
      // payload.profile_type = 1;
      setMember(value?.profile_type);
      const  response  = await  dispatch(register(value,{step:1}));
      console.log("Registration success response--->", response);
      console.log("Response details--->", response?.details);
      console.log("Response user data--->", response?.user);
      console.log("Response data--->", response?.data);
      console.log("Form values being stored--->", value);

      if(response?.status ===1){
        await AsyncStorage.setItem("ChapToken",response?.token)

        // Enhanced user data extraction and storage
        // Try multiple locations for user data
        const responseUserData = response?.details || response?.user || response?.data || {};

        // Extract user_id from multiple possible locations
        const extractedUserId = responseUserData?.user_id ||
                              responseUserData?.id ||
                              response?.user_id ||
                              response?.details?.id ||
                              null;

        console.log("Extracted user_id from registration:", extractedUserId);

        // Comprehensive user data object with form data + response data
        const userDataToStore = {
          // Form data (guaranteed to be available)
          email: value?.email || null,
          user_name: value?.user_name || null,
          gender: value?.gender || null,
          profile_type: parseInt(value?.profile_type) || value?.profile_type || null,

          // Response data
          user_id: extractedUserId,
          account_step: responseUserData?.account_step || 1,
          status: responseUserData?.status || false,
          is_plan_purchased: responseUserData?.is_plan_purchased || false,

          // Set initial membership status for Members
          is_user_can_logged_in: parseInt(value?.profile_type) === 2 ? 'Not Purchased' : null,
          is_plan_paid: false, // Track if plan payment is done

          // Additional fields that might be in response
          phone: responseUserData?.phone || responseUserData?.phone_no || value?.phone || null,

          // Spread response details last to allow override
          ...responseUserData
        };

        console.log("Complete user data being stored:", userDataToStore);

        // Validate critical fields before storage
        if (!userDataToStore.email) {
          console.warn("Warning: email is missing from user data");
        }
        if (!userDataToStore.user_name) {
          console.warn("Warning: user_name is missing from user data");
        }
        if (!userDataToStore.user_id) {
          console.warn("Warning: user_id is missing from registration response");
        }

        // Store the comprehensive user data
        await storeUserData(userDataToStore);

        // Store account step separately for easy access
        await storeAccountStep(userDataToStore.account_step || 1);

        // Verify what was actually stored (for debugging)
        try {
          const verifyStoredData = await AsyncStorage.getItem('userData');
          console.log("Verification - Data actually stored in AsyncStorage:", JSON.parse(verifyStoredData || '{}'));
        } catch (verifyError) {
          console.error("Error verifying stored data:", verifyError);
        }

        showModal();
      }
    } catch (error) {
      console.log("error--->",error);

      // Handle server validation errors
      let errorMessage = 'Registration failed. Please try again.';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors) {
        // Handle validation errors from server
        const errors = error.response.data.errors;
        if (errors.password) {
          errorMessage = errors.password[0] || 'Password validation failed';
        } else if (errors.email) {
          errorMessage = errors.email[0] || 'Email validation failed';
        } else {
          // Get first error message
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Show error alert
      Alert.alert(
        'Registration Error',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    }finally{
      setLoading(false)
    }
  };

  const getServicesHandler = async () => {
    // console.log("id",id)
    try {
      const response = await axios({
        method: 'get',
        url: `https://thecompaniondirectory.com/services`,
      });
      if (response?.status === 200) {
        // setStates(data);
      }
      console.log('getStatehandler resposne-->', response);
    } catch (error) {
      console.log('getStatehandler resposne-->', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await fetchAllAPIs(dispatch);  // Pass dispatch to fetchAllAPIs
    };

    fetchData();
  }, [dispatch]);



  return (
    <Provider>
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <KeyboardAvoidingScrollView
      >
        <View style={styles.displayFlex}>
          <Image source={ICONS.LOGO} style={styles.logo} />
          <Text style={{...defaultStyles.buttonTextSmall, marginLeft: 10}}>
            {'Professional \nCompanionship'}
          </Text>
        </View>

        <Formik
          initialValues={{user_name: '', email:'',password: '',confirm_password:'',gender:'',country:'',state:'',profile_type:1,agree_to_terms:0}}
          onSubmit={values =>submitHanlder(values)}
          validationSchema={validationSchema}
          >
          {({handleSubmit,values,setFieldValue,error}) => (
            <View
              style={{
                width: WIDTH * 0.96,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  ...defaultStyles.header,
                  ...styles.heading,
                  color: COLORS.black,
                  marginBottom: 0,
                  marginTop: 20,
                  marginBottom: PADDING.medium,
                }}>
                Create Profile 
              </Text>
              {/* {console.log("kasjdasjdjkasdjk",error)} */}
              {/* <Text
                style={{
                  ...defaultStyles.header,
                  ...styles.heading,
                  marginTop: 0,
                  marginBottom: PADDING.medium,
                }}>
                Professional Companionship
              </Text> */}
              <CustomTextInput
                label="Profile Name (User Name) *"
                placeholder="User Name"
                name="user_name"
              />
              <CustomTextInput
                label="Email *"
                placeholder="Email"
                name="email"
              />
              <CustomTextInput
                label="Password *"
                placeholder="Password"
                name="password"
                secureTextEntry={!showPassword}
                rightIcon={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color={COLORS.placeHolderColor}
                    />
                  </Pressable>
                }
              />
              <CustomTextInput
                label="Confirm Password *"
                placeholder="Confirm Password"
                name="confirm_password"
                secureTextEntry={!showConfirmPassword}
                rightIcon={
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Icon
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color={COLORS.placeHolderColor}
                    />
                  </Pressable>
                }
              />
              <Select
                label="Gender *"
                placeholder="Gender"
                name="gender"
                data={genderList}
                containerStyle={{width: WIDTH * 0.91}}
              />
               {/* <Select
                label="Select Country"
                placeholder="Select Country"
                name="country"
                data={COUNTRYLIST}
                onCountryChange={getStateHandler}
                containerStyle={{width: WIDTH * 0.91}}
              />
              <Select
                label="Select City"
                placeholder="Select City"
                name="state"
                data={states}
                 containerStyle={{width: WIDTH * 0.91}}
              />  */}
              <Select
                label="Profile Type *"
                placeholder="Profile Type"
                name="profile_type"
                data={PROFILETYPELIST}
                containerStyle={{width: WIDTH * 0.91}}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                  marginTop:4
                }}>
                {/* <Image source={ICONS.UNCHECKED} style={styles.img} /> */}
                <Pressable onPress={()=>setFieldValue("agree_to_terms",values?.agree_to_terms  ===   0  ?  1:0)}>
                  <Icon name={values?.agree_to_terms ?  "checkbox" :"square-outline"} size={20}/>               
                   </Pressable>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: TYPOGRAPHY.QUICKREGULAR,
                    fontWeight: '400',
                    color: COLORS.labelColor,
                    marginLeft: 10,
                  }}>
                  I have read and agree to the
                  <Text
                    style={{
                      color: COLORS.underlineColor,
                      fontSize: 12,
                      fontFamily: TYPOGRAPHY.QUICKREGULAR,
                      fontWeight: '400',
                      textDecorationLine: 'underline',
                    }}
                    onPress={() => navigation.navigate('TermsAndConditions')}>
                    {'Terms and Conditions'}
                  </Text>
                </Text>
              </View>

              <View style={{marginTop: PADDING.small}}>
                <ButtonWrapper label={'Sign Up'} onClick={handleSubmit} />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingScrollView>
      <ScreenLoading loader={loading}/>

      <Portal>
        <Modal visible={visible}  contentContainerStyle={styles.containerStyle} theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.6)' } }}>
            <Image source={ICONS.SUCCESS}  style={styles.imgstyle}/>
          <Text style={{...defaultStyles.header}}>Success.</Text>

          <Text style={{...defaultStyles.placeholderStyle,color:COLORS.black}}>You are registered Successfully.</Text>
          <ButtonWrapper label={'Ok'} onClick={nextHandler} />
        </Modal>
      </Portal>
    </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  displayFlex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: PADDING.medium,
    paddingTop:PADDING.medium
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
  containerStyle:{
    width:WIDTH*0.9,
    alignSelf:'center',
    height:269,
    backgroundColor:COLORS.white,
    borderRadius:8,
    padding:PADDING.large,
    alignItems:'center',
    justifyContent:'space-between'
  },
  imgstyle:{
    height:68,
    width:68,
    resizeMode:'contain',
    marginTop:PADDING.small
  }
});

export default CreateAccount;
