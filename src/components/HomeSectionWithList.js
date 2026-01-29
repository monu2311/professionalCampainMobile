/**
 * HomeSectionWithList Component
 * Combines section header with horizontal ProfileCard list
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import  {
  FadeInDown,
  FadeInLeft,
} from 'react-native-reanimated';

// Components
import ProfileCard from './ProfileCard';
import SectionHeader from './SectionHeader';

// Theme
import { COLORS, PADDING, TYPOGRAPHY, WIDTH } from '../constants/theme';

// Navigation
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = WIDTH * 0.8;
const CARD_SPACING = 20;

/**
 * HomeSectionWithList Component
 * @param {string} title - Section title
 * @param {array} data - Array of profile data
 * @param {function} onViewProfile - Callback when profile is viewed
 * @param {function} onBookmark - Callback when bookmark is toggled
 * @param {Set} bookmarkedProfiles - Set of bookmarked profile IDs
 * @param {string} navigateTo - Screen name to navigate for "See More"
 * @param {object} navigationParams - Additional params for navigation
 */
const HomeSectionWithList = ({
  title = "Featured",
  subtitle = null,
  data = [],
  onViewProfile,
  onBookmark,
  bookmarkedProfiles = new Set(),
  navigateTo = 'FeaturedListPage',
  navigationParams = {},
  contentStyle={},
  isObscured = false,
}) => {
  const navigation = useNavigation();

  // Only show first 5 items
  const displayData = data.slice(0, 5);
  const hasMoreItems = data.length > 5;

  /**
   * Handle See More press
   */
  const handleSeeMore = () => {
    navigation.navigate(navigateTo, {
      title,
      data,
      ...navigationParams,
    });
  };

  /**
   * Render ProfileCard in horizontal layout
   */
  const renderProfileCard = ({ item, index }) => (
    <Animated.View
      entering={FadeInLeft.delay(index * 100).springify()}
      style={styles.cardWrapper}
    >
      <View style={styles.cardContainer}>
        <ProfileCard
          item={item}
          onViewProfile={onViewProfile}
          onBookmark={onBookmark}
          isBookmarked={bookmarkedProfiles.has(item?.userId || item?.id)}
        />
      </View>
    </Animated.View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Data not found</Text>
    </View>
  );

  // Don't render anything if no data
  if (!data || data.length === 0) {
    return (
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        style={styles.container}
      >
        <SectionHeader
          title={title}
          subtitle={subtitle}
          actionText="See More"
          onActionPress={null}
          showIcon={false}
          isObscured={isObscured}
        />
        {renderEmptyState()}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={styles.container}
    >
      {/* Section Header with conditional See More */}
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionText={hasMoreItems ? "See More" : null}
        onActionPress={hasMoreItems ? handleSeeMore : null}
        showIcon={hasMoreItems}
        isObscured={isObscured}
      />

      {/* Horizontal ProfileCard List */}
      <FlatList
        data={displayData}
        renderItem={renderProfileCard}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{...styles.listContent,contentStyle}}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        scrollEventThrottle={16}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: PADDING.large,
  },
  listContent: {
    paddingHorizontal: PADDING.large,
    paddingBottom: PADDING.small,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  cardContainer: {
    width: CARD_WIDTH,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  separator: {
    width: CARD_SPACING,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: PADDING.large,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
});

export default HomeSectionWithList;