/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Platform, SafeAreaView, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {activePlanHistory, planhistory} from '../../reduxSlice/apiSlice';

const SUCCESS_MATCHERS = [
  'success',
  'completed',
  'approved',
  'payment/success',
  'paypal/success',
  'return',
  'PayerID=',
];

const CANCEL_MATCHERS = ['cancel', 'payment/cancel', 'paypal/cancel', 'useraction=cancel'];

const containsAny = (url, parts) => parts.some(p => (url || '').toLowerCase().includes(p.toLowerCase()));

const PayPalWebView = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const {approvalUrl} = route.params || {};

  const initialUrl = useMemo(() => approvalUrl, [approvalUrl]);

  const closeWithRefresh = useCallback(
    async (ok, message) => {
      if (ok) {
        showMessage({message: message || 'Payment successful', type: 'success'});
        // Refresh plan data on success
        dispatch(activePlanHistory());
        dispatch(planhistory());
      } else {
        showMessage({message: message || 'Payment cancelled', type: 'warning'});
      }
      // Navigate back to previous screen
      navigation.goBack();
    },
    [dispatch, navigation],
  );

  const onNavigationStateChange = useCallback(
    navState => {
      const currentUrl = navState?.url || '';
      if (containsAny(currentUrl, SUCCESS_MATCHERS)) {
        closeWithRefresh(true);
        return false;
      }
      if (containsAny(currentUrl, CANCEL_MATCHERS)) {
        closeWithRefresh(false);
        return false;
      }
      return true;
    },
    [closeWithRefresh],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {initialUrl ? (
        <View style={{flex: 1}}>
          <WebView
            ref={webViewRef}
            source={{uri: initialUrl}}
            startInLoadingState
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={onNavigationStateChange}
            incognito
            javaScriptEnabled
            domStorageEnabled
            setSupportMultipleWindows={false}
            originWhitelist={["*"]}
            allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
          />
          {loading && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.4)',
              }}>
              <ActivityIndicator size="large" color="#0551AF" />
            </View>
          )}
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#0551AF" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default PayPalWebView;


