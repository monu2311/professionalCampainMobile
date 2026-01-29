/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, Image, SafeAreaView} from 'react-native';
import {COLORS, HEIGHT, IOS, PADDING, WIDTH} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import {useNavigation} from '@react-navigation/native';
import OutlinedButton from '../../components/OutlinedButton';
import GradientButton from '../../components/GradientButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';

const PleaseSelect = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);

  // Translation hook
  const { t } = useTranslation([NAMESPACES.SCREENS]);

  const hideModal = () => setVisible(false);

  const nextHandler = (wherenaviagte, show) => {
    hideModal();
    const params = {};
    if (show) {
      params.member = true;
    }
    navigation.navigate(wherenaviagte, params);
  };
  return (
    <>
      <SafeAreaView style={{backgroundColor:COLORS.white}}/>
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.displayFlex}>
          <Image source={ICONS.LOGO} style={styles.logo} />
          <Text
            style={{
              ...defaultStyles.buttonTextSmall,
              marginLeft: 10,
            }}>
            {t('screens:splash.professionalCompanionship')}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: PADDING.small,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Text
              style={{
                ...defaultStyles.header,
                color: COLORS.specialTextColor,
                fontSize: 26,
                width: IOS?  WIDTH * 0.9: WIDTH*0.85,
                textAlign: 'center',
                marginBottom:PADDING.large
              }}>
              {t('screens:pleaseSelect.title')}
            </Text>
            <GradientButton
              label={t('screens:pleaseSelect.listAsCompanion')}
              onClick={() => nextHandler('singup', false)}
              length={WIDTH * 0.6}
            />
            <OutlinedButton
              label={t('screens:pleaseSelect.becomeMember')}
              onClick={() => nextHandler('singup', true)}
              length={WIDTH * 0.6}
            />
            <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.textColor,
              textAlign: 'center',
              marginTop:PADDING.large,
              width:WIDTH*0.9
            }}>
            {t('screens:pleaseSelect.memberDescription')}
          </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            marginBottom: PADDING.small,
            width: '100%',
            paddingHorizontal: PADDING.medium,
            // backgroundColor:'blue'
          }}>
          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.textColor,
              textAlign: 'center',
            }}>
            {t('screens:pleaseSelect.companionDescription')}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
    </>
  );
  // return (
  //   <SafeAreaView style={{backgroundColor: COLORS.black, flex: 1}}>
  //     <KeyboardAwareScrollView
  //     contentContainerStyle={{flex:1}}
  //     >
  //       <View style={styles.displayFlex}>
  //         <Image source={ICONS.LOGO} style={styles.logo} />
  //         <Text style={{...defaultStyles.buttonTextSmall, marginLeft: 10,color:COLORS.white}}>
  //           {'Professional \nCompanionship'}
  //         </Text>
  //       </View>
  //       <View style={{flex:1,paddingBottom:PADDING.extralarge,marginTop:PADDING.medium}}>
  //         {/* <Image source={ICONS.LANDING} style={styles.imgstyle}/> */}
  //         <View
  //           style={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             alignSelf: 'center',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             width: '100%',
  //           }}>
  //           <Text style={{...defaultStyles.header,marginVertical:PADDING.large}}>Please Select One Option</Text>
  //           {/* <Text style={{...defaultStyles.header,marginBottom:PADDING.medium}}>Companionship Community</Text> */}
  //           <GradientButton
  //             label={'List as a Companion'}
  //             onClick={()=>nextHandler("singup",false)}
  //             length={WIDTH * 0.6}
  //           />
  //           <OutlinedButton
  //             label={'Become a Member'}
  //             onClick={()=>nextHandler("singup",true)}
  //             length={WIDTH * 0.6}
  //             textColor={COLORS.white}
  //             backgroundColor={COLORS.black}
  //           />
  //         </View>

  //       </View>
  //       <View
  //           style={{
  //             alignItems: 'center',
  //             alignSelf: 'center',
  //             justifyContent: 'center',
  //             marginBottom:PADDING.medium,
  //             width:'100%',
  //             paddingHorizontal:PADDING.medium
  //             // backgroundColor:'blue'
  //           }}>
  //           <Text
  //             style={{...defaultStyles.placeholderStyle, color: COLORS.white,textAlign:'center',textDecorationLine:'underline'}}>
  //            THE EXPERIENCE BEGINS HERE
  //           </Text>
  //         </View>
  //     </KeyboardAwareScrollView>
  //   </SafeAreaView>
  // );
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
    height: HEIGHT * 0.46,
    width: WIDTH * 0.92,
    resizeMode: 'cover',
    alignSelf: 'center',
    // marginHorizontal:PADDING.medium,
    marginTop: PADDING.small,
  },
});

export default PleaseSelect;
