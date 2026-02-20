/**
 * MyBookings Screen - Enhanced booking management
 * Displays all bookings with status-based tabs and detailed actions
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

// Theme and constants
import { COLORS, PADDING, TYPOGRAPHY, WIDTH } from '../../constants/theme';

// Services
import BookingService from '../../services/BookingService';
import NotificationService from '../../services/NotificationService';

// Components
import ScreenLoading from '../../components/ScreenLoading';
import ButtonWrapper from '../../components/ButtonWrapper';
import ConfirmationBottomSheet from '../../components/ConfirmationBottomSheet';
import ProfileScreen from '../EditProfileFlow/ProfileScreen';
import ContentProtection from '../../components/ContentProtection';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Booking status constants
const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Tab configuration for Members (profile_type !== 1)
const MEMBER_TABS = [
  { key: 'requests', label: 'Requests', icon: 'inbox' },
  { key: 'accepted', label: 'Accepted', icon: 'check-circle' },
  { key: 'rejected', label: 'Rejected', icon: 'cancel' },
];

// Tab configuration for Companions (profile_type === 1)
const COMPANION_TABS = [
  { key: 'history', label: 'History', icon: 'history' },
  { key: 'cancelled', label: 'Cancelled', icon: 'block' },
];

const MyBookings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Get user profile data first
  const userProfile = useSelector(state => state.profile?.user_profile);
  const isCompanion = userProfile?.profile_type === "1";

  // State management - set default tab based on user type
  const [activeTab, setActiveTab] = useState(isCompanion ? 'history' : 'requests');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [mainTab, setMainTab] = useState('Home');


  // User type logic
  const isEscort = isCompanion; // Companion is escort
  console.log("userProfile", userProfile, "isCompanion", isCompanion);

  /**
   * Fetch bookings based on current tab
   */
  const fetchBookings = useCallback(async (tab = activeTab, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      let status = 'pending';
      // let role = isEscort ? 'escort' : 'client';
      let role = 'escort';

      // Determine role and status based on user type and tab
      if (isCompanion) {
        // Companion (escort) role
        role = 'escort';
        switch (tab) {
          case 'history':
            status = null;
            break;
          case 'cancelled':
            status = 'cancelled';
            break;
          default:
            status = 'pending';
        }
      } else {
        // Member (client) role
        role = 'client';
        switch (tab) {
          case 'requests':
            status = null;
            break;
          case 'accepted':
            status = 'accepted';
            break;
          case 'rejected':
            status = 'cancelled';
            break;
          default:
            status = 'pending';
        }
      }

      const response = await BookingService.getPendingBookings(
        { role, status },
        dispatch
      );
      console.log('response', response);
      if (response.success) {
        setBookings(response?.bookings || []);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      NotificationService.error(error.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, isCompanion, dispatch]);

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    fetchBookings(tab);
  }, [fetchBookings]);

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings(activeTab, false);
  }, [fetchBookings, activeTab]);

  /**
   * Handle booking selection for details
   */
  const handleBookingSelect = useCallback(async (booking) => {
    try {
      setActionLoading(true);
      const response = await BookingService.getBookingById(booking.id, dispatch);
      console.log("response response", response)

      if (response.success) {
        setSelectedBooking(response.booking);
        setShowBookingDetails(true);
      } else {
        throw new Error(response.message || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Get booking details error:', error);
      NotificationService.error(error.message || 'Failed to load booking details');
    } finally {
      setActionLoading(false);
    }
  }, [dispatch]);

  /**
   * Handle booking acceptance
   */
  const handleAcceptBooking = useCallback(async (bookingId) => {
    try {
      setActionLoading(true);
      const response = await BookingService.updateBookingStatus(
        bookingId,
        'accept',
        '',
        dispatch
      );

      if (response.success) {
        setShowBookingDetails(false);
        fetchBookings(activeTab, false);
        NotificationService.success('Booking accepted successfully');
      } else {
        throw new Error(response.message || 'Failed to accept booking');
      }
    } catch (error) {
      console.error('Accept booking error:', error);
      NotificationService.error(error.message || 'Failed to accept booking');
    } finally {
      setActionLoading(false);
    }
  }, [fetchBookings, activeTab, dispatch]);

  /**
   * Handle booking rejection
   */
  const handleRejectBooking = useCallback(async (bookingId, reason = '') => {
    try {
      setActionLoading(true);
      const response = await BookingService.updateBookingStatus(
        bookingId,
        'reject',
        reason,
        dispatch
      );

      if (response.success) {
        setShowBookingDetails(false);
        setShowRejectConfirm(false);
        setRejectionReason('');
        fetchBookings(activeTab, false);
        NotificationService.success('Booking rejected');
      } else {
        throw new Error(response.message || 'Failed to reject booking');
      }
    } catch (error) {
      console.error('Reject booking error:', error);
      NotificationService.error(error.message || 'Failed to reject booking');
    } finally {
      setActionLoading(false);
    }
  }, [fetchBookings, activeTab, dispatch]);

  /**
   * Handle booking cancellation
   */
  const handleCancelBooking = useCallback(async (bookingId, reason = '') => {
    try {
      setActionLoading(true);
      const response = await BookingService.cancelBooking(
        bookingId,
        reason,
        dispatch
      );

      if (response.success) {
        setShowBookingDetails(false);
        setShowCancelConfirm(false);
        fetchBookings(activeTab, false);
        NotificationService.success('Booking cancelled');
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      NotificationService.error(error.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  }, [fetchBookings, activeTab, dispatch]);

  /**
   * Get status badge style
   */
  const getStatusBadgeStyle = useCallback((status) => {
    const styles = {
      pending: { backgroundColor: '#FFA500', color: '#fff' },
      confirmed: { backgroundColor: '#4CAF50', color: '#fff' },
      rejected: { backgroundColor: '#F44336', color: '#fff' },
      cancelled: { backgroundColor: '#9E9E9E', color: '#fff' },
      completed: { backgroundColor: '#2196F3', color: '#fff' },
    };
    return styles[status] || styles.rejected;
  }, []);

  /**
   * Format booking date and time
   */
  const formatBookingDateTime = useCallback((booking) => {
    const date = moment(booking.booking_date).format('MMM DD, YYYY');
    const time = moment(booking.start_time, 'HH:mm').format('h:mm A');
    return `${date} at ${time}`;
  }, []);

  /**
   * Render booking item
   */
  const renderBookingItem = useCallback(({ item: booking }) => {
    const statusStyle = getStatusBadgeStyle(booking.status);
    // console.log("booking", booking);
    // console.log("isEscort", isEscort);

    return (
      <Pressable
        style={styles.bookingCard}
        onPress={() => handleBookingSelect(booking)}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle}>
              {isEscort ? booking.client_name : booking?.escort.name}
            </Text>
            <Text style={styles.bookingDateTime}>
              {formatBookingDateTime(booking)}
            </Text>
            <Text style={styles.bookingDuration}>
              {booking.duration_minutes} minutes • {booking.service_type}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
               {booking.status != "" ? booking.status?.toUpperCase() : 'Rejected' }
            </Text>
          </View>
        </View>

        {booking.notes && (
          <Text style={styles.bookingNotes} numberOfLines={2}>
            {booking.notes}
          </Text>
        )}

        <View style={styles.bookingActions}>
          <Text style={styles.viewDetailsText}>Tap to view details</Text>
          <Icon name="chevron-right" size={20} color={COLORS.specialTextColor} />
        </View>
      </Pressable>
    );
  }, [isEscort, getStatusBadgeStyle, formatBookingDateTime, handleBookingSelect]);

  /**
   * Render tab bar
   */
  const renderTabBar = useCallback(() => (
    <View style={styles.tabBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {(isCompanion ? COMPANION_TABS : MEMBER_TABS).map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab
            ]}
            onPress={() => handleTabChange(tab.key)}
          >
            <Icon
              name={tab.icon}
              size={16}
              color={activeTab === tab.key ? COLORS.white : COLORS.specialTextColor}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  ), [activeTab, handleTabChange]);

  /**
   * Render booking details modal
   */
  const renderBookingDetailsModal = useCallback(() => {
    if (!selectedBooking) return null;

    const canAccept = selectedBooking.status === 'pending' && isEscort;
    const canReject = selectedBooking.status === 'pending' && isEscort;
    const canCancel = selectedBooking.status === 'accepted';

    return (
      <Modal
        visible={showBookingDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowBookingDetails(false);
          setRejectionReason('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Booking Details</Text>
            <Pressable onPress={() => {
              setShowBookingDetails(false);
              setRejectionReason('');
            }}>
              <Icon name="close" size={24} color={COLORS.textColor} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Booking Info */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Booking Information</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time:</Text>
                <Text style={styles.detailValue}>{formatBookingDateTime(selectedBooking)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{selectedBooking.duration_minutes} minutes</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service Type:</Text>
                <Text style={styles.detailValue}>{selectedBooking.service_type}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBadgeStyle(selectedBooking.status).backgroundColor }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusBadgeStyle(selectedBooking.status).color }
                  ]}>
                    {selectedBooking.status != "" ? selectedBooking.status?.toUpperCase() : 'Rejected' }
                  </Text>
                </View>
              </View>
            </View>

            {/* User Details */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>
                {isEscort ? 'Client Information' : 'Escort Information'}
              </Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>
                  {isEscort ? selectedBooking.client_name : selectedBooking.escort?.name}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>
                  {isEscort ? selectedBooking.client_email : selectedBooking.escort?.email}
                </Text>
              </View>
            </View>

            {/* Notes */}
            {selectedBooking.notes && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Special Requirements</Text>
                <Text style={styles.notesText}>{selectedBooking.notes}</Text>
              </View>
            )}

            {/* Rejection Reason - Only for escorts on pending bookings */}
            {isEscort && selectedBooking.status === 'pending' && (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Rejection Reason <Text style={{color: '#ff3b30'}}>*</Text></Text>
                <TextInput
                  style={styles.reasonInput}
                  value={rejectionReason}
                  onChangeText={setRejectionReason}
                  placeholder="Please enter reason for rejection (required)"
                  placeholderTextColor={COLORS.placeHolderColor}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          {isEscort && (
            <View style={styles.modalActions}>
              {canAccept && (
                <ButtonWrapper
                  label="Accept Booking"
                  onClick={() => handleAcceptBooking(selectedBooking.id)}
                  buttonMainStyle={[styles.actionButton, styles.acceptButton]}
                />
              )}

              {canReject && (
                <ButtonWrapper
                  label="Reject"
                  onClick={() => {
                    if (!rejectionReason || rejectionReason.trim() === '') {
                      Alert.alert('Reason Required', 'Please enter a reason for rejecting this booking.');
                      return;
                    }
                    handleRejectBooking(selectedBooking.id, rejectionReason);
                    // setShowRejectConfirm(true);
                  }}
                  buttonMainStyle={[styles.actionButton, styles.rejectButton]}
                />
              )}

              {canCancel && (
                <ButtonWrapper
                  label="Cancel Booking"
                  onClick={() => setShowCancelConfirm(true)}
                  buttonMainStyle={[styles.actionButton, styles.cancelButton]}
                />
              )}
            </View>
          )}

          {/* {isEscort &&
            <ButtonWrapper
              label="Cancel Booking"
              onClick={() => setShowCancelConfirm(true)}
              buttonMainStyle={[styles.actionButton, styles.acceptButton]}
            />} */}
        </View>
      </Modal>
    );
  }, [
    selectedBooking,
    showBookingDetails,
    isEscort,
    formatBookingDateTime,
    getStatusBadgeStyle,
    handleAcceptBooking,
    rejectionReason,
    setRejectionReason
  ]);

  // Load bookings on focus
  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings])
  );

  // Empty state component
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Icon name="inbox" size={64} color={COLORS.placeHolderColor} />
      <Text style={styles.emptyStateTitle}>No Bookings Found</Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'received'
          ? 'You have no pending booking requests'
          : `No ${activeTab} bookings to display`
        }
      </Text>
    </View>
  ), [activeTab]);

  return (
    <ContentProtection style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ display: 'flex' }}>
          {/* <Icon name="arrow-back" size={24} color={COLORS.textColor} /> */}
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>
            {isCompanion ? 'Manage your booking history' : 'Track your booking requests'}
          </Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="history" size={24} color={COLORS.textColor} />
          {/* <Icon name="sort" size={24} color={COLORS.textColor} /> */}
        </View>
      </View>



      {/* Tab Bar */}
      {/* {isCompanion && renderTabBar()} */}

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.specialTextColor]}
            tintColor={COLORS.specialTextColor}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Booking Details Modal */}
      {renderBookingDetailsModal()}

      {/* Cancel Confirmation */}
      <ConfirmationBottomSheet
        visible={showCancelConfirm}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        icon="warning"
        iconColor="#f59e0b"
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep Booking"
        onConfirm={() => handleCancelBooking(selectedBooking?.id, 'User cancelled')}
        onCancel={() => setShowCancelConfirm(false)}
        destructive
      />

      {/* Reject Confirmation */}
      <ConfirmationBottomSheet
        visible={showRejectConfirm}
        title="Reject Booking?"
        message="Are you sure you want to reject this booking request?"
        icon="cancel"
        iconColor="#ef4444"
        confirmLabel="Yes, Reject"
        cancelLabel="Keep Request"
        onConfirm={() => handleRejectBooking(selectedBooking?.id, rejectionReason || 'Booking rejected')}
        onCancel={() => setShowRejectConfirm(false)}
        destructive
      />

      {/* Loading States */}
      <ScreenLoading loader={loading} message="Loading bookings..." />
      <ScreenLoading loader={actionLoading} message="Processing..." />
    </ContentProtection>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: PADDING.large,
    paddingBottom: PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.DMSERIF,
    fontWeight: '700',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabContainer: {
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small,
    marginRight: PADDING.small,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  activeTab: {
    backgroundColor: COLORS.specialTextColor,
  },
  tabText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    marginLeft: 4,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContainer: {
    padding: PADDING.medium,
    flexGrow: 1,
    paddingBottom: 100,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: PADDING.medium,
    marginBottom: PADDING.medium,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: PADDING.small,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: 4,
  },
  bookingDateTime: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    marginBottom: 2,
  },
  bookingDuration: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },
  bookingNotes: {
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: PADDING.small,
    lineHeight: 18,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PADDING.large * 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginTop: PADDING.medium,
    marginBottom: PADDING.small,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
  },
  modalContent: {
    flex: 1,
    padding: PADDING.large,
  },
  detailSection: {
    marginBottom: PADDING.large,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: PADDING.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: PADDING.small,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    flex: 2,
    textAlign: 'right',
  },
  notesText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 20,
    backgroundColor: '#f8f9fa',
    padding: PADDING.medium,
    borderRadius: 8,
  },
  modalActions: {
    padding: PADDING.large,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    marginBottom: PADDING.small,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#FFA500',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: PADDING.medium,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    backgroundColor: '#f8f9fa',
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default MyBookings;