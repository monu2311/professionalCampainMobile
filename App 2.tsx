/**
 * Professional Companionship App
 * Enhanced with i18n localization support
 *
 * @format
 */
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { Provider } from 'react-redux'
import MainStack from './src/navigation/MainStack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import store from './src/store/store';
import FlashMessage from 'react-native-flash-message';

// i18n initialization
import initializeI18n from './src/localization/index';



// App content component
const AppContent = () => {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <GestureHandlerRootView style={styles.gestureRoot}>
        <BottomSheetModalProvider>
          <MainStack />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      <FlashMessage position="top" />
    </Provider>
  );
};

function App(): React.JSX.Element {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n system
    initializeI18n().then((success) => {
      if (success) {
        setI18nInitialized(true);
      } else {
        // Fallback: continue without i18n if initialization fails
        console.warn('i18n initialization failed, continuing without localization');
        setI18nInitialized(true);
      }
    });
  }, []);

  // Show loading screen while i18n initializes
  if (!i18nInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <AppContent />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  gestureRoot: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
