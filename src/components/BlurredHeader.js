/**
 * BlurredHeader Component
 * Modern iPhone-style blurred header with filter functionality
 * Cross-platform blur support with iOS native blur and Android fallback
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  useAnimatedStyle,
  interpolate,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { Formik } from 'formik';

// Theme and components
import { COLORS, PADDING, TYPOGRAPHY, IOS } from '../constants/theme';
import CustomDropdown from './CustomDropdown';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = IOS ? 90 : 60;
const HEADER_HEIGHT = 120;

/**
 * BlurredHeader Component
 */
const BlurredHeader = ({
  scrollY,
  title = 'Featured',
  subtitle = 'Discover amazing people',
  profileCount = 0,
  onFilterChange,
  filterData = {},
}) => {
  const formikRef = useRef();
  const navigation = useNavigation();

  // State management
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [filter, setFilter] = useState({
    city: null,
    category: null,
    filter_type: null,
  });

  /**
   * Animated header container style
   */
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [HEADER_HEIGHT, 80],
      'clamp'
    );

    const paddingTop = interpolate(
      scrollY.value,
      [0, 100],
      [Platform.OS === 'ios' ? 60 : 30, Platform.OS === 'ios' ? 20 : 15], // Increased minimum spacing
      'clamp'
    );

    return {
      height,
      paddingTop,
    };
  });

  /**
   * Animated blur intensity for cross-platform support
   * Reduces blur when modal is open to prevent visual conflicts
   */
  const animatedBlurStyle = useAnimatedStyle(() => {
    const blurAmount = interpolate(
      scrollY.value,
      [0, 50, 100],
      [0, 8, 15],
      'clamp'
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 50, 100],
      [0.7, 0.85, 0.95],
      'clamp'
    );

    // Reduce blur/opacity when modal is open to prevent conflicts
    const modalAdjustment = showFilterModal ? 0.3 : 1;

    return Platform.OS === 'ios'
      ? { blurAmount: blurAmount * modalAdjustment }
      : { opacity: opacity * modalAdjustment };
  });

  /**
   * Animated title style
   */
  const animatedTitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 100],
      [28, 20],
      'clamp'
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 50, 100],
      [1, 0.9, 0.8],
      'clamp'
    );

    return {
      fontSize,
      opacity,
    };
  });

  /**
   * Animated subtitle style
   */
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
      [1, 0.7, 0.5],
      'clamp'
    );

    return {
      fontSize,
      opacity,
    };
  });

  /**
   * Animated filter button style
   */
  const animatedFilterButtonStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -5],
      'clamp'
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

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
   * Filter handlers
   */
  const filterType = (value) => {
    const newFilter = { ...filter, filter_type: value };
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const filterLocation = (value) => {
    const newFilter = { ...filter, city: value };
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const filterCategory = (value) => {
    const newFilter = { ...filter, category: value };
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  /**
   * Apply filters from modal
   */
  const applyFilters = () => {
    setShowFilterModal(false);
    onFilterChange?.(filter);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    const clearedFilter = {
      city: null,
      category: null,
      filter_type: null,
    };
    setFilter(clearedFilter);
    formikRef.current?.setFieldValue('location', '');
    formikRef.current?.setFieldValue('category', '');
    onFilterChange?.(clearedFilter);
    setShowFilterModal(false);
  };

  /**
   * Render blur background - cross-platform
   * Uses solid background when modal is open to prevent conflicts
   */
  const renderBlurBackground = () => {
    if (showFilterModal) {
      // Use solid background when modal is open to prevent visual conflicts
      return (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(255, 255, 255, 0.95)' }
          ]}
        />
      );
    }

    if (Platform.OS === 'ios') {
      return (
        <Animated.View style={[StyleSheet.absoluteFillObject, animatedBlurStyle]}>
          <BlurView
            style={StyleSheet.absoluteFillObject}
            blurType="light"
            blurAmount={15}
            reducedTransparencyFallbackColor={COLORS.white}
          />
        </Animated.View>
      );
    } else {
      // Android fallback with semi-transparent background
      return (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            styles.androidBlurFallback,
            animatedBlurStyle,
          ]}
        />
      );
    }
  };

  return (
    <>
      {/* Main Header */}
      <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
        {renderBlurBackground()}

        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Left Section - Back Button */}
          <View style={styles.leftSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Icon name="arrow-back" size={24} color={COLORS.textColor} />
            </TouchableOpacity>
          </View>

          {/* Center Section - Title */}
          <View style={styles.centerSection}>
            <Animated.Text style={[styles.title, animatedTitleStyle]}>
              {title}
            </Animated.Text>
            <Animated.Text style={[styles.subtitle, animatedSubtitleStyle]}>
              {profileCount} {profileCount === 1 ? 'Profile' : 'Profiles'}
            </Animated.Text>
          </View>

          {/* Right Section - Filter Button */}
          <View style={styles.rightSection}>
            <Animated.View style={[styles.filterButtonContainer, animatedFilterButtonStyle]}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
                activeOpacity={0.8}
              >
                <Icon name="filter-list" size={24} color={COLORS.white} />
                {/* <Icon name="tune" size={20} color={COLORS.white} />
                <Text style={styles.filterButtonText}>Filter</Text> */}
                {activeFilters > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{activeFilters}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </Animated.View>

      {/* Filter Modal */}
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
                <Icon name="close" size={24} color={COLORS.placeHolderColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Formik
                innerRef={formikRef}
                initialValues={{ location: filter.city, category: filter.category }}
                onSubmit={() => {}}
              >
                {() => (
                  <>
                    {/* Location Filter */}
                    <View style={styles.filterSection}>
                      <Text style={styles.filterSectionTitle}>Location</Text>
                      <CustomDropdown
                        placeholder="Select City"
                        data={filterData?.cityData || []}
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
                        data={filterData?.homeCategory || []}
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
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
    borderBottomWidth: Platform.OS === 'android' ? 1 : 0,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  androidBlurFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)', // Works on some Android versions
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    paddingBottom: PADDING.small,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 100,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
  },
  filterButtonContainer: {
    // Removed marginLeft since it's now in right section
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.specialTextColor,
     padding:10,
    borderRadius: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    marginLeft: 6,
  },
  filterBadge: {
    backgroundColor: COLORS.white,
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  filterBadgeText: {
    color: COLORS.specialTextColor,
    fontSize: 11,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
  },
  // Modal styles (reused from Main.js)
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)', // Increased opacity to fully block content behind
    zIndex: 99999, // Increased z-index to ensure it's above blur header
    elevation: 30, // Increased elevation for Android
  },
  backdropPressable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
    zIndex: 100000, // Increased z-index to ensure it's above everything
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 35, // Increased elevation for Android
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
});

export default BlurredHeader;