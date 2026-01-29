/**
 * Floating Language Switch Component
 * A testing tool for dynamic language switching across the app
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTranslation } from '../localization/hooks/useTranslation';
import { translationUtils } from '../localization/index';
import { useLanguageContext } from '../localization/LanguageProvider';
import { SUPPORTED_LANGUAGES } from '../localization/config/languages';
import { COLORS, TYPOGRAPHY, PADDING } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FloatingLanguageSwitch = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentLang, setCurrentLang] = useState(null);
  const { i18n } = useTranslation();
  const { changeLanguage: changeLanguageGlobal, isChanging } = useLanguageContext();

  // Animation values
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Get current language on mount and listen for changes
    const updateCurrentLanguage = () => {
      const current = translationUtils.getCurrentLanguage();
      setCurrentLang(current);
    };

    updateCurrentLanguage();

    // Listen for language changes
    const handleLanguageChange = () => {
      updateCurrentLanguage();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Animated button style
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  // Handle language press
  const handlePressIn = () => {
    buttonScale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
    setShowModal(true);
  };

  // Change language
  const changeLanguage = async (language) => {
    console.log('🎯 TouchableOpacity pressed for language:', language.code);

    if (isChanging) {
      console.log('⏸️ Language change in progress, ignoring click');
      return;
    }

    console.log('🔄 Starting language change to:', language.code);

    try {
      // Use the global language context for consistent state management
      changeLanguageGlobal(language.code);
      setCurrentLang(language);
      setShowModal(false);
      console.log('✅ Language changed successfully to:', language.code);
    } catch (error) {
      console.error('❌ Language change error in FloatingLanguageSwitch:', error);
    }
  };

  // Render language item
  const renderLanguageItem = ({ item }) => {
    const isSelected = currentLang?.code === item.code;

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          isSelected && styles.languageItemSelected
        ]}
        onPress={() => {
          console.log('🔥 Language item clicked:', item.code);
          changeLanguage(item);
        }}
        activeOpacity={0.7}
        disabled={isChanging}
      >
        <Text style={styles.languageFlag}>{item.flag}</Text>
        <View style={styles.languageTextContainer}>
          <Text style={[
            styles.languageName,
            isSelected && styles.languageNameSelected
          ]}>
            {item.native}
          </Text>
          <Text style={[
            styles.languageCode,
            isSelected && styles.languageCodeSelected
          ]}>
            {item.name} ({item.code})
          </Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!currentLang) return null;

  return (
    <>
      {/* Floating Button */}
      <Animated.View style={[styles.floatingButton, animatedButtonStyle]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.buttonTouchable}
        >
          <Text style={styles.flagText}>{currentLang.flag}</Text>
          <Text style={styles.langCode}>{currentLang.code.toUpperCase()}</Text>
          <View style={styles.testBadge}>
            <Text style={styles.testText}>TEST</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Language Selection Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowModal(false)}
            activeOpacity={1}
          />

          <View style={styles.modalContent}>
            <SafeAreaView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Language</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={SUPPORTED_LANGUAGES}
                renderItem={renderLanguageItem}
                keyExtractor={item => item.code}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.languageList}
              />

              <View style={styles.modalFooter}>
                <Text style={styles.footerText}>
                  🧪 Testing Mode - Language Switcher
                </Text>
                <Text style={styles.footerSubtext}>
                  Current: {currentLang.native} • RTL: {currentLang.rtl ? 'Yes' : 'No'}
                </Text>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    zIndex: 99999,
    elevation: 999,
  },
  buttonTouchable: {
    backgroundColor: 'rgba(47, 48, 145, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  flagText: {
    fontSize: 24,
    marginRight: 8,
  },
  langCode: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
  },
  testBadge: {
    backgroundColor: '#FF3B30',
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  testText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
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
  languageList: {
    paddingVertical: PADDING.small,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PADDING.medium,
    paddingHorizontal: PADDING.large,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  languageItemSelected: {
    backgroundColor: 'rgba(47, 48, 145, 0.05)',
  },
  languageFlag: {
    fontSize: 32,
    marginRight: PADDING.medium,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageNameSelected: {
    color: COLORS.specialTextColor,
  },
  languageCode: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  languageCodeSelected: {
    color: COLORS.specialTextColor,
    opacity: 0.8,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.specialTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalFooter: {
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    opacity: 0.7,
  },
});

export default FloatingLanguageSwitch;