import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, PADDING, TYPOGRAPHY, SHADOW } from '../../constants/theme';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getChatHistory } from '../../reduxSlice/apiSlice';
import { RefreshControl } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ContentProtection from '../../components/ContentProtection';
import ChatService from '../../services/ChatService';
import membershipService from '../../services/MembershipService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab constants
const TABS = [
  { id: 'users', label: 'Users', icon: 'chat' },
  { id: 'received', label: 'Received', icon: 'inbox' },
  { id: 'sent', label: 'Sent', icon: 'send' },
];

// Animated Chat Item Component for Users Tab
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
        <View style={styles.chatItemBackground}>
          {item?.count > 0 && (
            <LinearGradient
              colors={['rgba(47, 48, 145, 0.05)', 'rgba(47, 48, 145, 0.02)']}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <FastImage
              style={styles.avatar}
              source={{
                uri: item?.profile_file,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            {item?.online && (
              <View style={styles.onlineRing}>
                <View style={styles.onlineIndicator} />
              </View>
            )}

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
                {item?.user_name}
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

// Animated Request Item Component for Request Tabs
const AnimatedRequestItem = ({ item, index, onPress, type = 'received' }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;

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
    ]).start();
  }, [index]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FFA500';
      case 'approved': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'cancelled': return '#9E9E9E';
      default: return '#FFA500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log("---Item______", item)

  return (
    <Animated.View
      style={[
        styles.requestItemContainer,
        {
          opacity: animatedValue,
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <Pressable style={styles.requestItem} onPress={() => onPress(item)}>
        <View style={styles.requestHeader}>
          <View style={styles.requestUserInfo}>
            <FastImage
              style={styles.requestAvatar}
              source={{
                uri: item?.requester?.profile_url || item?.receiver?.profile_url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.requestTextContainer}>
              <Text style={styles.requestUserName} numberOfLines={1}>
                {type === 'received' ? item?.requester?.name : item?.receiver?.name}
              </Text>
              <Text style={styles.requestDate}>
                {formatDate(item?.created_at)}
              </Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item?.status) }]}>
            <Text style={styles.statusText}>{item?.status || 'Pending'}</Text>
          </View>
        </View>

        {item?.message && (
          <Text style={styles.requestMessage} numberOfLines={2}>
            "{item?.message}"
          </Text>
        )}

        {type === 'received' && item?.status === 'pending' && (
          <View style={styles.requestActions}>
            <Pressable
              style={[styles.requestActionButton, styles.approveButton]}
              onPress={() => onPress(item, 'approve')}
            >
              <Icon name="check" size={16} color={COLORS.white} />
              <Text style={styles.requestActionText}>Accept</Text>
            </Pressable>
            <Pressable
              style={[styles.requestActionButton, styles.rejectButton]}
              onPress={() => onPress(item, 'reject')}
            >
              <Icon name="close" size={16} color={COLORS.white} />
              <Text style={styles.requestActionText}>Decline</Text>
            </Pressable>
          </View>
        )}

        {type === 'sent' && item?.status === 'pending' && (
          <View style={styles.requestActions}>
            <Pressable
              style={[styles.requestActionButton, styles.cancelButton]}
              onPress={() => onPress(item, 'cancel')}
            >
              <Icon name="cancel" size={16} color={COLORS.white} />
              <Text style={styles.requestActionText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const UserChatListEnhanced = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // State management
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(false);

  const profileData = useSelector(state => state.profile?.user_profile);
  const fullProfile = useSelector(state => state.profile);

  // Check if content should be blocked due to expired membership
  useEffect(() => {
    const checkContentBlock = async () => {
      const shouldBlock = await membershipService.shouldBlockContent();
      setIsContentBlocked(shouldBlock);
    };

    if (fullProfile?.user_profile) {
      checkContentBlock();
    }
  }, [fullProfile]);

  // Tab-specific data states
  const [usersData, setUsersData] = useState({
    data: [],
    page: 1,
    hasMore: true,
    loading: false,
    totalCount: 0,
  });

  const [receivedData, setReceivedData] = useState({
    data: [],
    page: 1,
    hasMore: true,
    loading: false,
    totalCount: 0,
  });

  const [sentData, setSentData] = useState({
    data: [],
    page: 1,
    hasMore: true,
    loading: false,
    totalCount: 0,
  });

  // Animation values
  const listOpacity = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.9)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const searchHeight = useRef(new Animated.Value(0)).current;

  // Debounced search
  const searchTimeout = useRef(null);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      // Reset pagination and reload data with search query
      if (activeTab === 'users') {
        setUsersData(prev => ({ ...prev, page: 1, data: [] }));
        loadUsersData(1, query);
      } else if (activeTab === 'received') {
        setReceivedData(prev => ({ ...prev, page: 1, data: [] }));
        loadReceivedData(1, query);
      } else if (activeTab === 'sent') {
        setSentData(prev => ({ ...prev, page: 1, data: [] }));
        loadSentData(1, query);
      }
    }, 500);
  }, [activeTab]);

  // Load data functions
  const loadUsersData = async (page = 1, search = '') => {
    if (usersData.loading) return;

    setUsersData(prev => ({ ...prev, loading: true }));

    try {
      const result = await ChatService.acceptedChat(profileData?.user_id, dispatch);

      if (result?.data?.length > 0) {
        setUsersData(prev => ({
          data: page === 1 ? result.data : [...prev.data, ...result.data],
          page: page,
          hasMore: false, // Users tab typically shows all chats at once
          loading: false,
          totalCount: result.data.length,
        }));
      } else {
        setUsersData(prev => ({
          ...prev,
          data: page === 1 ? [] : prev.data,
          loading: false,
          hasMore: false,
        }));
      }

    } catch (error) {
      console.error('Load users error:', error);
      setUsersData(prev => ({ ...prev, loading: false }));
    }
  };

  const loadReceivedData = async (page = 1, search = '') => {
    if (receivedData.loading) return;

    setReceivedData(prev => ({ ...prev, loading: true }));

    try {
      const result = await ChatService.getPendingRequests(dispatch, page, 20, search);

      if (result.success) {
        setReceivedData(prev => ({
          data: page === 1 ? result.requests : [...prev.data, ...result.requests],
          page: result.currentPage,
          hasMore: result.hasMore,
          loading: false,
          totalCount: result.totalCount,
        }));
      }
    } catch (error) {
      console.error('Load received requests error:', error);
      setReceivedData(prev => ({ ...prev, loading: false }));
    }
  };

  const loadSentData = async (page = 1, search = '') => {
    if (sentData.loading) return;

    setSentData(prev => ({ ...prev, loading: true }));

    try {
      const result = await ChatService.getSentRequests(dispatch, page, 20, search);

      if (result.success) {
        setSentData(prev => ({
          data: page === 1 ? result.requests : [...prev.data, ...result.requests],
          page: result.currentPage,
          hasMore: result.hasMore,
          loading: false,
          totalCount: result.totalCount,
        }));
      }
    } catch (error) {
      console.error('Load sent requests error:', error);
      setSentData(prev => ({ ...prev, loading: false }));
    }
  };

  // Load more data on scroll end
  const handleLoadMore = () => {
    if (activeTab === 'users' && usersData.hasMore && !usersData.loading) {
      loadUsersData(usersData.page + 1, searchQuery);
    } else if (activeTab === 'received' && receivedData.hasMore && !receivedData.loading) {
      loadReceivedData(receivedData.page + 1, searchQuery);
    } else if (activeTab === 'sent' && sentData.hasMore && !sentData.loading) {
      loadSentData(sentData.page + 1, searchQuery);
    }
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    const tabIndex = TABS.findIndex(tab => tab.id === tabId);
    const indicatorPosition = (SCREEN_WIDTH / TABS.length) * tabIndex + (SCREEN_WIDTH / TABS.length / 2 - 20);

    Animated.spring(tabIndicatorPosition, {
      toValue: indicatorPosition,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    setActiveTab(tabId);

    // Load data for the new tab if not already loaded
    if (tabId === 'users' && usersData.data.length === 0) {
      loadUsersData(1, searchQuery);
    } else if (tabId === 'received' && receivedData.data.length === 0) {
      loadReceivedData(1, searchQuery);
    } else if (tabId === 'sent' && sentData.data.length === 0) {
      loadSentData(1, searchQuery);
    }
  };

  // Handle user chat navigation
  const handleUserChatPress = async (item) => {
    const resend = await dispatch(getChatHistory(item.user_id));
    const payload = {
      userDetails: item,
      userChatHistory: resend?.formatedMessages,
    };
    navigation.navigate('Chat', { routeData: payload });
  };

  // Handle request actions
  const handleRequestAction = async (item, action) => {
    try {
      if (action === 'approve') {
        await ChatService.approveChatRequest(item.id, '', dispatch);
        loadReceivedData(1, searchQuery); // Refresh data
      } else if (action === 'reject') {
        await ChatService.rejectChatRequest(item.id, '', dispatch);
        loadReceivedData(1, searchQuery); // Refresh data
      } else if (action === 'cancel') {
        await ChatService.cancelChatRequest(item.id, dispatch);
        loadSentData(1, searchQuery); // Refresh data
      }
    } catch (error) {
      console.error('Request action error:', error);
    }
  };

  // Toggle search
  const toggleSearch = () => {
    const newShowSearch = !showSearch;
    setShowSearch(newShowSearch);

    Animated.timing(searchHeight, {
      toValue: newShowSearch ? 50 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (!newShowSearch) {
      setSearchQuery('');
      handleSearch('');
    }
  };

  // Refresh data
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    if (activeTab === 'users') {
      setUsersData(prev => ({ ...prev, page: 1, data: [] }));
      loadUsersData(1, searchQuery);
    } else if (activeTab === 'received') {
      setReceivedData(prev => ({ ...prev, page: 1, data: [] }));
      loadReceivedData(1, searchQuery);
    } else if (activeTab === 'sent') {
      setSentData(prev => ({ ...prev, page: 1, data: [] }));
      loadSentData(1, searchQuery);
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [activeTab, searchQuery]);

  // Initialize data
  useEffect(() => {
    if (isFocused) {
      // Animate appearance
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

      // Load initial data
      loadUsersData(1, searchQuery);
    }
  }, [isFocused]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'users': return usersData;
      case 'received': return receivedData;
      case 'sent': return sentData;
      default: return usersData;
    }
  };

  const currentData = getCurrentData();

  // Render items based on tab
  const renderItem = ({ item, index }) => {
    if (activeTab === 'users') {
      return (
        <AnimatedChatItem
          item={item}
          index={index}
          onPress={handleUserChatPress}
        />
      );
    } else {
      return (
        <AnimatedRequestItem
          item={item}
          index={index}
          onPress={handleRequestAction}
          type={activeTab}
        />
      );
    }
  };

  // Render footer
  const renderFooter = () => {
    if (!currentData.loading) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLORS.specialTextColor} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      switch (activeTab) {
        case 'users': return searchQuery ? 'No users found for your search' : 'No conversations yet';
        case 'received': return searchQuery ? 'No received requests found' : 'No received requests';
        case 'sent': return searchQuery ? 'No sent requests found' : 'No sent requests';
        default: return 'No data found';
      }
    };

    return (
      <Animated.View style={[styles.emptyState, { opacity: listOpacity }]}>
        <View style={styles.emptyIconContainer}>
          <LinearGradient
            colors={['rgba(47, 48, 145, 0.1)', 'rgba(47, 48, 145, 0.05)']}
            style={styles.emptyIconGradient}
          >
            <Icon
              name={TABS.find(tab => tab.id === activeTab)?.icon || 'chat'}
              size={60}
              color={COLORS.specialTextColor}
            />
          </LinearGradient>
        </View>

        <Text style={styles.emptyStateTitle}>{getEmptyMessage()}</Text>
        <Text style={styles.emptyStateText}>
          {searchQuery ? 'Try adjusting your search terms' : 'Start connecting with people to see content here.'}
        </Text>
      </Animated.View>
    );
  };

  // Render header
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
            {currentData.totalCount || 0} {activeTab === 'users' ? 'conversations' : 'requests'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} onPress={toggleSearch}>
            <Icon name="search" size={24} color={COLORS.specialTextColor} />
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => setShowFilterModal(true)}>
            <Icon name="filter-list" size={24} color={COLORS.specialTextColor} />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { height: searchHeight }]}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={COLORS.placeHolderColor} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${activeTab}...`}
            placeholderTextColor={COLORS.placeHolderColor}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
              <Icon name="close" size={20} color={COLORS.placeHolderColor} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBackground}>
          {TABS.map((tab, index) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => handleTabChange(tab.id)}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? COLORS.specialTextColor : COLORS.placeHolderColor}
              />
              <Text style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel
              ]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* <Animated.View
          style={[
            styles.tabIndicator,
            { left: tabIndicatorPosition }
          ]}
        /> */}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
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
            data={currentData.data}
            contentInsetAdjustmentBehavior="always"
            style={styles.flatList}
            contentContainerStyle={styles.listContent}
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyState}
            // ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ItemSeparatorComponent={ItemSeparator}
          />
        </Animated.View>
      </ContentProtection>

      {/* Content Blocking Overlay for Expired Members */}
      {/* {isContentBlocked && (
        <View style={StyleSheet.absoluteFillObject}>
          <View style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 99998,
            elevation: 998,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 30,
              borderRadius: 20,
              alignItems: 'center',
              marginHorizontal: 20,
            }}>
              <Icon name="lock" size={60} color={COLORS.white} style={{ marginBottom: 20 }} />
              <Text style={{
                fontSize: 20,
                fontFamily: TYPOGRAPHY.QUICKBLOD,
                color: COLORS.white,
                textAlign: 'center',
                marginBottom: 10,
              }}>
                Chat Locked
              </Text>
              <Text style={{
                fontSize: 16,
                fontFamily: TYPOGRAPHY.QUICKREGULAR,
                color: COLORS.white,
                textAlign: 'center',
                opacity: 0.9,
              }}>
                Your membership has expired. Please renew to continue messaging.
              </Text>
            </View>
          </View>
        </View>
      )} */}
    </View>
  );
};

export default UserChatListEnhanced;

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
    paddingTop: Platform.OS === 'ios' ? 44 + 160 : 200, // Account for header + tabs + search
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

  // Search Styles
  searchContainer: {
    marginTop: PADDING.medium,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    paddingHorizontal: PADDING.medium,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: PADDING.small,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
  },

  // Tab Styles
  tabContainer: {
    marginTop: PADDING.medium,
    position: 'relative',
  },
  tabBackground: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.small,
    paddingHorizontal: PADDING.medium,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    ...SHADOW.light,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  activeTabLabel: {
    color: COLORS.specialTextColor,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 40,
    height: 3,
    backgroundColor: COLORS.specialTextColor,
    borderRadius: 2,
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

  // Request Item Styles
  requestItemContainer: {
    marginHorizontal: PADDING.medium,
    marginVertical: 4,
  },
  requestItem: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: PADDING.medium,
    ...SHADOW.light,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.small,
  },
  requestUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: PADDING.medium,
  },
  requestTextContainer: {
    flex: 1,
  },
  requestUserName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  statusBadge: {
    paddingHorizontal: PADDING.small,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  requestMessage: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontStyle: 'italic',
    marginBottom: PADDING.medium,
    lineHeight: 18,
  },
  requestActions: {
    flexDirection: 'row',
    gap: PADDING.small,
  },
  requestActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.small,
    borderRadius: 25,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  requestActionText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
  },

  // Loading Footer
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.large,
    gap: PADDING.small,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
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

  // Separator
  separator: {
    height: 1,
  },
});

// Separator Component
const ItemSeparator = () => <View style={styles.separator} />;