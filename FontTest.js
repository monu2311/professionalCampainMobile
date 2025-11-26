import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TYPOGRAPHY } from './src/constants/theme';

const FontTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Font and Icon Test</Text>

      {/* Custom Fonts Test */}
      <Text style={styles.dmSerif}>DMSerifDisplay-Regular: Professional Companionship</Text>
      <Text style={styles.quicksandBold}>Quicksand-Bold: Professional Companionship</Text>
      <Text style={styles.quicksandMedium}>Quicksand-Medium: Professional Companionship</Text>
      <Text style={styles.quicksandRegular}>Quicksand-Regular: Professional Companionship</Text>

      {/* Vector Icons Test */}
      <View style={styles.iconContainer}>
        <Text style={styles.iconTitle}>Vector Icons Test:</Text>
        <View style={styles.iconRow}>
          <Icon name="home" size={30} color="#2f3091" />
          <Icon name="person" size={30} color="#2f3091" />
          <Icon name="message" size={30} color="#2f3091" />
          <FontAwesome name="heart" size={30} color="#2f3091" />
          <FontAwesome name="star" size={30} color="#2f3091" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dmSerif: {
    fontFamily: TYPOGRAPHY.DMSERIF,
    fontSize: 18,
    marginBottom: 10,
    color: '#2f3091',
  },
  quicksandBold: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  quicksandMedium: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  quicksandRegular: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  iconContainer: {
    marginTop: 20,
  },
  iconTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default FontTest;