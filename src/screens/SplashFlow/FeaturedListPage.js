/**
 * FeaturedListPage Screen
 * Full-page vertical list of featured profiles with pagination
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  FadeIn,
} from 'react-native-reanimated';

// Theme and constants
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
  IOS,
} from '../../constants/theme';

// Components
import ProfileCard from '../../components/ProfileCard';
import Nodatafound from '../../components/Nodatafound';
import BlurredHeader from '../../components/BlurredHeader';

// Navigation and Redux
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { search } from '../../reduxSlice/apiSlice';
import { showSuccessMessage, showErrorMessage } from '../../utils/messageHelpers';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const TAB_BAR_HEIGHT = IOS ? 90 : 60;

/**
 * FeaturedListPage Component
 * Displays all featured profiles in a vertical scrollable list
 */
const FeaturedListPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Get data from navigation params or fallback to empty
  const { title = 'Featured', data: initialData = [], filter: initialFilter = {} } = route.params || {};

  // Get filter data from Redux store
  const profileStoreData = useSelector(state => state?.profile);
  const searchData = useSelector(state => state?.auth?.data?.search);

  // State management
  const [profileData, setProfileData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Animation values
  const scrollY = useSharedValue(0);

  /**
   * Handle filter changes from BlurredHeader
   */
  const handleFilterChange = useCallback((newFilter) => {
    dispatch(search(newFilter));
    // Update profile data when search results come back
    if (searchData?.data?.escort?.data) {
      setProfileData(searchData.data.escort.data);
    }
  }, [dispatch, searchData]);

  // Set header to hidden since we're using BlurredHeader
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Reset to initial data or refetch from API
    setProfileData(initialData);
    setPage(1);
    setHasMore(true);
    setRefreshing(false);
  }, [initialData]);

  /**
   * Handle view profile
   */
  const handleViewProfile = useCallback((item) => {
    navigation.navigate('UserProfileDetail', {
      profile: item,  // Changed from 'data' to 'profile' for consistency
      userId: item?.userId || item?.id,
    });
  }, [navigation]);

  /**
   * Handle bookmark toggle
   */
  const handleBookmarkToggle = useCallback((item) => {
    const profileId = item?.userId || item?.id;
    const newBookmarks = new Set(bookmarkedProfiles);

    if (newBookmarks.has(profileId)) {
      newBookmarks.delete(profileId);
      showSuccessMessage('Removed from bookmarks', '');
    } else {
      newBookmarks.add(profileId);
      showSuccessMessage('Added to bookmarks', '');
    }

    setBookmarkedProfiles(newBookmarks);
  }, [bookmarkedProfiles]);

  /**
   * Load more data (pagination)
   */
  const loadMoreData = useCallback(() => {
    if (!hasMore || isLoading) return;

    // Simulate pagination - in real app, fetch from API
    setIsLoading(true);
    setTimeout(() => {
      // For demo, just set hasMore to false after first page
      setHasMore(false);
      setIsLoading(false);
    }, 1000);
  }, [hasMore, isLoading]);

  /**
   * Scroll handler for animations
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });


  /**
   * Render profile card item
   */
  const renderProfileCard = ({ item, index }) => (
    <ProfileCard
      item={item}
      index={index}
      onViewProfile={handleViewProfile}
      onBookmark={handleBookmarkToggle}
      isBookmarked={bookmarkedProfiles.has(item?.userId || item?.id)}
    />
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Nodatafound />
    </View>
  );

  /**
   * Render footer (loading indicator)
   */
  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={COLORS.specialTextColor} />
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* BlurredHeader */}
      <BlurredHeader
        scrollY={scrollY}
        title={title}
        subtitle="Discover amazing people"
        profileCount={profileData.length}
        onFilterChange={handleFilterChange}
        filterData={{
          cityData: profileStoreData?.data?.cityData || [],
          homeCategory: profileStoreData?.data?.homeCategory || [],
        }}
      />

      {/* Profile List */}
      <AnimatedFlatList
        data={profileData}
        renderItem={renderProfileCard}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        contentContainerStyle={[
          styles.listContent,
          profileData.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.specialTextColor}
            colors={[COLORS.specialTextColor]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={3}
        style={{backgroundColor:COLORS.white}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContent: {
    paddingTop: 120, // Space for BlurredHeader
    paddingBottom: TAB_BAR_HEIGHT + 20,
    paddingHorizontal:PADDING.medium
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  footerContainer: {
    paddingVertical: PADDING.large,
    alignItems: 'center',
  },
});

export default FeaturedListPage;