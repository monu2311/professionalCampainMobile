/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from 'react';
import ButtonWrapper from '../../components/ButtonWrapper';
import { ICONS } from '../../constants/Icons';
import { COLORS, PADDING, TYPOGRAPHY } from '../../constants/theme';
import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import { Buyplan } from '../../reduxSlice/apiSlice';
import { useNavigation } from '@react-navigation/native';
import { feature } from '../../constants/Static';

const PackageScreen = () => {
  const navigation = useNavigation();
  const plansData = useSelector(state => state.planData?.plans);
  const { data: activePlanData, isLoading } = useSelector(state => state?.auth?.data?.activePlaNSLICE);
  console.log('plansData,', activePlanData);
  const planBuy = useSelector(state => state?.auth?.data?.planBuy);
  const dispatch = useDispatch();

  const submitHandler = async value => {
    try {
      const response = await dispatch(Buyplan(value));
      // Expect backend to return PayPal approval URL if PayPal is required
      const approvalUrl = response?.data?.approval_url || response?.approval_url || response?.data?.links?.find?.(l => l.rel === 'approval_url')?.href;
      if (approvalUrl) {
        navigation.navigate('PayPalWebView', {approvalUrl});
        return;
      }
      if (response?.message) {
        navigation.goBack();
      }
    } catch (error) {
      // console.log('Package buy error', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Our platform is currently Free for the first 2 months of launching and
          we will notify all advertisers when we introduce the subscription
          charges
        </Text>
      </View>
      {plansData?.map((item, planIndex) => {
        const matchedActivePlan = activePlanData?.filter(
          active => active?.plan_title === item?.plan_title
        )?.[0];

        const isActive = !!matchedActivePlan?.plan_title;
        const isExpired = matchedActivePlan?.plan_end_date && new Date(matchedActivePlan.plan_end_date) < new Date();

        return (
          <View key={item?.id || planIndex} style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>AU${item?.cost}</Text>
                <Text style={styles.periodText}>/month</Text>
              </View>

              {isActive && (
                <View style={[styles.statusBadge, { backgroundColor: isExpired ? COLORS.red : COLORS.green }]}>
                  <Text style={styles.statusText}>
                    {isExpired ? 'Expired' : 'Active'}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.planTitle}>{item?.plan_title}</Text>

            <View style={styles.featuresContainer}>
              {feature[item?.plan_title]?.map((featureItem, index) => (
                <View key={index} style={styles.featureRow}>
                  <Icon name="check-circle" size={18} color={COLORS.specialTextColor} />
                  <Text style={styles.featureText}>{featureItem}</Text>
                </View>
              ))}
            </View>

            <ButtonWrapper
              onClick={() => isActive ? null : submitHandler({ plan_id: item?.id })}
              label={
                isActive
                  ? `Expires on ${new Date(matchedActivePlan?.plan_end_date).toLocaleDateString()}`
                  : 'Buy Now'
              }
              buttonMainStyle={[
                styles.buyButton,
                isActive && styles.disabledButton
              ]}
              disabled={isActive}
            />
          </View>
        );
      })}
      <ScreenLoading loader={(planBuy?.isLoading || isLoading)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.large,
  },
  headerText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    textAlign: 'center',
    lineHeight: 20,
  },
  packageCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: PADDING.large,
    marginBottom: PADDING.large,
    borderRadius: 16,
    padding: PADDING.large,
    borderWidth: 1,
    borderColor: 'rgba(47, 48, 145, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: PADDING.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 32,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.specialTextColor,
  },
  periodText: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: PADDING.small,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.white,
  },
  planTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: PADDING.medium,
    lineHeight: 26,
  },
  featuresContainer: {
    marginBottom: PADDING.large,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: PADDING.small,
  },
  featureText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    marginLeft: PADDING.small,
    flex: 1,
    lineHeight: 20,
  },
  buyButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PackageScreen;
