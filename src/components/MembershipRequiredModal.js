import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, TYPOGRAPHY, PADDING, SHADOW } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const MembershipRequiredModal = ({
  visible,
  onBuyPlan,
  onLogout
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={() => {}}
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            <View style={styles.modalContent}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={[COLORS.specialTextColor, '#6366f1']}
                  style={styles.iconGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                >
                  <Icon name="lock-outline" size={50} color={COLORS.white} />
                </LinearGradient>
              </View>

              <Text style={styles.title}>Buy a Membership Plan</Text>
              <Text style={styles.subtitle}>
                Purchase a plan to unlock premium features and access all content
              </Text>

              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color="#00CB07" />
                  <Text style={styles.benefitText}>Access to all profiles</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color="#00CB07" />
                  <Text style={styles.benefitText}>Unlimited messaging</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color="#00CB07" />
                  <Text style={styles.benefitText}>Advanced search filters</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Icon name="check-circle" size={20} color="#00CB07" />
                  <Text style={styles.benefitText}>Premium support</Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.buyButton,
                  pressed && styles.buyButtonPressed,
                ]}
                onPress={onBuyPlan}
              >
                <LinearGradient
                  colors={[COLORS.specialTextColor, '#6366f1']}
                  style={styles.buyButtonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                >
                  <Icon name="shopping-cart" size={20} color={COLORS.white} />
                  <Text style={styles.buyButtonText}>Buy Plan</Text>
                </LinearGradient>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && styles.logoutButtonPressed,
                ]}
                onPress={onLogout}
              >
                <Icon name="logout" size={20} color={COLORS.placeHolderColor} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </Pressable>
            </View>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 100,
    elevation: 8,
    bottom: 80, // Leave space for tab bar
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80, // Add padding for tab bar space
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    zIndex: 101,
    elevation: 9,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: PADDING.large,
    alignItems: 'center',
    ...SHADOW.large,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
  },
  buyButton: {
    width: '100%',
    marginBottom: 15,
  },
  buyButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buyButtonGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutButtonPressed: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: COLORS.placeHolderColor,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    marginLeft: 8,
  },
});

export default MembershipRequiredModal;