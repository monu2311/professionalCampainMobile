/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GradientWrapper from '../../components/GradientWrapper';
import {Card} from 'react-native-paper';
import {COLORS, HEIGHT, PADDING, WIDTH} from '../../constants/theme';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {useNavigation} from '@react-navigation/native';

const Submit = () => {
  const navigation = useNavigation();

  const handleSubmit = () => {
    navigation.navigate('Home');
  };
  const heading = {
    ...defaultStyles.header,
    color: COLORS.mainColor,
    fontSize: 20,
  };
  const heading1 = {
    ...defaultStyles.header,
    color: COLORS.black,
    fontSize: 20,
    alignSelf: 'center',
    textAlign: 'center',
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
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: PADDING.small,
            paddingTop:PADDING.medium,
          }}>
          <Text style={heading1}>Submit your Profile</Text>

          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
              marginVertical: PADDING.small,
            }}>
            By submitting your profile it will go into moderation.
          </Text>
          <Text
            style={{...defaultStyles.placeholderStyle, color: COLORS.black,lineHeight:22,textAlign:'center',paddingHorizontal:PADDING.medium}}>
            Once your profile is approved, you will receive a confirmation email
            about your payment and your profile will go online within 24 hours.
          </Text>
          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.mainColor,
              marginTop:PADDING.small,
              marginVertical: PADDING.medium,
              paddingHorizontal:PADDING.medium,
              textAlign:'center',
              lineHeight:22
            }}>
            {"You will then have the ability to access and edit all \n aspects of your profile."}
          </Text>
          <ButtonWrapper label={'Submit'} onClick={handleSubmit} />
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
    height: HEIGHT*0.325,
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

export default Submit;
