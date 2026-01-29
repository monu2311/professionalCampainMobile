// components/PaymentCard.jsx
import React, {memo} from 'react';
import {Pressable, Text, View, StyleSheet, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, PADDING, TYPOGRAPHY} from '../constants/theme';

const PaymentCard = memo(({
  id,
  title,
  subtitle,
  iconName,
  gradientColors,
  isSelected,
  onPress,
  testID,
  accessibilityLabel,
  disabled = false,
}) => {
  return (
    <Pressable
      style={[
        styles.paymentCard,
        isSelected && styles.selectedPaymentCard,
        disabled && styles.disabledCard,
      ]}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{selected: isSelected, disabled}}
      disabled={disabled}
    >
      <LinearGradient
        colors={disabled ? ['#cccccc', '#999999'] : gradientColors}
        style={styles.paymentCardGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={32} color={COLORS.white} />
        </View>
        
        <View style={styles.paymentCardContent}>
          <Text style={styles.paymentCardTitle}>{title}</Text>
          <Text style={styles.paymentCardSubtitle}>{subtitle}</Text>
        </View>
        
        {isSelected && (
          <View style={styles.checkIconContainer}>
            <Icon name="check-circle" size={28} color={COLORS.white} />
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  paymentCard: {
    borderRadius: 16,
    marginBottom: PADDING.medium,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  selectedPaymentCard: {
    transform: [{scale: 1.02}],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  disabledCard: {
    opacity: 0.6,
  },
  paymentCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PADDING.large,
    paddingVertical: PADDING.large + 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentCardContent: {
    flex: 1,
    marginLeft: PADDING.medium,
  },
  paymentCardTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  paymentCardSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  checkIconContainer: {
    marginLeft: PADDING.small,
  },
});

PaymentCard.displayName = 'PaymentCard';

export default PaymentCard;