/* eslint-disable react-native/no-inline-styles */
import React, {useLayoutEffect} from 'react';
import {View, StyleSheet, Pressable, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, HEIGHT, IOS, PADDING} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import {useNavigation} from '@react-navigation/native';
const ChatHeader = ({label, step, data, showRequestButton = true}) => {
  const statusHeight = 40;
  const statusHeightAndroid = 10;

  const navigateion = useNavigation();

  const backHandler = () => {
    navigateion.goBack();
  };

  const handleChatRequests = () => {
    navigateion.navigate('ChatRequests');
  };

  return (
    <View style={{backgroundColor: COLORS.white}}>
      <View
        style={{
          alignItems: 'center',
          height: IOS ? (step ? HEIGHT * 0.15 : HEIGHT * 0.13) : HEIGHT * 0.09,
          paddingTop: IOS
            ? step
              ? statusHeight
              : statusHeight + 10
            : statusHeightAndroid,
          flexDirection: 'row',
          marginHorizontal: PADDING.medium,
          borderBottomColor: COLORS.boxColor,
          borderBottomWidth: 1,
          backgroundColor: COLORS.white,
        }}>
        <Pressable style={{flex: 0.1}} onPress={backHandler}>
          <Icon name="arrow-back" size={24} color={COLORS.mainColor} />
        </Pressable>

        <View style={{display:'flex',alignItems:'center',flexDirection:'row', flex: 1}}>
          <View>
            <Image source={{uri : data?.image}}  style={styles.imageStyle} />
          </View>
          <View style={{marginLeft:10, flex: 1}}>
            <Text style={{...defaultStyles.header, fontSize: 18,color:COLORS?.textColor}}>
              {data?.name || 'Messages'}
            </Text>
            {data?.lastmessage && (
              <Text style={{...defaultStyles.placeholderStyle, color: '#B0B0B0', fontSize: 12}}>
                {data?.lastmessage}
              </Text>
            )}
          </View>
        </View>

        {showRequestButton && !data?.name && (
          <Pressable style={styles.requestButton} onPress={handleChatRequests}>
            <Icon name="person-add" size={22} color={COLORS.mainColor} />
            <View style={styles.requestBadge}>
              <Text style={styles.requestBadgeText}>3</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backSytle: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  imageStyle:{
    marginLeft:PADDING.medium,
    marginHorizontal: PADDING.small,
    width:40,
    height:40,
    borderRadius:100,
    resizeMode:'stretch'
  },
  requestButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(47, 48, 145, 0.1)',
  },
  requestBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff3040',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});

export default ChatHeader;
