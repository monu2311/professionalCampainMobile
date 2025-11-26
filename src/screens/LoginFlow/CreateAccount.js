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
import { fetchAllAPIs } from '../../apiConfig/Services';

const CreateAccount = () => {
  const dropDownData = useSelector((state)=>state.dropDown);
  // console.log("dropDownDatadropDownData",dropDownData)
  const navigation = useNavigation();
  const  route = useRoute();
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [loading,setLoading] =  useState(false);
  const [member,setMember] =  useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  

  const  nextHandler = ()=>{
    hideModal();
    console.log("jashdkjas",member);
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
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  
      confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  
    gender: Yup.string()
      .required('Gender is required'),
  
    country: Yup.string()
      .required('Country is required'),
  
    state: Yup.number()
      .required('State is required'),
  
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
      console.log("success--->",response)
      if(response?.status ===1){
        await AsyncStorage.setItem("ChapToken",response?.token)
        showModal();
      }
    } catch (error) {
      console.log("error--->",error)
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
                }}>
                Create Profile with
              </Text>
              {/* {console.log("kasjdasjdjkasdjk",error)} */}
              <Text
                style={{
                  ...defaultStyles.header,
                  ...styles.heading,
                  marginTop: 0,
                  marginBottom: PADDING.medium,
                }}>
                Professional Companionship
              </Text>
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
              />
              <CustomTextInput
                label="Confirm Password *"
                placeholder="Confirm Password"
                name="confirm_password"
              />
              <Select
                label="Gender *"
                placeholder="Gender"
                name="gender"
                data={genderList}
                containerStyle={{width: WIDTH * 0.91}}
              />
              <Select
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
              />
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
                    onPress={() => navigation.navigate('singup')}>
                    {'Terms and Conditions'}
                  </Text>
                </Text>
              </View>

              <View style={{marginTop: PADDING.small}}>
                <ButtonWrapper label={'Sing Up'} onClick={handleSubmit} />
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
