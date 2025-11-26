/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux'
import MainStack from './src/navigation/MainStack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import store from './src/store/store';
import FlashMessage from 'react-native-flash-message';
import PatternLock from './PatternLockScreen.js';
import { PanGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture.js';



function App(): React.JSX.Element {
  

  return (
 
    <Provider  store={store} >
      <StatusBar  backgroundColor={"white"} barStyle={"dark-content"}/>
        <GestureHandlerRootView>
       <BottomSheetModalProvider >
      
        <MainStack/>
    
    
       </BottomSheetModalProvider>
       </GestureHandlerRootView>
       <FlashMessage position="top" />

    </Provider>
  );
}

const styles = StyleSheet.create({
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
