/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, HEIGHT, PADDING, WIDTH} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';
import { useRTL } from '../../localization/hooks/useRTL';

const Vedio = () => {
  const navigation = useNavigation();
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.COMMON]);
  const rtl = useRTL();
  const clickhandler = () => {
      navigation.goBack();


  };

  const RenderHeader = ({
    onClick,
    Title,
    subtitle,
    deletICon,
  }) => {
    return (
      <View style={styles.flexstyle}>
        <View>
          <Text style={{...defaultStyles.header, fontSize: 22}}>{Title}</Text>
          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
              marginTop: PADDING.small / 2,
            }}>
            {subtitle}
          </Text>
        </View>

        <View
          style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
          {deletICon && (
            <Pressable onPress={onClick}>
              <Image source={ICONS.DELETICON} style={styles.deletedtyles} />
            </Pressable>
          )}

          <Pressable onPress={onClick}>
            <Image source={ICONS.ADDDICON} style={styles.addStyles} />
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <ScrollView style={{backgroundColor:COLORS.white}} contentContainerStyle={{padding: PADDING.small,paddingBottom:PADDING.large,backgroundColor:COLORS.white}}>
      <View>
        <RenderHeader
          onClick={clickhandler}
          Title={'Gallery Videos'}
          subtitle={'Upload Images'}
          deletICon={false}
        />
        <View
          style={{
            ...styles.flexstyle,
            justifyContent: 'flex-start',
            paddingTop: 0,
          }}>
          <View style={styles.boxStyles} />
        </View>

        <ButtonWrapper onClick={clickhandler} label={t('common:buttons.update')} buttonMainStyle={{alignSelf: rtl.isRTL ? 'flex-start' : 'flex-end',width:'36%'}}/>
      </View>
    </ScrollView>
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
});

export default Vedio;
