import React, { useState } from 'react'
import { Image, StyleSheet, Text, View, Pressable } from 'react-native'
import Select from '../../components/Select'
import ButtonWrapper from '../../components/ButtonWrapper'
import { COLORS, HEIGHT, PADDING, TYPOGRAPHY, WIDTH } from '../../constants/theme'
import { ChangePassworddata, detailsData, otherQueries, ServiceData } from '../../constants/Static'
import CustomTextInput from '../../components/CustomTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Formik } from 'formik'
import { useNavigation } from '@react-navigation/native'
import { defaultStyles } from '../../constants/Styles'
import LinearGradient from 'react-native-linear-gradient'
import { ICONS } from '../../constants/Icons'
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux'
import { changePassword } from '../../reduxSlice/apiSlice'
import ScreenLoading from '../../components/ScreenLoading'
import Icon from 'react-native-vector-icons/Feather';


const ChangePassword = () => {
  const changePAss = useSelector(state => state?.auth?.data?.changePassword);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // State for password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submitHandler = async(value) => {
      try {
        const data = {...value};
        data["password_confirmation"] = value?.confirm_password;
        const response = await dispatch(changePassword(data));
        if(response?.status == "1" ){
          navigation.navigate('Login')
        }
        console.log("ASDASDA",response)
      } catch (error) {
        console.log("SKAJhdjksah--->",error)
      }
        // navigation.navigate('AdvertisingRate');
      };

      const validationSchema = Yup.object().shape({
        old_password: Yup.string()
          .required('Old password is required'),
      
        password: Yup.string()
          .required('New password is required')
          .min(6, 'Password must be at least 6 characters'),
      
        confirm_password: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm password is required'),
      });


  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: COLORS.white, padding: 5,flex:1}}
      contentContainerStyle={{
        paddingBottom: PADDING.extralarge,
        backgroundColor: COLORS.white,
      }}>
        <Formik
          initialValues={{
            old_password: '',
            password: '',
            confirm_password: '',
          }}
          onSubmit={values => submitHandler(values)}
          validationSchema={validationSchema}
          >
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
                  marginBottom:PADDING.large
                }}>
                Change Password
              </Text>

              {/* Old Password Field */}
              <View style={{width: '100%'}}>
                <CustomTextInput
                  label="Previous Password"
                  placeholder="Enter your current password"
                  name="old_password"
                  secureTextEntry={!showOldPassword}
                  inputContainer={{
                    height: 46,
                  }}
                  rightIcon={
                    <Pressable
                      onPress={() => setShowOldPassword(!showOldPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showOldPassword ? "eye" : "eye-off"}
                        size={20}
                        color={COLORS.placeHolderColor}
                      />
                    </Pressable>
                  }
                />
              </View>

              {/* New Password Field */}
              <View style={{width: '100%'}}>
                <CustomTextInput
                  label="New Password"
                  placeholder="Enter new password"
                  name="password"
                  secureTextEntry={!showNewPassword}
                  inputContainer={{
                    height: 46,
                  }}
                  rightIcon={
                    <Pressable
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showNewPassword ? "eye" : "eye-off"}
                        size={20}
                        color={COLORS.placeHolderColor}
                      />
                    </Pressable>
                  }
                />
              </View>

              {/* Confirm Password Field */}
              <View style={{width: '100%'}}>
                <CustomTextInput
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  name="confirm_password"
                  secureTextEntry={!showConfirmPassword}
                  inputContainer={{
                    height: 46,
                  }}
                  rightIcon={
                    <Pressable
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      <Icon
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={20}
                        color={COLORS.placeHolderColor}
                      />
                    </Pressable>
                  }
                />
              </View>





              <ButtonWrapper
                onClick={handleSubmit}
                label={'Next'}
                buttonMainStyle={{alignSelf: 'flex-end', width: '36%'}}
              />
            </View>
          )}
        </Formik>
        <ScreenLoading loader={changePAss?.isLoading}/>
    </KeyboardAwareScrollView>
  )
}



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
  eyeButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default ChangePassword