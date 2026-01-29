import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Reanimated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {COLORS} from '../constants/theme';

const {width, height} = Dimensions.get('window');

const ReviewBookingModal = ({visible, booking, onClose, onAction, userType = 'companion'}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleAccept = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAction('accept', null);
    setIsSubmitting(false);
    onClose();
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAction('reject', rejectReason);
    setIsSubmitting(false);
    setShowRejectForm(false);
    setRejectReason('');
    onClose();
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onAction('review', {rating, reviewText});
    setIsSubmitting(false);
    setRating(0);
    setReviewText('');
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'accepted':
        return '#00CB07';
      case 'rejected':
        return '#F44336';
      case 'completed':
        return '#2196F3';
      default:
        return COLORS.placeHolderColor;
    }
  };

  const StarRating = () => {
    const stars = [1, 2, 3, 4, 5];
    const starRefs = useRef(stars.map(() => new Animated.Value(1))).current;

    const animateStar = (index) => {
      Animated.sequence([
        Animated.spring(starRefs[index], {
          toValue: 1.3,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(starRefs[index], {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <View style={styles.starsContainer}>
        {stars.map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => {
              setRating(star);
              animateStar(star - 1);
            }}>
            <Animated.View
              style={[
                styles.starWrapper,
                {
                  transform: [{scale: starRefs[star - 1]}],
                },
              ]}>
              <Icon
                name="star"
                size={32}
                color={star <= rating ? COLORS.gold : '#e0e0e0'}
              />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!booking) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {translateY: slideAnim},
                {scale: scaleAnim},
              ],
            },
          ]}>
          <LinearGradient
            colors={[COLORS.specialTextColor, '#6366f1']}
            style={styles.header}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.headerTitle}>Booking Review</Text>
                <Text style={styles.headerSubtitle}>
                  {booking.status === 'pending' ? 'Pending Approval' :
                   booking.status === 'completed' ? 'Leave a Review' :
                   `Status: ${booking.status}`}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>

            {/* Booking Details Card */}
            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingTitle}>Booking Details</Text>
                <View style={[styles.statusBadge, {backgroundColor: getStatusColor(booking.status)}]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Icon name="person" size={18} color={COLORS.placeHolderColor} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>
                        {userType === 'companion' ? 'Client' : 'Companion'}
                      </Text>
                      <Text style={styles.detailValue}>
                        {userType === 'companion' ? booking.clientName : booking.companion}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Icon name="event" size={18} color={COLORS.placeHolderColor} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Date</Text>
                      <Text style={styles.detailValue}>
                        {moment(booking.date, 'YYYY-MM-DD').format('MMM DD, YYYY')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="access-time" size={18} color={COLORS.placeHolderColor} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Time</Text>
                      <Text style={styles.detailValue}>
                        {booking.startTime} - {booking.endTime}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Icon name="room-service" size={18} color={COLORS.placeHolderColor} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Service Type</Text>
                      <Text style={styles.detailValue}>{booking.service}</Text>
                    </View>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="timer" size={18} color={COLORS.placeHolderColor} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{booking.duration} min</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <View style={[styles.detailItem, {flex: 1}]}>
                    <Icon name="location-on" size={18} color={COLORS.placeHolderColor} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Location</Text>
                      <Text style={styles.detailValue}>{booking.location}</Text>
                    </View>
                  </View>
                </View>

                {booking.notes && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.notesSection}>
                      <Text style={styles.notesTitle}>Notes:</Text>
                      <Text style={styles.notesText}>{booking.notes}</Text>
                    </View>
                  </>
                )}

                {userType === 'companion' && booking.clientEmail && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactTitle}>Contact Information</Text>
                      <View style={styles.contactRow}>
                        <Icon name="email" size={16} color={COLORS.placeHolderColor} />
                        <Text style={styles.contactText}>{booking.clientEmail}</Text>
                      </View>
                      {booking.clientPhone && booking.clientPhone !== '-' && (
                        <View style={styles.contactRow}>
                          <Icon name="phone" size={16} color={COLORS.placeHolderColor} />
                          <Text style={styles.contactText}>{booking.clientPhone}</Text>
                        </View>
                      )}
                    </View>
                  </>
                )}

                {booking.rejectReason && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.rejectReasonSection}>
                      <Text style={styles.rejectReasonTitle}>Rejection Reason:</Text>
                      <Text style={styles.rejectReasonText}>{booking.rejectReason}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Action Buttons for Pending Bookings */}
            {booking.status === 'pending' && userType === 'companion' && !showRejectForm && (
              <Animated.View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => setShowRejectForm(true)}
                  disabled={isSubmitting}>
                  <LinearGradient
                    colors={['#F44336', '#d32f2f']}
                    style={styles.actionGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <Icon name="close" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAccept}
                  disabled={isSubmitting}>
                  <LinearGradient
                    colors={['#00CB07', '#00a806']}
                    style={styles.actionGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    {isSubmitting ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <>
                        <Icon name="check" size={20} color={COLORS.white} />
                        <Text style={styles.actionButtonText}>Accept</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Reject Form */}
            {showRejectForm && (
              <Reanimated.View
                entering={SlideInDown.duration(300).springify()}
                style={styles.rejectFormContainer}>
                <Text style={styles.rejectFormTitle}>Reason for Rejection</Text>
                <TextInput
                  style={styles.rejectInput}
                  value={rejectReason}
                  onChangeText={setRejectReason}
                  placeholder="Please provide a reason for rejection..."
                  placeholderTextColor={COLORS.placeHolderColor}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.rejectFormButtons}>
                  <TouchableOpacity
                    style={styles.cancelRejectButton}
                    onPress={() => {
                      setShowRejectForm(false);
                      setRejectReason('');
                    }}>
                    <Text style={styles.cancelRejectText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.confirmRejectButton, !rejectReason.trim() && styles.disabledButton]}
                    onPress={handleReject}
                    disabled={!rejectReason.trim() || isSubmitting}>
                    <LinearGradient
                      colors={['#F44336', '#d32f2f']}
                      style={styles.confirmRejectGradient}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}>
                      {isSubmitting ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                      ) : (
                        <Text style={styles.confirmRejectText}>Confirm Rejection</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Reanimated.View>
            )}

            {/* Review Section for Completed Bookings */}
            {booking.status === 'completed' && (
              <Reanimated.View
                entering={FadeIn.duration(500)}
                style={styles.reviewContainer}>
                <Text style={styles.reviewTitle}>Rate Your Experience</Text>
                <StarRating />
                <Text style={styles.reviewLabel}>Leave a Review</Text>
                <TextInput
                  style={styles.reviewInput}
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder="Share your experience..."
                  placeholderTextColor={COLORS.placeHolderColor}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[styles.submitReviewButton, (!rating || !reviewText.trim()) && styles.disabledButton]}
                  onPress={handleSubmitReview}
                  disabled={!rating || !reviewText.trim() || isSubmitting}>
                  <LinearGradient
                    colors={[COLORS.specialTextColor, '#6366f1']}
                    style={styles.submitReviewGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    {isSubmitting ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <>
                        <Icon name="rate-review" size={20} color={COLORS.white} />
                        <Text style={styles.submitReviewText}>Submit Review</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Reanimated.View>
            )}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 9999,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: height * 0.9,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 25,
    zIndex: 10000,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'QUICKBLOD',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'QUICKREGULAR',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 3,
  },
  closeButton: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookingTitle: {
    fontSize: 20,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'QUICKBLOD',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  bookingDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 0.48,
  },
  detailTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.placeHolderColor,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  notesSection: {
    marginTop: 5,
  },
  notesTitle: {
    fontSize: 14,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 13,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.placeHolderColor,
    lineHeight: 20,
  },
  contactInfo: {
    marginTop: 5,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactText: {
    fontSize: 13,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.placeHolderColor,
    marginLeft: 8,
  },
  rejectReasonSection: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 10,
  },
  rejectReasonTitle: {
    fontSize: 14,
    fontFamily: 'QUICKBLOD',
    color: '#d32f2f',
    marginBottom: 5,
  },
  rejectReasonText: {
    fontSize: 13,
    fontFamily: 'QUICKREGULAR',
    color: '#c62828',
    lineHeight: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rejectButton: {
    flex: 0.48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  acceptButton: {
    flex: 0.48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'QUICKBLOD',
    color: COLORS.white,
    marginLeft: 8,
  },
  rejectFormContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  rejectFormTitle: {
    fontSize: 18,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
    marginBottom: 15,
  },
  rejectInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.textColor,
    backgroundColor: '#f8f9fa',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  rejectFormButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelRejectButton: {
    flex: 0.35,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelRejectText: {
    fontSize: 14,
    fontFamily: 'QUICKBLOD',
    color: COLORS.placeHolderColor,
  },
  confirmRejectButton: {
    flex: 0.6,
    borderRadius: 10,
    overflow: 'hidden',
  },
  confirmRejectGradient: {
    padding: 14,
    alignItems: 'center',
  },
  confirmRejectText: {
    fontSize: 14,
    fontFamily: 'QUICKBLOD',
    color: COLORS.white,
  },
  reviewContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  reviewTitle: {
    fontSize: 20,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  starWrapper: {
    marginHorizontal: 5,
  },
  reviewLabel: {
    fontSize: 16,
    fontFamily: 'QUICKBLOD',
    color: COLORS.textColor,
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    fontFamily: 'QUICKREGULAR',
    color: COLORS.textColor,
    backgroundColor: '#f8f9fa',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitReviewButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitReviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  submitReviewText: {
    fontSize: 16,
    fontFamily: 'QUICKBLOD',
    color: COLORS.white,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ReviewBookingModal;