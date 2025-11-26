import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { PatternLock } from '@shanshang/react-native-pattern-lock';

const PatternLockScreen = () => {
  const [message, setMessage] = useState('Draw your unlock pattern');

  const handleCheck = (pattern) => {
    const correctPattern = [0, 1, 2, 4, 7]; // indexes of dots

    if (JSON.stringify(pattern) === JSON.stringify(correctPattern)) {
      setMessage('Pattern correct 🎉');
      Alert.alert('Unlocked!');
    } else {
      setMessage('Wrong pattern ❌');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <PatternLock
        rowCount={3}             // 3 rows
        columnCount={3}          // 3 columns
        normalColor="#999"
        activeColor="#4CAF50"
        errorColor="#E91E63"
        onCheck={handleCheck}    // callback when user finishes
      />
    </View>
  );
};

export default PatternLockScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginBottom: 20, fontSize: 18, fontWeight: '500' },
});
