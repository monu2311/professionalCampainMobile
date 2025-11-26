/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {FlatList, Image, Pressable,  StyleSheet} from 'react-native';
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
  WIDTHACC,
} from '../../constants/theme';
import {Text} from 'react-native-paper';
import {ICONS} from '../../constants/Icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetView, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import AboutUs from './AboutUs';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const Faq = () => {
  const FaqData = useSelector(state => state.FaqData);
  console.log("FaqDataFaqData",FaqData)
    const navigation = useNavigation()
    const [data,setData] = useState();
    const bottomSheetRef = useRef(null);
    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
      });

      const handleSnapPress = useCallback((itemName) => {
       const filterData =  FaqData?.faqs?.filter((item)=> item?.title ===itemName?.toUpperCase() );
      //  console.log("filterDatafilterData",filterData)
       setData(filterData[0]);
        bottomSheetRef?.current?.present();
      }, []);

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

  
  const FaqDataList = useMemo(()=>{
      return FaqData?.faqs?.map((item)=> item?.title)
  },[ FaqData?.faqs])


  console.log(FaqDataList,"FaqDataList")

      

  return (
    <>
    
    <FlatList
      data={FaqDataList}
      style={{backgroundColor: COLORS.white}}
      contentContainerStyle={{marginVertical: PADDING.medium}}
      renderItem={({item}) => (
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
      )}
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
            {/* <BottomSheetView  style={{flex:1,  borderRadius: 35,}}> */}
              <BottomSheetScrollView style={{flex:1,  borderRadius: 35,}}>
              <AboutUs navigation={navigation} data={data}/>

              </BottomSheetScrollView>

            {/* </BottomSheetView> */}
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
});

export default Faq;
