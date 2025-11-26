// import React from 'react';
// import {View, StyleSheet, Pressable, Text} from 'react-native';
// import {COLORS, TYPOGRAPHY} from '../constants/theme';

// const OutlinedButton = ({
//   children,
//   colors = ['#5ADAE3', '#0551AF'],
//   buttonMainStyle,
//   label,
//   onClick,
//   length,
// }) => {
//   return (
//     <View style={{padding: 10, width: length ?? '100%', ...buttonMainStyle}}>
//       <Pressable style={styles.content} onPress={onClick}>
//         <Text style={styles.text}>{label}</Text>
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   content: {
//     width: '100%',
//     height: 46,
//     // backgroundColor:COLORS.mainColor,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: COLORS.mainColor,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   text: {
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.mainColor,
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default OutlinedButton;

import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, TYPOGRAPHY} from '../constants/theme';

const OutlinedButton = ({
  colors = [COLORS.mainColor, COLORS.mainColor], // Use solid color border
  label,
  onClick,
  length
}) => {
  return (
    <LinearGradient
      colors={colors}
      style={{...styles.borderGradient, width: length ?? '60%'}}>
      <TouchableOpacity
        onPress={onClick}
        style={{
          ...styles.buttonInside,
          backgroundColor: COLORS.white,
        }}
        activeOpacity={1.0}>
        <Text style={{...styles.buttonText,color:COLORS.mainColor}}>{label}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  borderGradient: {
    width: '60%',
    height: 46,
    borderRadius: 10, // Updated to 10px border radius
  },
  buttonInside: {
    borderRadius: 10, // Updated to 10px border radius
    height: 44,
    margin: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.mainColor,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OutlinedButton;
