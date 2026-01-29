/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GradientWrapper from '../../components/GradientWrapper';
import {Card} from 'react-native-paper';
import {COLORS, HEIGHT, PADDING, WIDTH} from '../../constants/theme';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';
import { useRTL } from '../../localization/hooks/useRTL';

const CreateProfile = () => {
  const navigation = useNavigation();
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.COMMON]);
  const rtl = useRTL();

  const handleSubmit = () => {
    navigation.navigate('CreateProfile1');
  };
  const heading = {
    ...defaultStyles.header,
    color: COLORS.specialTextColor,
    fontSize: 20,
  };
  const heading1 = {
    ...defaultStyles.header,
    color: COLORS.textColor,
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
    writingDirection: rtl.getCurrentDirection(),
    // padding: PADDING.medium,
  };
  return (
    <GradientWrapper>
      <Card
        mode="contained"
        style={styles.cardStyle}
        contentStyle={styles.cardConatinStyle}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            borderBottomColor: COLORS.boxColor,
            borderBottomWidth: 1,
            padding: PADDING.large,
          }}>
          <Text style={heading}>{t('screens:profile.creatingProfile')}</Text>
          <Text
            style={{...defaultStyles.placeholderStyle, color: COLORS.black, textAlign: 'center', writingDirection: rtl.getCurrentDirection()}}>
            {t('screens:profile.stepCounter', 'Step {{step}} of {{total}}', { step: 1, total: 6 })}
          </Text>
        </View>
        <View style={{width:'100%',alignItems:'center',justifyContent:'space-between',paddingVertical:14}}>
          <Text style={heading1}>{t('screens:profile.thankYou')}</Text>
          <Text style={heading1}>
            {t('screens:profile.signingUpWith')}{' '}
            <Text style={{color: COLORS.mainColor}}>{t('common:appName.professional')}</Text>
          </Text>
          <Text style={heading}>{t('common:appName.companionship')}</Text>
          <Text
            style={{...defaultStyles.placeholderStyle, color: COLORS.black,marginTop:PADDING.small, textAlign: 'center', writingDirection: rtl.getCurrentDirection()}}>
            {t('screens:profile.navigationInstruction')}
          </Text>
          <Text style={{...defaultStyles.placeholderStyle, color: COLORS.mainColor,marginVertical:PADDING.medium, textAlign: 'center', writingDirection: rtl.getCurrentDirection()}}>
            {t('screens:profile.clickNextToStart')}
          </Text>
          <ButtonWrapper label={t('common:buttons.next')} onClick={handleSubmit} />
        </View>
      </Card>
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  cardStyle: {
    backgroundColor: COLORS.white,
    height: HEIGHT*0.389,
    width: WIDTH * 0.9,
    alignSelf: 'center',
    borderColor: COLORS.white,
    borderWidth: 0,
    // flex:1
  },
  cardConatinStyle: {
    borderColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});

export default CreateProfile;
