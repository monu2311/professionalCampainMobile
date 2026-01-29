/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Animated,
  Image,
  ScrollView
} from 'react-native';
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
  HEIGHT,
  SHADOW
} from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAPIs } from '../../apiConfig/Services';
import ItemsPages from './ItemsPages';
import { ICONS } from '../../constants/Icons';
import ContentProtection from '../../components/ContentProtection';
const Service = () => {
    const [sendData, setSendData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredServices, setFilteredServices] = useState([]);
    const navigation = useNavigation();
    const bottomSheetRef = useRef(null);
    const dropDownData = useSelector(state => state.dropDown);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // console.log("dropDownDataservices",dropDownData)
    const animationConfigs = useBottomSheetSpringConfigs({
        damping: 80,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
        stiffness: 500,
      });

      const handleSnapPress = useCallback((item) => {
        setSendData(item)
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


      const dispatch = useDispatch();
      const isFocused = useIsFocused();



       useEffect(() => {
          if (!isFocused) return;
          fetchAllAPIs(dispatch);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        }, [isFocused, dispatch]);

        useEffect(() => {
          const services = dropDownData?.Services?.array || [];
          if (searchQuery.trim() === '') {
            setFilteredServices(services);
          } else {
            const filtered = services.filter(service =>
              service?.eventName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredServices(filtered);
          }
        }, [searchQuery, dropDownData]);

        const getServiceIcon = (serviceName) => {
          const name = serviceName?.toLowerCase() || '';
          if (name.includes('companion') || name.includes('escort')) return 'person';
          if (name.includes('massage') || name.includes('spa')) return 'spa';
          if (name.includes('dinner') || name.includes('dining')) return 'restaurant';
          if (name.includes('travel') || name.includes('tour')) return 'flight';
          if (name.includes('event') || name.includes('party')) return 'event';
          if (name.includes('business') || name.includes('meeting')) return 'business';
          if (name.includes('entertainment')) return 'movie';
          return 'star';
        };

      

  return (
    <ContentProtection style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <Text style={styles.headerTitle}>Professional Services</Text>
        <Text style={styles.headerSubtitle}>Discover premium companionship services</Text>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={COLORS.placeHolderColor} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={COLORS.placeHolderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Icon name="clear" size={18} color={COLORS.placeHolderColor} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      <FlatList
        data={filteredServices}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            style={[
              styles.serviceCard,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }]
              }
            ]}
          >
            <Pressable
              style={styles.cardPressable}
              onPress={() => handleSnapPress(item)}
              android_ripple={{ color: 'rgba(47, 48, 145, 0.1)' }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Icon
                    name={getServiceIcon(item?.eventName)}
                    size={24}
                    color={COLORS.white}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.serviceName}>{item?.eventName}</Text>
                  <Text style={styles.serviceDescription} numberOfLines={2}>
                    {item?.eventDiscription || 'Premium service experience'}
                  </Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Icon name="arrow-forward-ios" size={16} color={COLORS.mainColor} />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={48} color={COLORS.placeHolderColor} />
            <Text style={styles.emptyText}>No services found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search terms</Text>
          </View>
        )}
      />
      <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={["95%"]}
          animationConfigs={animationConfigs}
          animateOnMount={true}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{
            backgroundColor: COLORS.mainColor,
            width: 60,
            height: 4,
            borderRadius: 2,
          }}
          backgroundStyle={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: COLORS.white,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
              },
              android: {
                elevation: 16,
              },
            }),
          }}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          enableOverDrag={false}
        >
          <View style={styles.bottomSheetHeader}>
            <View style={styles.bottomSheetTitleContainer}>
              <Text style={styles.bottomSheetTitle}>Service Details</Text>
              <Text style={styles.bottomSheetSubtitle}>
                {sendData?.eventName || 'Premium Service'}
              </Text>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={() => bottomSheetRef?.current?.dismiss()}
            >
              <Icon name="close" size={24} color={COLORS.placeHolderColor} />
            </Pressable>
          </View>

          <BottomSheetScrollView
            style={styles.bottomSheetContent}
            contentContainerStyle={styles.bottomSheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ItemsPages navigation={navigation} items={sendData}/>
          </BottomSheetScrollView>
        </BottomSheetModal>
    </ContentProtection>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    paddingHorizontal: PADDING.large,
    paddingTop: PADDING.large,
    paddingBottom: PADDING.medium,
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: PADDING.large,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: PADDING.medium,
    borderWidth: 1,
    borderColor: 'rgba(47, 48, 145, 0.1)',
  },
  searchIcon: {
    marginRight: PADDING.small,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
    // marginTop: PADDING.large,
  },
  listContent: {
    paddingHorizontal: PADDING.large,
    paddingBottom: 100,
    // backgroundColor: COLORS.red,
    paddingTop: PADDING.medium,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: PADDING.medium,
    overflow: 'hidden',
    ...SHADOW.medium,
  },
  cardPressable: {
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PADDING.large,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: PADDING.medium,
  },
  cardContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    lineHeight: 20,
  },
  arrowContainer: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.extralarge * 2,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginTop: PADDING.medium,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginTop: 4,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING.large,
    paddingTop: PADDING.medium,
    paddingBottom: PADDING.small,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 48, 145, 0.05)',
  },
  bottomSheetTitleContainer: {
    flex: 1,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetScrollContent: {
    paddingBottom: 50,
  },
});

export default Service;
