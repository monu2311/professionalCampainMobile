import React, {useCallback, useEffect, useState, useRef} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View, Animated, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, PADDING, TYPOGRAPHY, SHADOW} from '../../constants/theme';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getChatAllUser, getChatHistory} from '../../reduxSlice/apiSlice';
import {fetchProfile} from '../../apiConfig/Services';
import {RefreshControl} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ContentProtection from '../../components/ContentProtection';


// Animated Chat Item Component
const AnimatedChatItem = ({ item, index, onPress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const slideValue = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const delay = index * 100;

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(slideValue, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, animatedValue, scaleValue, slideValue]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(item);
  };

  return (
    <Animated.View
      style={[
        styles.chatItemContainer,
        {
          opacity: animatedValue,
          transform: [
            { scale: scaleValue },
            { translateX: slideValue }
          ],
        },
      ]}
    >
      <Pressable style={styles.chatItem} onPress={handlePress}>
        {/* Background Gradient */}
        <View style={styles.chatItemBackground}>
          {item?.count > 0 && (
            <LinearGradient
              colors={['rgba(47, 48, 145, 0.05)', 'rgba(47, 48, 145, 0.02)']}
              style={styles.gradientBackground}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            />
          )}
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: item?.image,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            {/* Online Status Ring */}
            {item?.online && (
              <View style={styles.onlineRing}>
                <View style={styles.onlineIndicator} />
              </View>
            )}

            {/* Message Count Badge */}
            {item?.count > 0 && (
              <View style={styles.messageBadge}>
                <Text style={styles.badgeText}>
                  {item?.count > 99 ? '99+' : item?.count}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.headerRow}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {item?.name}
              </Text>
              {item?.online && (
                <View style={styles.onlineTextContainer}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Active now</Text>
                </View>
              )}
            </View>

            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(item?.last_message_time) || '14:32'}
              </Text>
              {item?.count === 0 && (
                <Icon name="done-all" size={16} color={COLORS.specialTextColor} />
              )}
            </View>
          </View>

          <View style={styles.messageRow}>
            <Text
              style={[
                styles.lastMessage,
                item?.count > 0 && styles.unreadMessage
              ]}
              numberOfLines={2}
            >
              {item?.latest_message || 'omg, this is amazing'}
            </Text>
          </View>
        </View>

        {/* Right Action Indicator */}
        <View style={styles.actionSection}>
          <Icon
            name="keyboard-arrow-right"
            size={24}
            color={COLORS.placeHolderColor}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const UserChatList = () => {
  const profileData = useSelector(
    state => state?.auth?.data?.getChatAllUser?.data,
  );
  const dispatch = useDispatch();
  const filteredChatList = profileData?.filter(item => item?.name);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const listOpacity = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.9)).current;

  const nexthandler = async item => {
    const resend = await dispatch(getChatHistory(item.id));
    const payload = {
      userDetails: item,
      userChatHistory: resend?.formatedMessages,
    };
    navigation.navigate('Chat', {routeData: payload});
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchProfile(dispatch);

      // Animate list appearance
      Animated.parallel([
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(headerScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  }, [isFocused, dispatch, listOpacity, headerScale]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getChatAllUser());
    fetchProfile(dispatch);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [dispatch]);

  const renderChatItem = ({item, index}) => (
    <AnimatedChatItem
      item={item}
      index={index}
      onPress={nexthandler}
    />
  );

  const renderEmptyState = () => (
    <Animated.View style={[styles.emptyState, { opacity: listOpacity }]}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={['rgba(47, 48, 145, 0.1)', 'rgba(47, 48, 145, 0.05)']}
          style={styles.emptyIconGradient}
        >
          <Icon name="chat-bubble-outline" size={60} color={COLORS.specialTextColor} />
        </LinearGradient>
      </View>

      <Text style={styles.emptyStateTitle}>No Conversations Yet</Text>
      <Text style={styles.emptyStateText}>
        Start connecting with people to see your conversations here.
      </Text>

      <Pressable style={styles.emptyActionButton}>
        <LinearGradient
          colors={[COLORS.specialTextColor, '#4a4db8']}
          style={styles.emptyButtonGradient}
        >
          <Icon name="add" size={20} color={COLORS.white} />
          <Text style={styles.emptyButtonText}>Start Chatting</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: listOpacity,
          transform: [{ scale: headerScale }]
        }
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            {filteredChatList?.length || 0} conversations
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton}>
            <Icon name="search" size={24} color={COLORS.specialTextColor} />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Icon name="filter-list" size={24} color={COLORS.specialTextColor} />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Icon name="edit" size={24} color={COLORS.specialTextColor} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      {renderHeader()}

      <ContentProtection style={styles.contentContainer}>
        <Animated.View style={[styles.listContainer, { opacity: listOpacity }]}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.specialTextColor}
              colors={[COLORS.specialTextColor]}
            />
          }
          data={filteredChatList}
          contentInsetAdjustmentBehavior="always"
          style={styles.flatList}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={renderChatItem}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          ItemSeparatorComponent={ItemSeparator}
        />
        </Animated.View>
      </ContentProtection>
    </View>
  );
};

export default UserChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingTop: Platform.OS === 'ios' ? 44 + 80 : 120, // Account for sticky header height
    paddingBottom: 100,
  },

  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.large,
    paddingTop: Platform.OS === 'ios' ? 44 + PADDING.large : PADDING.large,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    ...SHADOW.light,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  headerActions: {
    flexDirection: 'row',
    gap: PADDING.small,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(47, 48, 145, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Chat Item Styles
  chatItemContainer: {
    marginHorizontal: PADDING.medium,
    marginVertical: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: PADDING.medium,
    ...SHADOW.light,
    position: 'relative',
    overflow: 'hidden',
  },
  chatItemBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 16,
  },

  // Avatar Section
  avatarSection: {
    marginRight: PADDING.medium,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(47, 48, 145, 0.1)',
  },
  onlineRing: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.light,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00CB07',
  },
  messageBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.specialTextColor,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    ...SHADOW.light,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },

  // Content Section
  contentSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 2,
  },
  onlineTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00CB07',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: '#00CB07',
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginLeft: PADDING.small,
  },
  timeText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: 2,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    flex: 1,
    lineHeight: 18,
  },
  unreadMessage: {
    color: COLORS.textColor,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
  },

  // Action Section
  actionSection: {
    marginLeft: PADDING.small,
    justifyContent: 'center',
  },

  // Separator
  separator: {
    height: 1,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: PADDING.large,
  },
  emptyIconContainer: {
    marginBottom: PADDING.extralarge,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: PADDING.medium,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: PADDING.extralarge,
  },
  emptyActionButton: {
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOW.button,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.extralarge,
    paddingVertical: PADDING.medium,
    gap: PADDING.small,
  },
  emptyButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
  },
});

// Separator Component
const ItemSeparator = () => <View style={styles.separator} />;