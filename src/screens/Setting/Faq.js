/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {FlatList, Image, Pressable, StyleSheet, View, ActivityIndicator} from 'react-native';
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
} from '../../constants/theme';
import {Text} from 'react-native-paper';
import {ICONS} from '../../constants/Icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import AboutUs from './AboutUs';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const Faq = () => {
  const FaqData = useSelector(state => state.FaqData);
  console.log("FaqDataFaqData",FaqData)
    const navigation = useNavigation()
    const [data,setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const bottomSheetRef = useRef(null);
    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
      });

      const handleSnapPress = useCallback((itemName) => {
        try {
          // Validate inputs
          if (!itemName || !FaqData?.faqs || !Array.isArray(FaqData.faqs)) {
            console.warn('Invalid data for FAQ item press');
            return;
          }

          const filterData = FaqData.faqs.filter((item) =>
            item?.title && item.title.toUpperCase() === itemName.toUpperCase()
          );

          if (filterData.length > 0 && filterData[0]) {
            setData(filterData[0]);
            bottomSheetRef?.current?.present();
          } else {
            console.warn('No FAQ data found for:', itemName);
            setError('FAQ content not available');
          }
        } catch (err) {
          console.error('Error in handleSnapPress:', err);
          setError('Failed to load FAQ content');
        }
      }, [FaqData?.faqs]);

      const renderBackdrop = useCallback(
        (props) => (
          <BottomSheetBackdrop
            opacity={0.6}
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        ),
        []
      );

  
  // Add useEffect for loading state management
  useEffect(() => {
    if (FaqData) {
      setIsLoading(false);
      setError(null);
    } else {
      // Set a timeout to handle cases where data takes time to load
      const timer = setTimeout(() => {
        if (!FaqData) {
          setError('Failed to load FAQ data');
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout

      return () => clearTimeout(timer);
    }
  }, [FaqData]);

  const FaqDataList = useMemo(() => {
    try {
      if (!FaqData?.faqs || !Array.isArray(FaqData.faqs)) {
        return [];
      }
      return FaqData.faqs
        .filter(item => item?.title && typeof item.title === 'string')
        .map(item => item.title);
    } catch (err) {
      console.error('Error processing FAQ data:', err);
      setError('Failed to process FAQ data');
      return [];
    }
  }, [FaqData?.faqs]);


  console.log(FaqDataList,"FaqDataList")

      

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.mainColor} />
        <Text style={styles.loadingText}>Loading FAQ...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setIsLoading(true);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // Empty state
  if (!FaqDataList || FaqDataList.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No FAQ items available</Text>
      </View>
    );
  }

  return (
    <>

    <FlatList
      data={FaqDataList}
      style={{backgroundColor: COLORS.white}}
      contentContainerStyle={{marginVertical: PADDING.medium}}
      keyExtractor={(item, index) => `faq-${index}-${item}`}
      renderItem={({item}) => {
        if (!item || typeof item !== 'string') {
          return null;
        }
        return (
          <Pressable
            style={{
              padding: PADDING.large,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: PADDING.medium,
              borderColor: COLORS.borderColor,
            }}
            onPress={()=>handleSnapPress(item)}>
            <Text
              style={{
                fontFamily: TYPOGRAPHY.DMSERIF,
                color: COLORS.mainColor,
                fontSize: 20,
              }}>
              {item}
            </Text>

            <Image
              source={ICONS.DOWNICON}
              style={{width: 16, height: 16, resizeMode: 'contain'}}
            />
          </Pressable>
        );
      }}
    />
    <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={["90%"]}
          animationConfigs={animationConfigs}
          animateOnMount={true}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{
            backgroundColor: COLORS.mainColor,
            width: 60,
          }}
          backgroundStyle={{
            borderRadius: 20,
          }}
          enableDynamicSizing={false}
        >
            <BottomSheetScrollView style={{flex:1,  borderRadius: 35,}}>
              {data ? (
                <AboutUs navigation={navigation} data={data}/>
              ) : (
                <View style={styles.centerContainer}>
                  <Text style={styles.noDataText}>No content available</Text>
                </View>
              )}
            </BottomSheetScrollView>
        </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  flexstyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PADDING.medium,
    paddingHorizontal: PADDING.large,
  },
  circleBox: {
    backgroundColor: COLORS.mainColor,
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: PADDING.large,
  },
  loadingText: {
    marginTop: PADDING.medium,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontSize: 16,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.errorColor || '#FF0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: PADDING.medium,
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    fontSize: 16,
    textAlign: 'center',
    padding: PADDING.large,
  },
  retryButton: {
    backgroundColor: COLORS.mainColor,
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.small,
    borderRadius: 8,
    marginTop: PADDING.medium,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontSize: 14,
  },
});

export default Faq;
