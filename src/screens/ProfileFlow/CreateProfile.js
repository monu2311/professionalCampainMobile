/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GradientWrapper from '../../components/GradientWrapper';
import {Card} from 'react-native-paper';
import {COLORS, HEIGHT, PADDING, WIDTH} from '../../constants/theme';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import {useNavigation} from '@react-navigation/native';

const CreateProfile = () => {
  const navigation = useNavigation();

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
          <Text style={heading}>Creating your profile</Text>
          <Text
            style={{...defaultStyles.placeholderStyle, color: COLORS.black}}>
            Step 1 of 6
          </Text>
        </View>
        <View style={{width:'100%',alignItems:'center',justifyContent:'space-between',paddingVertical:14}}>
          <Text style={heading1}>Thank you for</Text>
          <Text style={heading1}>
            Signing up with{' '}
            <Text style={{color: COLORS.mainColor}}>Professional</Text>
          </Text>
          <Text style={heading}> Companionship</Text>
          <Text
            style={{...defaultStyles.placeholderStyle, color: COLORS.black,marginTop:PADDING.small}}>
            You can navigate by clicking the gold buttons below
          </Text>
          <Text style={{...defaultStyles.placeholderStyle, color: COLORS.mainColor,marginVertical:PADDING.medium}}>
            Click “Next” to start creating your profile
          </Text>
          <ButtonWrapper label={'Next'} onClick={handleSubmit} />
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
