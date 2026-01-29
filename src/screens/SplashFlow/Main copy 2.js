/**
 * Modern Main Screen
 * Professional companion discovery with vertical card layout and modern UI
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  RefreshControl,
  FlatList,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

// Theme and constants
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
  IOS,
} from '../../constants/theme';
import { ICONS } from '../../constants/Icons';
// Components
import CustomDropdown from '../../components/CustomDropdown';
import ProfileCard from '../../components/ProfileCard';
import Nodatafound from '../../components/Nodatafound';
import FeaturedCarousel from '../../components/FeaturedCarousel';
import HomeSectionWithList from '../../components/HomeSectionWithList';

// Navigation and Redux
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getChatAllUser, getUserByID, search } from '../../reduxSlice/apiSlice';
import { showSuccessMessage, showErrorMessage } from '../../utils/messageHelpers';

// Form handling
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native-paper';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = IOS ? 90 : 60;

/**
 * Main Component
 * Modern companion discovery screen with vertical profile cards
 */
const Main = () => {
  const formikRef = useRef();
  const profileData = useSelector(state => state?.profile);
  const highlistData = useSelector(state => state?.auth?.data?.search);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // State management
  const [filter, setFilter] = useState({
    city: null,
    category: null,
    filter_type: null,
    page: 1,
    page_size: 32
  });
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedProfiles, setBookmarkedProfiles] = useState(new Set());
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  console.log("highlistData", highlistData)
  // Animation values
  const scrollY = useSharedValue(0);

  // Initial data load only on component mount
  useEffect(() => {
    // dispatch(getChatAllUser());
    dispatch(search(filter));
  }, [dispatch]); // Removed isFocused dependency to prevent unnecessary refetches

  const filterType = value => {
    dispatch(search({ ...filter, filter_type: value }));
    setFilter(prev => ({
      ...prev,
      filter_type: value,
    }));
  };
  const filterLocation = value => {
    dispatch(search({ ...filter, city: value }));
    setFilter(prev => ({
      ...prev,
      city: value,
    }));
  };
  const filterCategory = value => {
    dispatch(search({ ...filter, category: value }));
    setFilter(prev => ({
      ...prev,
      category: value,
    }));
  };

  const onRefresh = useCallback(() => {
    formikRef.current?.setFieldValue('location', '');
    formikRef.current?.setFieldValue('category', '');
    setRefreshing(true);
    dispatch(getChatAllUser());
    dispatch(search({}));
    // Replace this with your data reloading logic
    setTimeout(() => {
      setFilter({
        city: null,
        category: null,
        filter_type: null,
      });
      setRefreshing(false);
    }, 2000); // simulate a network request
  }, [dispatch]);

  /**
   * Handle scroll animation
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Scroll handling
    },
  });

  /**
   * Animated header style
   */
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200],
      [1, 0.8, 0.6]
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [0, -50]
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });


  /**
   * Navigate to profile detail
   */
  const handleViewProfile = async (profile) => {
    try {
      console.log('Navigating to profile:', profile.userId || profile.id);

      // Navigate first, then load data in the destination screen
      navigation.navigate('UserProfileDetail', {
        userId: profile.userId || profile.id,
        profile: profile,
      });

      // Optionally, still dispatch the action for data loading
      // dispatch(getUserByID(profile.userId || profile.id));
    } catch (error) {
      console.error('Navigation error:', error);
      showErrorMessage(
        'Navigation Error',
        'Unable to open profile. Please try again.'
      );
    }
  };

  /**
   * Handle bookmark toggle
   */
  const handleBookmarkToggle = (profile) => {
    const profileId = profile.userId || profile.id;
    const newBookmarks = new Set(bookmarkedProfiles);

    if (newBookmarks.has(profileId)) {
      newBookmarks.delete(profileId);
      showSuccessMessage('Removed from bookmarks', '');
    } else {
      newBookmarks.add(profileId);
      showSuccessMessage('Added to bookmarks', '');
    }

    setBookmarkedProfiles(newBookmarks);
  };

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
      {highlistData?.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.specialTextColor} />
          <Text style={styles.loadingText}>Finding amazing people...</Text>
        </View>
      ) : (
        <Nodatafound />
      )}
    </View>
  );

  /**
   * Count active filters
   */
  const countActiveFilters = useCallback(() => {
    let count = 0;
    if (filter.city) count++;
    if (filter.category) count++;
    if (filter.filter_type) count++;
    setActiveFilters(count);
  }, [filter]);

  useEffect(() => {
    countActiveFilters();
  }, [filter, countActiveFilters]);

  /**
   * Apply filters from modal
   */
  const applyFilters = () => {
    setShowFilterModal(false);
    dispatch(search(filter));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilter({
      city: null,
      category: null,
      filter_type: null,
    });
    formikRef.current?.setFieldValue('location', '');
    formikRef.current?.setFieldValue('category', '');
    dispatch(search({}));
    setShowFilterModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
        translucent={false}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:PADDING.large+40}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.specialTextColor}
            colors={[COLORS.specialTextColor]}
          />
        }
      >
        {/* Enhanced Header */}
        <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
          <View style={styles.headerContent}>
            <View style={styles.locationContainer}>
              <Image source={ICONS.LOCATION} style={styles.locationIcon} />
              <Text style={styles.locationText}>
                {filter.city || 'All Locations'}
              </Text>
            </View>
            <Text style={styles.countText}>
              {highlistData?.data?.escort?.length || 0} Active
            </Text>
          </View>
        </Animated.View>

        {/* Featured Carousel - Modern Glassmorphic Design */}
        <FeaturedCarousel
          onUserPress={handleViewProfile}
        />

        {/* Featured Section with Horizontal ProfileCards */}
        <HomeSectionWithList
          title="Home"
          subtitle="Discover amazing people"
          data={highlistData?.data?.escort?.data || []}
          onViewProfile={handleViewProfile}
          onBookmark={handleBookmarkToggle}
          bookmarkedProfiles={bookmarkedProfiles}
          navigateTo="FeaturedListPage"
        />

          <HomeSectionWithList
          title="Directory"
          subtitle="Discover amazing people"
          data={highlistData?.data?.escort?.data || []}
          onViewProfile={handleViewProfile}
          onBookmark={handleBookmarkToggle}
          bookmarkedProfiles={bookmarkedProfiles}
          navigateTo="FeaturedListPage"
        />

        {/* VIP Section with Horizontal ProfileCards */}
        {/* <HomeSectionWithList
          title="VIP Members"
          subtitle="Premium profiles"
          data={highlistData?.data?.escort?.data?.filter(item => item?.is_vip) || []}
          onViewProfile={handleViewProfile}
          onBookmark={handleBookmarkToggle}
          bookmarkedProfiles={bookmarkedProfiles}
          navigateTo="FeaturedListPage"
          navigationParams={{ title: 'VIP Members' }}
        /> */}

        {/* New Members Section */}
        {/* <HomeSectionWithList
          title="New Members"
          subtitle="Recently joined"
          data={highlistData?.data?.escort?.data?.slice(0, 10) || []}
          onViewProfile={handleViewProfile}
          onBookmark={handleBookmarkToggle}
          bookmarkedProfiles={bookmarkedProfiles}
          navigateTo="FeaturedListPage"
          navigationParams={{ title: 'New Members' }}
        /> */}

        {/* Main Content Section Header */}
        {/* <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>All Profiles</Text>
          <Text style={styles.sectionSubtitle}>
            {highlistData?.data?.escort?.length || 0} profiles available
          </Text>
        </View> */}

        {/* Main Content - Profile List */}
        {/* <View style={styles.profileListContainer}>
          {highlistData?.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.specialTextColor} />
              <Text style={styles.loadingText}>Finding amazing people...</Text>
            </View>
          ) : highlistData?.data?.escort?.data?.length > 0 ? (
            highlistData.data.escort.data.map((item, index) => (
              renderProfileCard({ item, index })
            ))
          ) : (
            <Nodatafound />
          )}
        </View> */}
      </ScrollView>


      {/* Custom Filter Modal */}
      {showFilterModal && (
        <>
          <Animated.View
            style={styles.modalBackdrop}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Pressable
              style={styles.backdropPressable}
              onPress={() => setShowFilterModal(false)}
            />
          </Animated.View>
          <Animated.View
            style={styles.modalContent}
            entering={SlideInDown.duration(300).springify()}
            exiting={SlideOutDown.duration(250)}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Formik
                innerRef={formikRef}
                initialValues={{ location: filter.city, category: filter.category }}
                onSubmit={() => { }}
              >
                {() => (
                  <>
                    {/* Location Filter */}
                    <View style={styles.filterSection}>
                      <Text style={styles.filterSectionTitle}>Location</Text>
                      <CustomDropdown
                        placeholder="Select City"
                        data={profileData?.data?.cityData || []}
                        name="location"
                        onselectChange={filterLocation}
                        placeholderColor={COLORS.placeHolderColor}
                        style={styles.modalDropdown}
                      />
                    </View>

                    {/* Category Filter */}
                    <View style={styles.filterSection}>
                      <Text style={styles.filterSectionTitle}>Category</Text>
                      <CustomDropdown
                        placeholder="All Categories"
                        data={profileData?.data?.homeCategory || []}
                        name="category"
                        onselectChange={filterCategory}
                        placeholderColor={COLORS.placeHolderColor}
                        style={styles.modalDropdown}
                      />
                    </View>

                    {/* Quick Filters */}
                    <View style={styles.filterSection}>
                      <Text style={styles.filterSectionTitle}>Availability</Text>
                      <View style={styles.chipContainer}>
                        <TouchableOpacity
                          style={[
                            styles.filterChip,
                            filter.filter_type === 'available_now' && styles.filterChipActive
                          ]}
                          onPress={() => filterType('available_now')}
                        >
                          <Text style={[
                            styles.filterChipText,
                            filter.filter_type === 'available_now' && styles.filterChipTextActive
                          ]}>Available Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.filterChip,
                            filter.filter_type === 'available_today' && styles.filterChipActive
                          ]}
                          onPress={() => filterType('available_today')}
                        >
                          <Text style={[
                            styles.filterChipText,
                            filter.filter_type === 'available_today' && styles.filterChipTextActive
                          ]}>Available Today</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.filterChip,
                            filter.filter_type === 'vip' && styles.filterChipActiveVIP
                          ]}
                          onPress={() => filterType('vip')}
                        >
                          <Text style={[
                            styles.filterChipText,
                            filter.filter_type === 'vip' && styles.filterChipTextActiveVIP
                          ]}>VIP Members</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              </Formik>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}

      {/* Styled Filter Button */}
      {/* <View style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 1001,
        elevation: 11,
        backgroundColor: COLORS.specialTextColor,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }}>
        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={ICONS.Setting}
            style={{
              width: 18,
              height: 18,
              tintColor: COLORS.white,
              marginRight: 8,
            }}
          />
          <Text style={{
            color: COLORS.white,
            fontSize: 14,
            fontFamily: TYPOGRAPHY.QUICKBLOD,
            fontWeight: '600'
          }}>
            Filter
          </Text>
          {activeFilters > 0 && (
            <View style={{
              backgroundColor: COLORS.white,
              marginLeft: 8,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 10,
              minWidth: 20,
              alignItems: 'center',
            }}>
              <Text style={{
                color: COLORS.specialTextColor,
                fontSize: 12,
                fontFamily: TYPOGRAPHY.QUICKBLOD,
                fontWeight: '700',
              }}>
                {activeFilters}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  profileListContainer: {
    paddingHorizontal: PADDING.small,
  },
  headerContainer: {
    paddingHorizontal: PADDING.medium,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 15,
    zIndex: 100,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: COLORS.specialTextColor,
  },
  locationText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontWeight: '600',
  },
  countText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 9999,
    elevation: 20,
  },
  backdropPressable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: TAB_BAR_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
    zIndex: 10000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PADDING.large,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.placeHolderColor,
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: PADDING.large,
    paddingTop: PADDING.medium,
    paddingBottom: PADDING.large,
    maxHeight: 400,
  },
  filterSection: {
    marginTop: PADDING.large,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontWeight: '600',
    marginBottom: PADDING.small,
  },
  modalDropdown: {
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(47,48,145,0.08)',
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: 10,
    marginBottom: 10,
  },
  filterChipActive: {
    backgroundColor: 'rgba(47,48,145,0.15)',
    borderColor: COLORS.specialTextColor,
  },
  filterChipActiveVIP: {
    backgroundColor: 'rgba(201,162,39,0.15)',
    borderColor: COLORS.gold,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '500',
  },
  filterChipTextActive: {
    fontWeight: '700',
    color: COLORS.specialTextColor,
  },
  filterChipTextActiveVIP: {
    fontWeight: '700',
    color: COLORS.gold,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: PADDING.large,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.specialTextColor,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.specialTextColor,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.specialTextColor,
    borderRadius: 12,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },
  listContainer: {
    paddingTop: PADDING.medium,
    paddingBottom: 100,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    marginTop: PADDING.medium,
    textAlign: 'center',
  },
  sectionHeaderContainer: {
    paddingHorizontal: PADDING.large,
    paddingTop: PADDING.large,
    paddingBottom: PADDING.small,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
});

export default Main;
