/**
 * Modern Main Screen
 * Professional companion discovery with vertical card layout and modern UI
 */
import React, { useCallback, useEffect, useRef, useState, memo, useMemo } from 'react';
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
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  runOnJS,
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
import ContentProtection from '../../components/ContentProtection';
import { useMembershipContext } from '../../contexts/MembershipContext';

// Navigation and Redux
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getChatAllUser, getUserByID, search } from '../../reduxSlice/apiSlice';
import { showSuccessMessage, showErrorMessage } from '../../utils/messageHelpers';

// Form handling
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native-paper';
import { fetchProfile } from '../../apiConfig/Services';
import membershipService from '../../services/MembershipService';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = IOS ? 90 : 60;

/**
 * Main Component
 * Modern companion discovery screen with vertical profile cards
 */
const Main = memo(() => {
  const formikRef = useRef();

  // Optimized Redux selectors with memoization to prevent unnecessary re-renders
  const profileData = useSelector(useCallback(state => state?.profile, []));
  const highlistData = useSelector(useCallback(state => state?.auth?.data?.search, []));
  const currentProfileData = useSelector(useCallback(state => state?.profile, []));

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { forceCheckMembership } = useMembershipContext();

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
  const [sectionsObscured, setSectionsObscured] = useState({
    home: false,
    directory: false,
  });
  const [searchBarHidden, setSearchBarHidden] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(false);
  // Memoized data processing to prevent unnecessary re-calculations
  const profilesData = useMemo(() => highlistData?.data?.escort?.data || [], [highlistData?.data?.escort?.data]);
  const vipProfiles = useMemo(() => profilesData.filter(item => item?.is_vip), [profilesData]);
  const newProfiles = useMemo(() => profilesData.slice(0, 10), [profilesData]);
  const isLoading = useMemo(() => highlistData?.isLoading, [highlistData?.isLoading]);

  // Calculate fixed header height for obscure detection
  const HEADER_HEIGHT = useMemo(() => {
    const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
    const headerContentHeight = 120; // Estimated height of header content + search bar
    return statusBarHeight + headerContentHeight;
  }, []);

  // Removed debug logging to prevent excessive render cycles
  // Animation values
  const scrollY = useSharedValue(0);

  // Declare animation styles before using them
  const animatedSearchStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50, 100],
      [1, 0.5, 0],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -50],
      'clamp'
    );

    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.95],
      'clamp'
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 100],
      [28, 20],
      'clamp'
    );

    return {
      fontSize,
    };
  });

  const animatedSubtitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 100],
      [16, 14],
      'clamp'
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 50, 100],
      [1, 0.8, 0.7],
      'clamp'
    );

    return {
      fontSize,
      opacity,
    };
  });

  const isFocused = useIsFocused();

  // Check if content should be blocked due to expired membership
  useEffect(() => {
    const checkContentBlock = async () => {
      const shouldBlock = await membershipService.shouldBlockContent();
      setIsContentBlocked(shouldBlock);
    };

    if (profileData?.user_profile) {
      checkContentBlock();
    }
  }, [profileData]);

  // Initial data load only on component mount
  // useEffect(() => {
  //   if (isFocused) {
  //     fetchProfile(dispatch).then(() => {
  //       setTimeout(() => {
  //         forceCheckMembership();
  //       }, 100);
  //     });
  //   }

  // }, [dispatch, isFocused]); 
  // Removed isFocused dependency to prevent unnecessary refetches

  // Force membership check when profile data changes
  // useEffect(() => {
  //   if (currentProfileData?.user_profile && isFocused) {
  //     console.log('Main: Profile data changed, forcing membership check');
  //     setTimeout(() => {
  //       forceCheckMembership();
  //     }, 200);
  //   }
  // }, [currentProfileData, isFocused, forceCheckMembership]);

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
    fetchProfile(dispatch).then(() => {
      // Force membership check after refresh
      setTimeout(() => {
        forceCheckMembership();
      }, 100);
    });
    dispatch(getChatAllUser());
    dispatch(search({page:1,page_size:32}));
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
   * Handle scroll animation and section obscure detection
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Calculate which sections are behind the fixed header
      const scrollOffset = event.contentOffset.y;

      // Check if search bar is significantly faded (opacity < 0.5 means non-interactive)
      const searchBarHiddenState = scrollOffset >= 50; // When opacity reaches 0.5 or lower

      // Estimate section positions (these would ideally be measured dynamically)
      const homeSectionTop = 50;  // Distance from content top to Home section
      const directorySectionTop = 300; // Distance from content top to Directory section

      // Check if section headers are behind the fixed header
      const homeObscured = scrollOffset > (homeSectionTop - HEADER_HEIGHT + 60);
      const directoryObscured = scrollOffset > (directorySectionTop - HEADER_HEIGHT + 60);

      // Update state on main thread (throttled to every 10px scroll)
      if (Math.floor(scrollOffset) % 10 === 0) {
        runOnJS(setSectionsObscured)({
          home: homeObscured,
          directory: directoryObscured
        });
        runOnJS(setSearchBarHidden)(searchBarHiddenState);
      }
    },
  });

  /**
   * Animated header style
   */
  // Animated header container style
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [180, 100],
      'clamp'
    );

    return {
      height,
    };
  });


  /**
   * Navigate to profile detail - Memoized for performance
   */
  const handleViewProfile = useCallback(async (profile) => {
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
  }, [navigation, dispatch]);

  /**
   * Handle bookmark toggle - Memoized for performance
   */
  const handleBookmarkToggle = useCallback((profile) => {
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
  }, [bookmarkedProfiles]);

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
      {isLoading ? (
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

      <ContentProtection style={styles.container}>

        {/* Fixed Header - Outside ScrollView */}
        <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
          <View style={styles.headerTop}>
            <View style={styles.welcomeSection}>
              <Animated.Text style={[styles.welcomeTitle, animatedTitleStyle]}>
                Welcome to
              </Animated.Text>
              <Animated.Text style={[styles.welcomeSubtitle, animatedSubtitleStyle]}>
                Want some company?
              </Animated.Text>
            </View>
            <Pressable style={styles.avatarContainer}>
              <Image
                source={profileData?.user?.profile_image
                  ? { uri: profileData.user.profile_image }
                  : ICONS.PROFILE}
                style={styles.avatarImage}
              />
            </Pressable>
          </View>

          {/* Frosted Glass Search Bar */}
          <Pressable
            onPress={!searchBarHidden ? () =>
              navigation.navigate('FeaturedListPage', {
                title: 'Home',
                data: profilesData,
              }) : null
            }
            disabled={searchBarHidden}
            pointerEvents={searchBarHidden ? 'none' : 'auto'}
          >
            <Animated.View style={[styles.searchContainer, animatedSearchStyle]}>
              <View style={styles.searchBar}>
                <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  placeholder="Where do we go?"
                  placeholderTextColor="#666"
                  style={styles.searchInput}
                  editable={false}
                  pointerEvents="none"
                  onFocus={() => console.log('Search focused')}
                />
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>

        <AnimatedScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: PADDING.large + 20 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
              colors={[COLORS.specialTextColor]}
              progressViewOffset={170}
            />
          }
        >
          {/* White Content Container with Rounded Top */}
          <View style={styles.contentContainer}>

            {/* Featured Carousel - Modern Glassmorphic Design */}
            {/* <FeaturedCarousel
              onUserPress={handleViewProfile}
            /> */}

            {/* Featured Section with Horizontal ProfileCards */}
            <HomeSectionWithList
              title="Home"
              subtitle="Discover amazing people"
              data={profilesData}
              onViewProfile={handleViewProfile}
              onBookmark={handleBookmarkToggle}
              bookmarkedProfiles={bookmarkedProfiles}
              navigateTo="FeaturedListPage"
            />

            <HomeSectionWithList
              title="Directory"
              subtitle="Discover amazing people"
              data={profilesData}
              onViewProfile={handleViewProfile}
              onBookmark={handleBookmarkToggle}
              bookmarkedProfiles={bookmarkedProfiles}
              navigateTo="FeaturedListPage"
              contentStyle={{ paddingBottom: PADDING.xlarge + 100 }}
            />

            {/* VIP Section with Horizontal ProfileCards */}
            {/* <HomeSectionWithList
          title="VIP Members"
          subtitle="Premium profiles"
          data={vipProfiles}
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
          data={newProfiles}
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
            {profilesData?.length || 0} profiles available
          </Text>
        </View> */}

            {/* Main Content - Profile List */}
            {/* <View style={styles.profileListContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.specialTextColor} />
              <Text style={styles.loadingText}>Finding amazing people...</Text>
            </View>
          ) : profilesData?.length > 0 ? (
            profilesData.map((item, index) => (
              renderProfileCard({ item, index })
            ))
          ) : (
            <Nodatafound />
          )}
        </View> */}
          </View>
        </AnimatedScrollView>


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
                Content Locked
              </Text>
              <Text style={{
                fontSize: 16,
                fontFamily: TYPOGRAPHY.QUICKREGULAR,
                color: COLORS.white,
                textAlign: 'center',
                opacity: 0.9,
              }}>
                Your membership has expired. Please renew to continue.
              </Text>
            </View>
          </View>
        </View>
      )} */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e3094',
    // backgroundColor:COLORS.white
  },
  scrollView: {
    flex: 1,
    // paddingBottom:PADDING.large
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 180,
    minHeight: SCREEN_HEIGHT - 140,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
    // zIndex:11
  },
  profileListContainer: {
    paddingHorizontal: PADDING.small,
  },
  headerContainer: {
    backgroundColor: '#2e3094',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    paddingTop: PADDING.medium,
    paddingBottom: PADDING.small,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeTitle: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: PADDING.large,
    paddingBottom: 20,
    paddingTop: PADDING.small,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: PADDING.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: '#333',
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
