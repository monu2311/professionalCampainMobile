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
import crashLogger from './src/services/CrashLoggerService';
import ErrorBoundary from './src/components/ErrorBoundary';

// i18n initialization
// import initializeI18n, { i18n } from './src/localization/index';
import { I18nextProvider } from 'react-i18next';
// import { LanguageProvider } from './src/localization/LanguageProvider';
// import { RTLProvider } from './src/localization/RTLProvider';
// Floating Language Switcher (Testing Tool)
// import FloatingLanguageSwitch from './src/components/FloatingLanguageSwitch';


import {
    BatchSize,
    DatadogProvider,
    DatadogProviderConfiguration,
    SdkVerbosity,
    UploadFrequency,
} from "@datadog/mobile-react-native";


const config = new DatadogProviderConfiguration(
    "pubc815ef27d9f5b13f3ed318eda5e02c30",
    "prod",
    "dfb63cdb-e24f-467c-9137-a30150024c82",
    true, // track User interactions (e.g.: Tap on buttons. You can use 'accessibilityLabel' element property to give tap action the name, otherwise element type will be reported)
    true, // track XHR Resources
    true // track Errors
)

config.site = "US5"
// Optional: Enable JavaScript long task collection
config.longTaskThresholdMs = 100
// Optional: enable or disable native crash reports
config.nativeCrashReportEnabled = true
// Optional: sample RUM sessions (here, 100% of session will be sent to Datadog. Default = 100%. Only tracked sessions send RUM events.)
config.sessionSamplingRate = 100

if (__DEV__) {
    // Optional: Send data more frequently
    config.uploadFrequency = UploadFrequency.FREQUENT
    // Optional: Send smaller batches of data
    config.batchSize = BatchSize.SMALL
    // Optional: Enable debug logging
    config.verbosity = SdkVerbosity.DEBUG
}


// Once SDK is initialized you need to setup view tracking to be able to see data in the RUM Dashboard.




// App content component
const AppContent = () => {
  // Handle RTL changes
  const handleRTLChange = (isRTL: boolean, languageCode: string) => {
    console.log(`🔀 App received RTL change: ${isRTL} for language: ${languageCode}`);

    // In a production app, you might want to restart the app here for
    // complete RTL layout change, but we'll handle it dynamically
  };

  return (
     <DatadogProvider configuration={config}>

    <ErrorBoundary screenName="App">
      <Provider store={store}>
        {/* <I18nextProvider i18n={i18n}>
          <LanguageProvider onRTLChange={handleRTLChange}>
            <RTLProvider> */}
              <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
              <GestureHandlerRootView style={styles.gestureRoot}>
                <BottomSheetModalProvider>
                  <MainStack />
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
              <FlashMessage position="top" />
              {/* Floating Language Switcher - Testing Tool (Remove in Production) */}
              {/* <FloatingLanguageSwitch />
            </RTLProvider>
          </LanguageProvider>
        </I18nextProvider> */}
      </Provider>
    </ErrorBoundary>

     </DatadogProvider>
  );
};

function App(): React.JSX.Element {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n system
    // initializeI18n().then((success) => {
    //   if (success) {
    //     setI18nInitialized(true);
    //   } else {
    //     console.warn('i18n initialization failed, continuing without localization');
    //     setI18nInitialized(true);
    //   }
    // });
  }, []);

  // Show loading screen while i18n initializes
  // if (!i18nInitialized) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#007AFF" />
  //     </View>
  //   );
  // }

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
