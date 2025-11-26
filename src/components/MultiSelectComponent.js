import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../constants/theme';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const MultiSelectComponent = () => {
  const [selected, setSelected] = useState([]);

  const getLabel = (value) => {
    const item = data.find(d => d.value === value);
    return item ? item.label : '';
  };

  const getDisplayText = () => {
    if (selected.length === 0) return 'Select item';
    if (selected.length === 1) return getLabel(selected[0]);
    return `${getLabel(selected[0])} +${selected.length - 1}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.customSelectedText}>{getDisplayText()}</Text>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        value={selected}
        search
        searchPlaceholder="Search..."
        onChange={item => {
          setSelected(item);
        }}
        inside={true}
        renderItem={() => {
          if (selected.length === 0) {
            return (
              <View style={styles.item}>
                <Text style={styles.itemText}>Select item</Text>
              </View>
            );
          }
        
          const firstLabel = getLabel(selected[0]);
          const extraCount = selected.length - 1;
          const displayText = extraCount > 0 ? `${firstLabel} +${extraCount}` : firstLabel;
        
          return (
            <View style={styles.item}>
              <Text style={styles.itemText}>{displayText}</Text>
            </View>
          );
        }}
        
        
        visibleSelectedItem={false} // Hide default selected chips
      />
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customSelectedText: {
    marginBottom: 8,
    fontSize: 16,
    color: 'black',
  },
});
