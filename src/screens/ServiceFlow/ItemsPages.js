import React from 'react';
import {Image, StyleSheet, Text, View, Pressable, Dimensions} from 'react-native';
import ButtonWrapper from '../../components/ButtonWrapper';
import {
  COLORS,
  HEIGHT,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
  SHADOW
} from '../../constants/theme';
import {otherQueries} from '../../constants/Static';
import CustomTextInput from '../../components/CustomTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {defaultStyles} from '../../constants/Styles';
import {ICONS} from '../../constants/Icons';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ItemsPages = ({navigation, items}) => {
  const submitHandler = () => {
    navigation.navigate('Final');
  };

  const getServiceFeatures = () => {
    const serviceName = items?.eventName?.toLowerCase() || '';
    if (serviceName.includes('companion')) {
      return ['Professional Companionship', 'Discreet Service', 'Premium Experience', 'Flexible Scheduling'];
    }
    if (serviceName.includes('massage')) {
      return ['Relaxation Therapy', 'Professional Massage', 'Stress Relief', 'Wellness Focus'];
    }
    if (serviceName.includes('dinner')) {
      return ['Fine Dining', 'Social Companion', 'Elegant Experience', 'Cultural Events'];
    }
    return ['Premium Service', 'Professional Staff', 'Quality Assurance', 'Customer Satisfaction'];
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      {/* Hero Section */}
      <View style={styles.heroContainer}>
        {items?.eventImg?.includes('upload') ? (
          <FastImage
            style={styles.heroImage}
            source={{
              uri: items?.eventImg,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={styles.heroImageFallback}>
            <Icon name="star" size={48} color={COLORS.mainColor} />
          </View>
        )}

        <View style={styles.heroOverlay}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{items?.eventName}</Text>
            <View style={styles.heroRating}>
              <Icon name="star" size={16} color="#FFD700" />
              <Icon name="star" size={16} color="#FFD700" />
              <Icon name="star" size={16} color="#FFD700" />
              <Icon name="star" size={16} color="#FFD700" />
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>5.0 (Premium)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content Cards */}
      <View style={styles.contentContainer}>

        {/* Description Card */}
        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="description" size={24} color={COLORS.mainColor} />
            <Text style={styles.cardTitle}>Service Description</Text>
          </View>
          <Text style={styles.descriptionText}>
            {items?.eventDiscription || 'Experience our premium companionship service designed to provide you with exceptional quality and professional service.'}
          </Text>
        </View>

        {/* Features Card */}
        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="verified" size={24} color={COLORS.mainColor} />
            <Text style={styles.cardTitle}>Service Features</Text>
          </View>
          <View style={styles.featuresContainer}>
            {getServiceFeatures().map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Icon name="check-circle" size={18} color={COLORS.green} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Booking Information Card */}
        <View style={styles.contentCard}>
          <View style={styles.cardHeader}>
            <Icon name="info" size={24} color={COLORS.mainColor} />
            <Text style={styles.cardTitle}>Booking Information</Text>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="schedule" size={20} color={COLORS.specialTextColor} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Availability</Text>
                <Text style={styles.infoValue}>24/7 Premium Service</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="location-on" size={20} color={COLORS.specialTextColor} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Service Area</Text>
                <Text style={styles.infoValue}>Major Cities Available</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Icon name="security" size={20} color={COLORS.specialTextColor} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Privacy</Text>
                <Text style={styles.infoValue}>100% Confidential</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.contactButton}>
            <Icon name="message" size={20} color={COLORS.white} />
            <Text style={styles.contactButtonText}>Contact Now</Text>
          </Pressable>

          <Pressable style={styles.bookButton} onPress={submitHandler}>
            <Icon name="calendar-today" size={20} color={COLORS.white} />
            <Text style={styles.bookButtonText}>Book Service</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: PADDING.extralarge + 50,
  },
  heroContainer: {
    position: 'relative',
    height: HEIGHT * 0.35,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.large,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    marginBottom: PADDING.small,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    marginLeft: PADDING.small,
  },
  contentContainer: {
    paddingHorizontal: PADDING.large,
    paddingTop: PADDING.large,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: PADDING.large,
    marginBottom: PADDING.large,
    ...SHADOW.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.medium,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginLeft: PADDING.small,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 24,
  },
  featuresContainer: {
    gap: PADDING.small,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.small,
  },
  featureText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    marginLeft: PADDING.small,
    flex: 1,
  },
  infoContainer: {
    gap: PADDING.medium,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: PADDING.medium,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: PADDING.medium,
    marginTop: PADDING.medium,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.placeHolderColor,
    paddingVertical: PADDING.medium,
    borderRadius: 12,
    gap: PADDING.small,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.mainColor,
    paddingVertical: PADDING.medium,
    borderRadius: 12,
    gap: PADDING.small,
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
  },
});

export default ItemsPages;
