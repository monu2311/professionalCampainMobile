/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import {COLORS, PADDING, TYPOGRAPHY} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import {showSuccessMessage, showErrorMessage} from '../../utils/messageHelpers';

const ChatRequestList = () => {
  const navigation = useNavigation();
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b9c2a4fd?w=400',
      message: 'Hi! I saw your profile and would love to chat.',
      time: '2 hours ago',
      verified: true
    },
    {
      id: 2,
      name: 'Emily Davis',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      message: 'Hello there! Hope you\'re having a great day.',
      time: '5 hours ago',
      verified: false
    },
    {
      id: 3,
      name: 'Jessica Wilson',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      message: 'Would love to connect and chat!',
      time: '1 day ago',
      verified: true
    }
  ]);

  const handleAcceptRequest = (requestId, user) => {
    Alert.alert(
      'Accept Request',
      `Accept chat request from ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          style: 'default',
          onPress: () => {
            // Remove from requests and add to chat list
            setRequests(prev => prev.filter(req => req.id !== requestId));
            showSuccessMessage('Request Accepted', `You can now chat with ${user.name}`);

            // Navigate to chat
            navigation.navigate('Chat', {
              routeData: {
                userDetails: {
                  id: user.id,
                  name: user.name,
                  image: user.image
                },
                userChatHistory: {}
              }
            });
          },
        },
      ]
    );
  };

  const handleDeclineRequest = (requestId, userName) => {
    Alert.alert(
      'Decline Request',
      `Decline chat request from ${userName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            setRequests(prev => prev.filter(req => req.id !== requestId));
            showSuccessMessage('Request Declined', 'The request has been removed');
          },
        },
      ]
    );
  };

  const renderRequestItem = ({item}) => (
    <View style={styles.requestItem}>
      <FastImage
        style={styles.profileImage}
        source={{
          uri: item.image,
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.requestContent}>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.verified && (
            <Icon name="verified" size={16} color="#1DA1F2" style={styles.verifiedIcon} />
          )}
        </View>

        <Text style={styles.requestMessage} numberOfLines={2}>
          {item.message}
        </Text>

        <Text style={styles.requestTime}>{item.time}</Text>

        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDeclineRequest(item.id, item.name)}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAcceptRequest(item.id, item)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="inbox" size={80} color={COLORS.placeHolderColor} />
      <Text style={styles.emptyStateTitle}>No Chat Requests</Text>
      <Text style={styles.emptyStateText}>
        When someone wants to chat with you, their requests will appear here.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Requests</Text>
        <Text style={styles.headerSubtitle}>
          {requests.length} pending request{requests.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: PADDING.large,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  listContainer: {
    padding: PADDING.medium,
    paddingBottom: 100,
  },
  requestItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: PADDING.large,
    marginBottom: PADDING.medium,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: PADDING.medium,
  },
  requestContent: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  requestMessage: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 20,
    marginBottom: 8,
  },
  requestTime: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: PADDING.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  acceptButton: {
    backgroundColor: COLORS.specialTextColor,
  },
  declineButtonText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
  },
  acceptButtonText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: PADDING.large,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginTop: PADDING.medium,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatRequestList;