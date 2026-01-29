/**
 * LanguageSwitch Component
 * Advanced language switcher for ProfileScreen Menu Section
 */

import React, { memo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLanguage } from '../hooks/useLanguage';
import { useRTL } from '../hooks/useRTL';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitch = memo(({
  style,
  textStyle,
  modalStyle,
  itemStyle,
  showFlags = true,
  showNativeNames = true,
  onLanguageChange,
}) => {
  try {
    const { currentLanguage, availableLanguages, changeLanguage, isChanging } = useLanguage();
    const { isRTL, rtlStyle, flexDirection } = useRTL();
    const { t } = useTranslation(['settings']);

    // Ensure we have valid data
    if (!currentLanguage || !availableLanguages || availableLanguages.length === 0) {
      console.warn('LanguageSwitch: Invalid language data');
      return null;
    }

    const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageSelect = useCallback(async (languageCode) => {
    try {
      setModalVisible(false);

      const success = await changeLanguage(languageCode);

      if (success && onLanguageChange) {
        onLanguageChange(languageCode);
      } else if (!success) {
        console.warn(`Failed to change language to ${languageCode}`);
        // Optionally show user feedback here
      }
    } catch (error) {
      console.error('Error changing language:', error);
      // Handle the error gracefully - maybe show a toast or alert
    }
  }, [changeLanguage, onLanguageChange]);

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderLanguageItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        rtlStyle(styles.languageItem, styles.languageItemRTL),
        itemStyle,
        currentLanguage.code === item.code && styles.selectedLanguage
      ]}
      onPress={() => handleLanguageSelect(item.code)}
      accessibilityLabel={`Select ${item.name} language`}
      accessibilityRole="button"
    >
      <View style={[styles.languageInfo, { flexDirection: flexDirection('row') }]}>
        {showFlags && (
          <Text style={styles.flag}>{item.flag}</Text>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.languageName, textStyle]}>
            {item.name}
          </Text>
          {showNativeNames && item.native !== item.name && (
            <Text style={[styles.nativeName, textStyle]}>
              {item.native}
            </Text>
          )}
        </View>
      </View>
      {currentLanguage.code === item.code && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  ), [currentLanguage.code, handleLanguageSelect, rtlStyle, flexDirection, showFlags, showNativeNames, itemStyle, textStyle]);

  const keyExtractor = useCallback((item) => item.code, []);

  return (
    <>
      {/* Language Selector Button */}
      <Pressable
        style={[
          styles.languageSelector,
          rtlStyle(styles.languageSelector, styles.languageSelectorRTL),
          style
        ]}
        onPress={openModal}
        disabled={isChanging}
        accessibilityLabel="Change language"
        accessibilityRole="button"
        accessibilityState={{ disabled: isChanging }}
      >
        <View style={[styles.selectorContent, { flexDirection: flexDirection('row') }]}>
          {showFlags && (
            <Text style={styles.currentFlag}>{currentLanguage.flag}</Text>
          )}
          <View style={styles.currentLanguageInfo}>
            <Text style={[styles.currentLanguageName, textStyle]}>
              {showNativeNames ? currentLanguage.native : currentLanguage.name}
            </Text>
            <Text style={[styles.changeLanguageHint, textStyle]}>
              {t('settings:changeLanguage')}
            </Text>
          </View>
          {isChanging ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Text style={[styles.arrow, { transform: [{ scaleX: isRTL ? -1 : 1 }] }]}>
              ▶
            </Text>
          )}
        </View>
      </Pressable>

      {/* Language Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
        accessibilityViewIsModal
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, rtlStyle(styles.modalContent, styles.modalContentRTL), modalStyle]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('settings:selectLanguage', 'Select Language')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                accessibilityLabel="Close language selection"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableLanguages}
              renderItem={renderLanguageItem}
              keyExtractor={keyExtractor}
              style={styles.languageList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.languageListContent}
            />
          </View>
        </View>
      </Modal>
    </>
  );
  } catch (error) {
    console.error('LanguageSwitch component error:', error);
    // Return fallback UI or null
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Language switcher unavailable</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  languageSelector: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  languageSelectorRTL: {
    // RTL-specific styles if needed
  },
  selectorContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  currentLanguageInfo: {
    flex: 1,
  },
  currentLanguageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  changeLanguageHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  arrow: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalContentRTL: {
    // RTL-specific modal styles if needed
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  languageList: {
    flex: 1,
  },
  languageListContent: {
    padding: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: '#f8f9fa',
  },
  languageItemRTL: {
    // RTL-specific item styles if needed
  },
  selectedLanguage: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  languageInfo: {
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
});

LanguageSwitch.displayName = 'LanguageSwitch';

export default LanguageSwitch;