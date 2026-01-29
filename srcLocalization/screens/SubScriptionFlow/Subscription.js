/* eslint-disable quotes */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import {
  COLORS,
  HEIGHT,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {planhistory} from '../../reduxSlice/apiSlice';
import Nodatafound from '../../components/Nodatafound';
import ScreenLoading from '../../components/ScreenLoading';

const Subscription = () => {
  const planhistoryData = useSelector(state => state?.auth?.data?.planhistory);

  const [refreshing, setRefreshing] = useState(false);

  console.log('planhistory', planhistoryData);
  const data = [
    {
      id: 3,
      user_id: 164,
      plan_id: 1,
      created_at: '2025-05-14 13:21:48',
      updated_at: null,
      plan_end_date: '2025-05-21 13:21:48',
      paypal_payment_id: null,
      payment_status: null,
      amount: '15.00',
      currency: null,
      raw_paypal_response: null,
      is_refund_initiated: 0,
      type_id: 2,
      plan_title: 'Boost To The Top Of Your Chosen City',
    },
  ];
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const fetchTransaction = async () => {
    try {
      const response = await dispatch(planhistory());
      console.log('Response----->', response);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTransaction();
    }
  }, [isFocused, dispatch]);

  const RenderList = ({label, value, icon}) => {
    return (
      <View style={styles.infoRow}>
        {icon && <Icon name={icon} size={16} color={COLORS.specialTextColor} />}
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const isExpired = new Date(item?.plan_end_date) < new Date();
    const isRefundRequested = item?.is_refund_initiated;

    return (
      <View style={styles.subscriptionCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.planTitle}>{item?.plan_title}</Text>
          <View style={[
            styles.statusBadge,
            {
              backgroundColor: isExpired
                ? COLORS.red
                : isRefundRequested
                ? '#ff9800'
                : COLORS.green
            }
          ]}>
            <Text style={styles.statusText}>
              {isExpired ? 'Expired' : isRefundRequested ? 'Refunding' : 'Active'}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <RenderList
            label="Amount:"
            value={`AUS $${item?.amount}`}
            icon="attach-money"
          />
          <RenderList
            label="Purchase Date:"
            value={new Date(item?.created_at).toLocaleDateString()}
            icon="event"
          />
          <RenderList
            label="Expiry Date:"
            value={new Date(item?.plan_end_date).toLocaleDateString()}
            icon="schedule"
          />

          {isRefundRequested ? (
            <View style={styles.refundNotice}>
              <Icon name="info" size={16} color="#ff9800" />
              <Text style={styles.refundText}>Refund request under process</Text>
            </View>
          ) : !isExpired ? (
            <Pressable style={styles.refundButton}>
              <Icon name="receipt-long" size={16} color={COLORS.white} />
              <Text style={styles.refundButtonText}>Request Refund</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTransaction();
    // Replace this with your data reloading logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // simulate a network request
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.specialTextColor}
            colors={[COLORS.specialTextColor]}
          />
        }
        data={planhistoryData?.data}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Nodatafound />
          </View>
        )}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <ScreenLoading loader={planhistoryData?.isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContent: {
    paddingHorizontal: PADDING.medium,
    paddingTop: PADDING.medium,
    paddingBottom: 100,
  },
  emptyContainer: {
    height: HEIGHT * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: PADDING.large,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: PADDING.large,
    paddingBottom: PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 48, 145, 0.05)',
  },
  planTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    flex: 1,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: PADDING.small,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: PADDING.small,
  },
  statusText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.white,
  },
  cardContent: {
    padding: PADDING.large,
    paddingTop: PADDING.medium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.small,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginLeft: PADDING.small,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
  },
  refundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.specialTextColor,
    paddingVertical: PADDING.small,
    paddingHorizontal: PADDING.medium,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: PADDING.small,
  },
  refundButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    marginLeft: 4,
  },
  refundNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: PADDING.small,
    borderRadius: 8,
    marginTop: PADDING.small,
  },
  refundText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: '#ff9800',
    marginLeft: PADDING.small,
    flex: 1,
  },
});

export default Subscription;
