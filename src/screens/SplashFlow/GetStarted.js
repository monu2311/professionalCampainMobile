/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import {COLORS, PADDING, WIDTH} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import OutlinedButton from '../../components/OutlinedButton';
import GradientButton from '../../components/GradientButton';

const GetStarted = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const nextHandler = (wherenaviagte) => {
    hideModal();
    navigation.navigate(wherenaviagte);
  };
  return (
    <>
    <SafeAreaView style={{backgroundColor:COLORS.white}}/>
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <KeyboardAvoidingScrollView
      contentContainerStyle={{flex:1}}
      >
        <View style={styles.displayFlex}>
          <Image source={ICONS?.LOGO} style={styles.logo} />
          {/* <Text style={{...defaultStyles.buttonTextSmall, marginLeft: 10}}>
            {'Professional \nCompanionship'}
          </Text> */}
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center',paddingBottom:PADDING.small}}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Text style={{...defaultStyles.header,color:COLORS.specialTextColor,fontSize:26}}>Join the Want Some</Text>
            <Text style={{...defaultStyles.header,marginBottom:PADDING.extralarge,color:COLORS.specialTextColor,fontSize:26}}>Company Community</Text>
            <GradientButton
              label={'Get Started'}
              onClick={()=>nextHandler("PleaseSelect")}
              length={WIDTH * 0.6}
            />
            <OutlinedButton
              label={'I already have an account'}
              onClick={()=>nextHandler("Login")}
              length={WIDTH * 0.6}
            />
          </View>
          
        </View>
        <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              marginBottom:PADDING.small,
              width:'100%',
              paddingHorizontal:PADDING.medium
              // backgroundColor:'blue'
            }}>
            <Text
              style={{...defaultStyles.placeholderStyle, color: COLORS.textColor,textAlign:'center'}}>
              By Signing up you agree to the Terms of Services.Privacy Policy
              and community Guidelines.
            </Text>
          </View>
      </KeyboardAvoidingScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  displayFlex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: PADDING.medium,
    paddingTop: PADDING.medium,
    backgroundColor:COLORS.white,
    paddingBottom:PADDING.small
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
  containerStyle: {
    width: WIDTH * 0.9,
    alignSelf: 'center',
    height: 269,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: PADDING.large,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgstyle: {
    height: 68,
    width: 68,
    resizeMode: 'contain',
    marginTop: PADDING.small,
  },
});

export default GetStarted;
