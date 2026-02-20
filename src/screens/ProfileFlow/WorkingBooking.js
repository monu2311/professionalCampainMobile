// /**
//  * User Profile Detail Screen
//  * Comprehensive profile view with all sections matching screenshots
//  */
// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
//   StatusBar,
//   Platform,
//   Share,
//   Alert,
//   ScrollView,
//   Dimensions,
//   Linking,
// } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedScrollHandler,
//   interpolate,
//   withTiming,
//   runOnJS,
// } from 'react-native-reanimated';
// import FastImage from 'react-native-fast-image';
// import LinearGradient from 'react-native-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// // Theme and constants
// import { COLORS, PADDING, TYPOGRAPHY, WIDTH } from '../../constants/theme';
// import { ICONS } from '../../constants/Icons';

// // Components
// import ButtonWrapper from '../../components/ButtonWrapper';
// import BookingModal from '../../components/BookingModal';

// // Navigation and utilities
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { showSuccessMessage, showErrorMessage } from '../../utils/messageHelpers';
// import BookingService from '../../services/BookingService';
// import ScreenLoading from '../../components/ScreenLoading';
// import { useDispatch, useSelector } from 'react-redux';
// import ChatService from '../../../src3/services/ChatService';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// const HEADER_HEIGHT = 300;
// const COLLAPSED_HEADER_HEIGHT = 90;

// const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// /**
//  * Section Components
//  */

// // Profile Info Section Component
// const ProfileInfoSection = ({ profile }) => (
//   <View style={sectionStyles.container}>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="location-on" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Location</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.location || profile?.city || 'Not specified'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="work" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Profile Type</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.profile_type || 'Trained Companions'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="height" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Height</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.height || 'Not specified'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="visibility" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Eyes</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.eye_color || 'Not specified'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="cake" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Age</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.age || 'Not specified'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="person" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Name</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.name || 'Not specified'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="location-city" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>City</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.city || 'Not specified'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="palette" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Hair Color</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.hair_color || 'Not specified'}</Text>
//     </View>
//     <View style={sectionStyles.row}>
//       <View style={sectionStyles.labelContainer}>
//         <Icon name="fitness-center" size={16} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.label}>Body Type</Text>
//       </View>
//       <Text style={sectionStyles.value}>{profile?.body_type || 'Not specified'}</Text>
//     </View>
//   </View>
// );

// // About Section Component
// const AboutSection = ({ profile }) => (
//   <>
//     {profile?.description && (
//       <View style={sectionStyles.container}>
//         <View style={sectionStyles.titleContainer}>
//           <Icon name="info" size={20} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.sectionTitle}>About me</Text>
//         </View>
//         <Text style={sectionStyles.description}>{profile.description}</Text>
//       </View>
//     )}

//     {profile?.reviews && (
//       <View style={sectionStyles.container}>
//         <View style={sectionStyles.titleContainer}>
//           <Icon name="star" size={20} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.sectionTitle}>Reviews</Text>
//         </View>
//         <Text style={sectionStyles.description}>{profile.reviews}</Text>
//       </View>
//     )}
//   </>
// );

// // Categories and Services Section
// const CategoriesServicesSection = ({ profile }) => (
//   <>
//     {profile?.categories && (
//       <View style={sectionStyles.container}>
//         <View style={sectionStyles.titleContainer}>
//           <Icon name="category" size={20} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.sectionTitle}>Categories</Text>
//         </View>
//         <Text style={sectionStyles.description}>{Array.isArray(profile.categories) ? profile.categories.join(', ') : profile.categories}</Text>
//       </View>
//     )}

//     {profile?.services && (
//       <View style={sectionStyles.container}>
//         <View style={sectionStyles.titleContainer}>
//           <Icon name="room-service" size={20} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.sectionTitle}>Services</Text>
//         </View>
//         <Text style={sectionStyles.description}>{Array.isArray(profile.services) ? profile.services.join(', ') : profile.services}</Text>
//       </View>
//     )}
//   </>
// );

// // Availability Section Component
// const AvailabilitySection = ({ profile }) => (
//   <View style={sectionStyles.container}>
//     <View style={sectionStyles.titleContainer}>
//       <Icon name="schedule" size={20} color={COLORS.specialTextColor} />
//       <Text style={sectionStyles.sectionTitle}>When can we meet?</Text>
//     </View>

//     <View style={sectionStyles.scheduleContainer}>
//       <View style={sectionStyles.scheduleHeader}>
//         <Text style={sectionStyles.scheduleHeaderText}>Weekdays</Text>
//         <Text style={sectionStyles.scheduleHeaderText}>From</Text>
//         <Text style={sectionStyles.scheduleHeaderText}>Until</Text>
//       </View>

//       {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
//         <View key={day} style={sectionStyles.scheduleRow}>
//           <Text style={sectionStyles.dayText}>{day}</Text>
//           <Text style={sectionStyles.timeText}>-</Text>
//           <Text style={sectionStyles.timeText}>-</Text>
//         </View>
//       ))}

//       {profile?.available_24_hours && (
//         <View style={sectionStyles.availabilityNote}>
//           <Icon name="access-time" size={16} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.availabilityText}>Available 24 hours</Text>
//         </View>
//       )}
//     </View>
//   </View>
// );

// // Contact Section Component
// const ContactSection = ({ profile }) => {
//   const handlePhonePress = () => {
//     if (profile?.phone) {
//       Linking.openURL(`tel:${profile.phone}`);
//     }
//   };

//   const handleEmailPress = () => {
//     if (profile?.email) {
//       Linking.openURL(`mailto:${profile.email}`);
//     }
//   };

//   const handleSMSPress = () => {
//     if (profile?.phone) {
//       Linking.openURL(`sms:${profile.phone}`);
//     }
//   };

//   return (
//     <View style={sectionStyles.container}>
//       <View style={sectionStyles.titleContainer}>
//         <Icon name="contact-phone" size={20} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.sectionTitle}>Contact</Text>
//       </View>

//       {profile?.phone && (
//         <Pressable style={sectionStyles.contactRow} onPress={handlePhonePress}>
//           <View style={sectionStyles.labelContainer}>
//             <Icon name="sms" size={16} color={COLORS.specialTextColor} />
//             <Text style={sectionStyles.label}>Phone SMS only</Text>
//           </View>
//           <Text style={sectionStyles.contactValue}>{profile.phone}</Text>
//         </Pressable>
//       )}

//       {profile?.email && (
//         <Pressable style={sectionStyles.contactRow} onPress={handleEmailPress}>
//           <View style={sectionStyles.labelContainer}>
//             <Icon name="email" size={16} color={COLORS.specialTextColor} />
//             <Text style={sectionStyles.label}>Email</Text>
//           </View>
//           <Text style={sectionStyles.contactValue}>{profile.email}</Text>
//         </Pressable>
//       )}

//       <View style={sectionStyles.contactActionsContainer}>
//         {profile?.phone && (
//           <>
//             <Pressable style={sectionStyles.contactAction} onPress={handlePhonePress}>
//               <Icon name="phone" size={20} color={COLORS.white} />
//               <Text style={sectionStyles.contactActionText}>Call</Text>
//             </Pressable>

//             <Pressable style={sectionStyles.contactAction} onPress={handleSMSPress}>
//               <Icon name="message" size={20} color={COLORS.white} />
//               <Text style={sectionStyles.contactActionText}>SMS</Text>
//             </Pressable>
//           </>
//         )}

//         {profile?.email && (
//           <Pressable style={sectionStyles.contactAction} onPress={handleEmailPress}>
//             <Icon name="email" size={20} color={COLORS.white} />
//             <Text style={sectionStyles.contactActionText}>Email</Text>
//           </Pressable>
//         )}
//       </View>
//     </View>
//   );
// };

// // Interests Section Component
// const InterestsSection = ({ profile }) => (
//   <>
//     {profile?.interests && (
//       <View style={sectionStyles.container}>
//         <View style={sectionStyles.titleContainer}>
//           <Icon name="interests" size={20} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.sectionTitle}>Interests</Text>
//         </View>
//         <Text style={sectionStyles.description}>{Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests}</Text>
//       </View>
//     )}

//     {profile?.wishlist && (
//       <View style={sectionStyles.container}>
//         <View style={sectionStyles.titleContainer}>
//           <Icon name="favorite" size={20} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.sectionTitle}>Wishlist</Text>
//         </View>
//         <Text style={sectionStyles.description}>{profile.wishlist}</Text>
//       </View>
//     )}

//     {profile?.favorite_things && (
//       <View style={sectionStyles.container}>
//         <View style={sectionStyles.titleContainer}>
//           <Icon name="thumb-up" size={20} color={COLORS.specialTextColor} />
//           <Text style={sectionStyles.sectionTitle}>My Favourite Things</Text>
//         </View>
//         <Text style={sectionStyles.description}>{profile.favorite_things}</Text>
//       </View>
//     )}
//   </>
// );

// // Gallery Section Component
// const GallerySection = ({ profile }) => {
//   const [selectedImage, setSelectedImage] = useState(null);

//   if (!profile?.selfie_gallery || !Array.isArray(profile.selfie_gallery) || profile.selfie_gallery.length === 0) {
//     return null;
//   }

//   return (
//     <View style={sectionStyles.container}>
//       <View style={sectionStyles.titleContainer}>
//         <Icon name="photo-library" size={20} color={COLORS.specialTextColor} />
//         <Text style={sectionStyles.sectionTitle}>My Selfie Gallery</Text>
//       </View>

//       <View style={sectionStyles.galleryGrid}>
//         {profile.selfie_gallery.map((imageUrl, index) => (
//           <Pressable
//             key={index}
//             style={sectionStyles.galleryItem}
//             onPress={() => setSelectedImage(imageUrl)}
//           >
//             <FastImage
//               source={{ uri: imageUrl }}
//               style={sectionStyles.galleryImage}
//               resizeMode={FastImage.resizeMode.cover}
//             />
//             <View style={sectionStyles.imageOverlay}>
//               <Icon name="zoom-in" size={24} color={COLORS.white} />
//             </View>
//           </Pressable>
//         ))}
//       </View>

//       {/* Image Modal would go here */}
//     </View>
//   );
// };

// /**
//  * Helper function to get complete image URL
//  */
// const getImageUrl = (imagePath) => {
//   if (!imagePath) return null;

//   // If it's already a full URL, return as is
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }

//   // Otherwise, prepend the base URL
//   return `https://thecompaniondirectory.com/${imagePath}`;
// };

// /**
//  * UserProfileDetail Component
//  * Professional profile detail screen with animated header and actions
//  */
// const UserProfileDetail = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const insets = useSafeAreaInsets();

//   //DISPATCH
//   const dispatch = useDispatch();

//   // Get profile data from route params - handle both 'profile' and 'data' keys
//   const { profile, data, userId } = route.params || {};

//   // State management - use 'profile' if available, otherwise use 'data'
//   const [profileData, setProfileData] = useState(profile || data || {});
//   const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [isBookingLoading, setIsBookingLoading] = useState(false);
//   console.log("profileData",profileData)

//   const checkChatRequestStatus = useSelector(state => state?.auth?.data?.checkChatRequestStatus);

//   // Animation values
//   const scrollY = useSharedValue(0);
//   const headerOpacity = useSharedValue(1);

//   /**
//    * Handle scroll animation
//    */
//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollY.value = event.contentOffset.y;

//       // Update header opacity based on scroll position
//       const opacity = interpolate(
//         scrollY.value,
//         [0, HEADER_HEIGHT / 2],
//         [1, 0]
//       );
//       headerOpacity.value = opacity;

//       // Check if header should collapse
//       const shouldCollapse = scrollY.value > HEADER_HEIGHT / 2;
//       if (shouldCollapse !== isHeaderCollapsed) {
//         runOnJS(setIsHeaderCollapsed)(shouldCollapse);
//       }
//     },
//   });

//   /**
//    * Animated header styles
//    */
//   const animatedHeaderStyle = useAnimatedStyle(() => {
//     const height = interpolate(
//       scrollY.value,
//       [0, HEADER_HEIGHT],
//       [HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT],
//       'clamp'
//     );

//     const translateY = interpolate(
//       scrollY.value,
//       [0, HEADER_HEIGHT],
//       [0, -HEADER_HEIGHT / 2],
//       'clamp'
//     );

//     return {
//       height,
//       transform: [{ translateY }],
//     };
//   });

//   /**
//    * Animated image styles
//    */
//   const animatedImageStyle = useAnimatedStyle(() => {
//     const scale = interpolate(
//       scrollY.value,
//       [0, HEADER_HEIGHT],
//       [1, 1.2],
//       'clamp'
//     );

//     return {
//       transform: [{ scale }],
//       opacity: headerOpacity.value,
//     };
//   });

//   /**
//    * Back button styles
//    */
//   const animatedBackButtonStyle = useAnimatedStyle(() => {
//     const backgroundColor = interpolate(
//       scrollY.value,
//       [0, HEADER_HEIGHT / 2],
//       [0, 1]
//     );

//     return {
//       backgroundColor: `rgba(47, 48, 145, ${backgroundColor})`,
//     };
//   });

//   /**
//    * Handle back navigation
//    */
//   const handleBack = () => {
//     navigation.goBack();
//   };

//   /**
//    * Handle chat navigation
//    */
//   // const handleChat = () => {
//   //   if (profileData?.userId || profileData?.id) {
//   //     navigation.navigate('Chat', {
//   //       userId: profileData.userId || profileData.id,
//   //       userName: profileData.name || profileData.username,
//   //       userImage: profileData.profile_image || profileData.image,
//   //     });
//   //     showSuccessMessage('Opening chat', 'Starting conversation...');
//   //   } else {
//   //     showErrorMessage('Chat Unavailable', 'Unable to start chat with this user.');
//   //   }
//   // };
//   const handleChat = async () => {
//     try {
//       // First, check if user is allowed to chat
//       const chatStatus = await ChatService.checkRequestStatus(profileData.userId || profileData.id, dispatch);
//       console.log("First, check if user is allowed to chat", chatStatus)
//       if (chatStatus.canChat) {
//         // User is allowed to chat, now fetch chat data
//         try {
//           // Fetch all chats using /chat endpoint
//           const allChatsResponse = await ChatService.getChatUsers(dispatch);
//           console.log("Fetch all chats using /chat endpoint", allChatsResponse)
//           if (allChatsResponse.success && allChatsResponse.users) {
//             // Filter data using user's email
//             const userEmail = profileData.email || profileData.user_email;
//             const matchingChat = allChatsResponse.users.find(chat =>
//               chat.user_email === userEmail ||
//               chat.email === userEmail ||
//               chat.user_id === (profileData.userId || profileData.id)
//             );
//             console.log(" Match ", matchingChat)

//             if (matchingChat) {
//               // Get chat message list using the found chat ID
//               const chatHistoryResponse = await ChatService.getChatHistory(matchingChat.id, dispatch);
//               console.log("chatHistoryResponse  Get chat message list using the found chat ID", chatHistoryResponse)

//               // Navigate to chat screen with both chat list and user details
//               navigation.navigate('Chat', {
//                 routeData: {
//                   userDetails: {
//                     id: profileData.userId || profileData.id,
//                     name: profileData.name || profileData.username,
//                     image: profileData.profile_image || profileData.image,
//                     email: userEmail
//                   },
//                   userChatHistory: chatHistoryResponse.messages || {}
//                 }
//               });
//             } else {
//               // No existing chat found, create new chat
//               navigation.navigate('Chat', {
//                 routeData: {
//                   userDetails: {
//                     id: profileData.userId || profileData.id,
//                     name: profileData.name || profileData.username,
//                     image: profileData.profile_image || profileData.image,
//                     email: userEmail
//                   },
//                   userChatHistory: {}
//                 }
//               });
//             }
//           } else {
//             // Fallback: navigate without chat history
//             navigation.navigate('Chat', {
//               routeData: {
//                 userDetails: {
//                   id: profileData.userId || profileData.id,
//                   name: profileData.name || profileData.username,
//                   image: profileData.profile_image || profileData.image,
//                   email: profileData.email || profileData.user_email
//                 },
//                 userChatHistory: {}
//               }
//             });
//           }
//         } catch (chatError) {
//           console.error('Error fetching chat data:', chatError);
//           // Still navigate to chat even if chat data fetch fails
//           navigation.navigate('Chat', {
//             routeData: {
//               userDetails: {
//                 id: profileData.userId || profileData.id,
//                 name: profileData.name || profileData.username,
//                 image: profileData.profile_image || profileData.image,
//                 email: profileData.email || profileData.user_email
//               },
//               userChatHistory: {}
//             }
//           });
//         }
//       } else {
//         // User is not allowed to chat, check status
//         if (chatStatus.status === 'pending') {
//           showWarningMessage('Your chat request is still pending. Please wait for approval.');
//         } else if (chatStatus.status === 'rejected') {
//           showWarningMessage('Your chat request was rejected. You can send a new request.');
//           // Optionally send a new chat request
//           try {
//             await ChatService.sendChatRequest(profileData.userId || profileData.id, '', dispatch);
//           } catch (error) {
//             showErrorMessage('Failed to send chat request');
//           }
//         } else {
//           // No chat request exists, send a new one
//           try {
//             await ChatService.sendChatRequest(profileData.userId || profileData.id, '', dispatch);
//           } catch (error) {
//             showErrorMessage('Failed to send chat request');
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Chat verification error:', error);
//       showErrorMessage('Failed to verify chat status');
//     }
//   };

//   /**
//    * Handle profile sharing
//    */
//   const handleShare = async () => {
//     try {
//       const shareContent = {
//         title: `Check out ${profileData.name || 'this profile'}`,
//         message: `Take a look at ${profileData.name || 'this amazing profile'} on Professional Companionship!`,
//         url: `app://profile/${profileData.userId || profileData.id}`,
//       };

//       const result = await Share.share(shareContent);
//       console.log('Share result:', result);

//       // Note: React Native Share API detection is unreliable across platforms
//       // - Android: result.action may be 'sharedAction' even when user cancels
//       // - Android: result.activityType is often undefined
//       // - iOS: More reliable but still inconsistent in some scenarios

//       // Conservative approach: Don't show automatic success messages
//       // Users will get natural feedback from their chosen sharing app
//       // This prevents false "Profile shared" messages when user cancels
//     } catch (error) {
//       showErrorMessage('Share Failed', 'Unable to share profile. Please try again.');
//     }
//   };

//   /**
//    * Handle booking button presspC
//    */
//   const handleBooking = () => {
//     setShowBookingModal(true);
//   };

//   /**
//    * Handle booking submission
//    */
//   const handleBookingSubmit = async (bookingData) => {
//     try {
//       // Start loading
//       setIsBookingLoading(true);

//       // Prepare booking parameters with all required fields
//       const bookingParams = {
//         escort_id: profileData?.userId || profileData.id,
//         booking_date: bookingData?.date || bookingData?.booking_date,
//         start_time: bookingData?.time || bookingData?.start_time || '10:00',
//         duration_minutes: bookingData?.duration || bookingData?.duration_minutes || 120,
//         service_type: bookingData?.serviceType || bookingData?.service_type || 'incall',
//         notes: bookingData?.notes || bookingData?.special_requirements || ''
//       };

//       // Prepare availability check payload
//       const availPayload = {
//         escort_id: profileData?.userId || profileData.id,
//         booking_date: bookingData?.date || bookingData?.booking_date,
//         start_time: bookingData?.time || bookingData?.start_time || '10:00',
//         duration_minutes: bookingData?.duration || bookingData?.duration_minutes || 120,
//       };

//       console.log('Checking availability with payload:', availPayload);

//       // Step 1: Check availability
//       const availabilityResponse = await BookingService.getEscortAvailability(availPayload, dispatch);
//       console.log('Availability response:', availabilityResponse);

//       // Check if the API call was successful
//       if (availabilityResponse?.success) {
//         // Check if user is available
//         // Empty availability array OR available: true means user IS available
//         if (availabilityResponse.availability?.length === 0 || availabilityResponse.available === true) {
//           console.log('User is available, proceeding with booking...');

//           // Step 2: Create booking since user is available
//           const bookingResponse = await BookingService.createBooking(bookingParams, dispatch);

//           if (bookingResponse.success) {
//             // Close modal
//             setShowBookingModal(false);

//             // Show success message
//             showSuccessMessage(
//               'Booking Requested',
//               `Your booking request for ${profileData.name || 'this companion'} has been sent successfully!`
//             );

//             // Navigate back to previous screen
//             navigation.goBack();
//           } else {
//             throw new Error(bookingResponse.message || 'Failed to create booking');
//           }
//         } else if (availabilityResponse.available === false) {
//           // User is NOT available
//           const errorMessage = availabilityResponse.reason || 'This time slot is not available';
//           console.log('User is not available:', errorMessage);
//           showErrorMessage('Booking Not Available', errorMessage);
//         } else {
//           // Unexpected response format
//           throw new Error('Unable to verify availability. Please try again.');
//         }
//       } else {
//         // API call failed
//         throw new Error(availabilityResponse?.message || 'Failed to check availability');
//       }
//     } catch (error) {
//       console.error('Booking submission error:', error);

//       // Handle different error scenarios
//       let errorMessage = 'Unable to process your booking. Please try again.';

//       if (error.message) {
//         errorMessage = error.message;
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.code === 'ERR_NETWORK') {
//         errorMessage = 'Network error. Please check your connection and try again.';
//       }

//       showErrorMessage('Booking Failed', errorMessage);
//     } finally {
//       // Always stop loading
//       setIsBookingLoading(false);
//     }
//   };

//   /**
//    * Format user info
//    */
//   const formatUserInfo = () => {
//     const age = profileData?.age ? `, ${profileData.age}` : '';
//     const location = profileData?.location || profileData?.city || 'Location not specified';
//     return `${location}${age}`;
//   };

//   /**
//    * Render profile sections
//    */
//   const renderProfileSections = () => (
//     <View style={styles.contentContainer}>
//       {/* Profile Info Section */}
//       <ProfileInfoSection profile={profileData} />

//       {/* About Section */}
//       <AboutSection profile={profileData} />

//       {/* Categories and Services Section */}
//       <CategoriesServicesSection profile={profileData} />

//       {/* Availability Section */}
//       <AvailabilitySection profile={profileData} />

//       {/* Contact Section */}
//       <ContactSection profile={profileData} />

//       {/* Interests Section */}
//       <InterestsSection profile={profileData} />

//       {/* Gallery Section */}
//       <GallerySection profile={profileData} />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor="transparent"
//         translucent={true}
//       />

//       {/* Animated Header */}
//       <Animated.View style={[styles.header, animatedHeaderStyle]}>
//         <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
//           {(profileData?.profile_image || profileData?.image || profileData?.profile_file) ? (

//             <FastImage
//               style={styles.profileImage}
//               source={{
//                 uri: profileData?.profile_file || profileData?.profile_image || profileData?.image,
//                 priority: FastImage.priority.high,
//                 cache: FastImage.cacheControl.immutable,
//               }}
              
//               resizeMode={FastImage.resizeMode.cover}
//             />

//           ) : (
//             <View style={[styles.profileImage, styles.placeholderImage]}>
//               <Icon name="person" size={80} color="rgba(255, 255, 255, 0.5)" />
//             </View>
//           )}

//           {/* Gradient Overlay */}
//           <LinearGradient
//             colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
//             style={styles.headerGradient}
//           />
//         </Animated.View>

//         {/* Header Content */}
//         <View style={styles.headerContent}>
//           <View style={styles.headerInfo}>
//             <Text style={styles.profileName}>
//               {profileData?.name || profileData?.username || 'Anonymous'}
//             </Text>
//             <Text style={styles.profileLocation}>
//               📍 {formatUserInfo()}
//             </Text>

//             {/* VIP Badge */}
//             {profileData?.is_vip && (
//               <View style={styles.vipBadge}>
//                 <Text style={styles.vipText}>VIP MEMBER</Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </Animated.View>

//       {/* Fixed Action Buttons */}
//       <View style={[styles.fixedActions, { top: insets.top + 10 }]}>
//         {/* Back Button */}
//         <Animated.View style={[styles.actionButton, animatedBackButtonStyle]}>
//           <Pressable onPress={handleBack} style={styles.actionButtonPressable}>
//             <Icon name="arrow-back" size={20} color={COLORS.white} />
//           </Pressable>
//         </Animated.View>

//         {/* Share Button */}
//         <Animated.View style={[styles.actionButton, animatedBackButtonStyle]}>
//           <Pressable onPress={handleShare} style={styles.actionButtonPressable}>
//             <Icon name="share" size={20} color={COLORS.white} />
//           </Pressable>
//         </Animated.View>
//       </View>

//       {/* Chat Button (Left Side) */}
//       <View style={[styles.chatFloatingButton, { bottom: insets.bottom + 20 }]}>
//         <Pressable onPress={handleChat} style={styles.floatingChatButton}>
//           <Icon name="chat" size={24} color={COLORS.white} />
//         </Pressable>
//       </View>

//       {/* Book Now Button (Right Side) */}
//       <View style={[styles.bookFloatingButton, { bottom: insets.bottom + 20 }]}>
//         <Pressable onPress={handleBooking} style={styles.floatingBookButton}>
//           <Icon name="event" size={24} color={COLORS.white} />
//           <Text style={styles.bookButtonText}>Book</Text>
//         </Pressable>
//       </View>

//       {/* Scrollable Content */}
//       <AnimatedScrollView
//         style={styles.scrollView}
//         contentContainerStyle={[
//           styles.scrollContent,
//           { paddingTop: HEADER_HEIGHT, paddingBottom: insets.bottom + 100 }
//         ]}
//         onScroll={scrollHandler}
//         scrollEventThrottle={16}
//         showsVerticalScrollIndicator={false}
//       >
//         {renderProfileSections()}
//       </AnimatedScrollView>

//       {/* Booking Modal with Availability Support */}
//       <BookingModal
//         visible={showBookingModal}
//         onClose={() => setShowBookingModal(false)}
//         companionData={{
//           ...profileData,
//           availability: profileData?.availability || [] // Ensure availability is passed
//         }}
//         onSubmit={handleBookingSubmit}
//         existingBookings={[]} // Pass existing bookings if available
//       />
//       <ScreenLoading loader={checkChatRequestStatus?.isLoading} message="Sending Request" />
//       <ScreenLoading loader={isBookingLoading} message="Checking availability and creating booking..." />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 2,
//     overflow: 'hidden',
//   },
//   imageContainer: {
//     width: '100%',
//     height: '100%',
//     position: 'relative',
//   },
//   profileImage: {
//     width: '100%',
//     height: '100%',
//   },
//   placeholderImage: {
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '60%',
//   },
//   headerContent: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: PADDING.large,
//   },
//   headerInfo: {
//     alignItems: 'flex-start',
//   },
//   profileName: {
//     fontSize: 28,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '700',
//     color: COLORS.white,
//     marginBottom: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   profileLocation: {
//     fontSize: 16,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: 'rgba(255,255,255,0.9)',
//     marginBottom: 12,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   vipBadge: {
//     backgroundColor: COLORS.gold,
//     paddingHorizontal: PADDING.medium,
//     paddingVertical: 6,
//     borderRadius: 20,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   vipText: {
//     color: COLORS.white,
//     fontSize: 12,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '700',
//     letterSpacing: 1,
//   },
//   fixedActions: {
//     position: 'absolute',
//     left: PADDING.large,
//     right: PADDING.large,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     zIndex: 10,
//   },
//   actionButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   actionButtonPressable: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   chatFloatingButton: {
//     position: 'absolute',
//     left: PADDING.large,
//     zIndex: 10,
//   },
//   floatingChatButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: COLORS.specialTextColor,
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: COLORS.specialTextColor,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.4,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   bookFloatingButton: {
//     position: 'absolute',
//     right: PADDING.large,
//     zIndex: 10,
//   },
//   floatingBookButton: {
//     minWidth: 80,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#FFD700',  // Gold color
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: PADDING.large,
//     gap: 6,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#FFD700',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.4,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 8,
//       },
//     }),
//   },
//   bookButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '700',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   contentContainer: {
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     marginTop: -20,
//     paddingTop: PADDING.large,
//   },
//   section: {
//     paddingHorizontal: PADDING.large,
//     paddingVertical: PADDING.medium,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '700',
//     color: COLORS.specialTextColor,
//     marginBottom: PADDING.medium,
//   },
//   description: {
//     fontSize: 16,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.textColor,
//     lineHeight: 24,
//   },
//   detailsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: PADDING.medium,
//   },
//   detailItem: {
//     flex: 1,
//     minWidth: '45%',
//     backgroundColor: 'rgba(47, 48, 145, 0.05)',
//     padding: PADDING.medium,
//     borderRadius: 12,
//   },
//   detailLabel: {
//     fontSize: 12,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.specialTextColor,
//     fontWeight: '600',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   detailValue: {
//     fontSize: 16,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.textColor,
//     fontWeight: '500',
//   },
//   availabilityContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: PADDING.small,
//   },
//   availabilityBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.successDark,
//     paddingHorizontal: PADDING.medium,
//     paddingVertical: PADDING.small,
//     borderRadius: 20,
//   },
//   availabilityBadgeToday: {
//     backgroundColor: '#ff6b35',
//   },
//   availabilityDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: COLORS.white,
//     marginRight: 8,
//   },
//   availabilityDotToday: {
//     backgroundColor: COLORS.white,
//   },
//   availabilityText: {
//     color: COLORS.white,
//     fontSize: 13,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     fontWeight: '600',
//   },
//   actionButtonsContainer: {
//     flexDirection: 'row',
//     gap: PADDING.medium,
//   },
//   chatButton: {
//     flex: 1,
//     backgroundColor: COLORS.specialTextColor,
//     borderRadius: 12,
//     paddingVertical: PADDING.medium,
//     ...Platform.select({
//       ios: {
//         shadowColor: COLORS.specialTextColor,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   chatButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '600',
//   },
// });

// // Section Styles
// const sectionStyles = StyleSheet.create({
//   container: {
//     backgroundColor: COLORS.white,
//     marginHorizontal: PADDING.medium,
//     marginVertical: PADDING.small,
//     padding: PADDING.large,
//     borderRadius: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },

//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: PADDING.medium,
//     gap: 8,
//   },

//   sectionTitle: {
//     fontSize: 20,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '700',
//     color: COLORS.textColor,
//   },

//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },

//   labelContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     gap: 6,
//   },

//   label: {
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.specialTextColor,
//     fontWeight: '600',
//   },

//   value: {
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.textColor,
//     textAlign: 'right',
//     flex: 1,
//   },

//   description: {
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.textColor,
//     lineHeight: 20,
//   },

//   // Schedule styles
//   scheduleContainer: {
//     marginTop: PADDING.small,
//   },

//   scheduleHeader: {
//     flexDirection: 'row',
//     paddingVertical: 12,
//     borderBottomWidth: 2,
//     borderBottomColor: COLORS.specialTextColor,
//   },

//   scheduleHeaderText: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '700',
//     color: COLORS.specialTextColor,
//     textAlign: 'center',
//   },

//   scheduleRow: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },

//   dayText: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.textColor,
//   },

//   timeText: {
//     flex: 1,
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.placeHolderColor,
//     textAlign: 'center',
//   },

//   availabilityNote: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: PADDING.small,
//     padding: PADDING.small,
//     backgroundColor: 'rgba(47,48,145,0.05)',
//     borderRadius: 8,
//     gap: 6,
//   },

//   availabilityText: {
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.specialTextColor,
//     fontWeight: '500',
//   },

//   // Contact styles
//   contactRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.05)',
//   },

//   contactValue: {
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKREGULAR,
//     color: COLORS.specialTextColor,
//     fontWeight: '600',
//   },

//   contactActionsContainer: {
//     flexDirection: 'row',
//     marginTop: PADDING.medium,
//     gap: 10,
//   },

//   contactAction: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.specialTextColor,
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 6,
//   },

//   contactActionText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontFamily: TYPOGRAPHY.QUICKBLOD,
//     fontWeight: '600',
//   },

//   // Gallery styles
//   galleryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: PADDING.small,
//     gap: 8,
//   },

//   galleryItem: {
//     width: '48%',
//     aspectRatio: 1,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },

//   galleryImage: {
//     width: '100%',
//     height: '100%',
//   },

//   imageOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     opacity: 0,
//   },
// });

// export default UserProfileDetail;


/**
 * User Profile Detail Screen
 * Comprehensive profile view with all sections matching screenshots
 */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  StatusBar,
  Platform,
  Share,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Theme and constants
import { COLORS, PADDING, TYPOGRAPHY } from '../../constants/theme';

// Components
import BookingModal from '../../components/BookingModal';

// Navigation and utilities
import { useNavigation, useRoute } from '@react-navigation/native';
import { showSuccessMessage, showErrorMessage } from '../../utils/messageHelpers';
import BookingService from '../../services/BookingService';
import ScreenLoading from '../../components/ScreenLoading';
import { useDispatch, useSelector } from 'react-redux';
import ChatService from '../../../src3/services/ChatService';
import AvailabilityUtils from '../../utils/AvailabilityUtils';

const HEADER_HEIGHT = 300;
const COLLAPSED_HEADER_HEIGHT = 90;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * Section Components
 */

// Profile Info Section Component
const ProfileInfoSection = ({ profile }) => (
  <View style={sectionStyles.container}>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="location-on" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Location</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.location || profile?.city || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="work" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Profile Type</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.profile_type || 'Trained Companions'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="height" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Height</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.height || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="visibility" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Eyes</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.eye_color || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="cake" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Age</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.age || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="person" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Name</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.name || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="location-city" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>City</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.city || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="palette" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Hair Color</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.hair_color || 'Not specified'}</Text>
    </View>
    <View style={sectionStyles.row}>
      <View style={sectionStyles.labelContainer}>
        <Icon name="fitness-center" size={16} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.label}>Body Type</Text>
      </View>
      <Text style={sectionStyles.value}>{profile?.body_type || 'Not specified'}</Text>
    </View>
  </View>
);

// About Section Component
const AboutSection = ({ profile }) => (
  <>
    {profile?.description && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="info" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>About me</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.description}</Text>
      </View>
    )}

    {profile?.reviews && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="star" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Reviews</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.reviews}</Text>
      </View>
    )}
  </>
);

// Categories and Services Section
const CategoriesServicesSection = ({ profile }) => (
  <>
    {profile?.categories && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="category" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Categories</Text>
        </View>
        <Text style={sectionStyles.description}>{Array.isArray(profile.categories) ? profile.categories.join(', ') : profile.categories}</Text>
      </View>
    )}

    {profile?.services && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="room-service" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Services</Text>
        </View>
        <Text style={sectionStyles.description}>{Array.isArray(profile.services) ? profile.services.join(', ') : profile.services}</Text>
      </View>
    )}
  </>
);

// Availability Section Component
const AvailabilitySection = ({ profile }) => {
  // Helper function to get day availability
  const getDayAvailability = (dayName, availability) => {
    try {
      if (!Array.isArray(availability)) {
        return { from: '--', until: '--', isAvailable: false, status: 'no-data' };
      }

      const dayData = availability.find(item =>
        item?.day?.toLowerCase() === dayName.toLowerCase()
      );

      if (!dayData) {
        // Day not in availability array = unavailable
        return { from: '--', until: '--', isAvailable: false, status: 'missing' };
      }

      if (dayData.unavailable === 1) {
        // Explicitly marked as unavailable
        return { from: '--', until: '--', isAvailable: false, status: 'blocked' };
      }

      // Use default times if empty but day exists and not marked unavailable
      const fromTime = dayData.from || "10:00 AM";
      const untilTime = dayData.until || "10:00 PM";

      // Try to parse for validation, but don't fail if parsing issues occur
      const parsedFrom = AvailabilityUtils.parseTimeString(fromTime);
      const parsedUntil = AvailabilityUtils.parseTimeString(untilTime);

      // If we have time strings and day is not unavailable, show them
      // Even if parsing has issues, display the times as provided
      if (fromTime && untilTime && dayData.unavailable !== 1) {
        return {
          from: fromTime,
          until: untilTime,
          isAvailable: true,
          status: 'available'
        };
      }

      // Only return invalid if no times at all
      return { from: '--', until: '--', isAvailable: false, status: 'invalid-time' };
    } catch (error) {
      console.error('Error processing day availability:', error);
      return { from: '--', until: '--', isAvailable: false, status: 'error' };
    }
  };

  const availability = profile?.availability || [];
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="schedule" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.sectionTitle}>When can we meet?</Text>
      </View>

      <View style={sectionStyles.scheduleContainer}>
        <View style={sectionStyles.scheduleHeader}>
          <Text style={sectionStyles.scheduleHeaderText}>Weekdays</Text>
          <Text style={sectionStyles.scheduleHeaderText}>From</Text>
          <Text style={sectionStyles.scheduleHeaderText}>Until</Text>
          {/* <Text style={sectionStyles.scheduleHeaderText}>Status</Text> */}
        </View>

        {weekDays.map((day) => {
          const dayAvailability = getDayAvailability(day, availability);
          return (
            <View key={day} style={sectionStyles.scheduleRow}>
              <Text style={sectionStyles.dayText}>{day}</Text>
              <Text style={[
                sectionStyles.timeText,
                dayAvailability.isAvailable ? sectionStyles.availableTime : sectionStyles.unavailableTime
              ]}>
                {dayAvailability.from}
              </Text>
              <Text style={[
                sectionStyles.timeText,
                dayAvailability.isAvailable ? sectionStyles.availableTime : sectionStyles.unavailableTime
              ]}>
                {dayAvailability.until}
              </Text>
              {/* <View style={sectionStyles.statusContainer}>
                <Icon
                  name={dayAvailability.isAvailable ? "check-circle" : "cancel"}
                  size={14}
                  color={dayAvailability.isAvailable ? "#00aa00" : "#ff4444"}
                />
              </View> */}
            </View>
          );
        })}

        {/* Summary Information */}
        <View style={sectionStyles.availabilitySummary}>
          {availability.length === 0 ? (
            <View style={sectionStyles.noDataContainer}>
              <Icon name="info" size={16} color={COLORS.placeHolderColor} />
              <Text style={sectionStyles.noDataText}>
                Availability schedule not provided
              </Text>
            </View>
          ) : (
            <View style={sectionStyles.summaryContainer}>
              <View style={sectionStyles.summaryRow}>
                <Icon name="check-circle" size={14} color="#00aa00" />
                <Text style={sectionStyles.summaryText}>
                  {availability.filter(d => d.unavailable !== 1).length} days available
                </Text>
              </View>
              <View style={sectionStyles.summaryRow}>
                <Icon name="info" size={14} color={COLORS.specialTextColor} />
                <Text style={sectionStyles.summaryHint}>
                  Times shown in companion's local timezone
                </Text>
              </View>
            </View>
          )}
        </View>

        {profile?.available_24_hours && (
          <View style={sectionStyles.availabilityNote}>
            <Icon name="access-time" size={16} color={COLORS.specialTextColor} />
            <Text style={sectionStyles.availabilityText}>Available 24 hours</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Contact Section Component
const ContactSection = ({ profile }) => {
  const handlePhonePress = () => {
    if (profile?.phone) {
      Linking.openURL(`tel:${profile.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (profile?.email) {
      Linking.openURL(`mailto:${profile.email}`);
    }
  };

  const handleSMSPress = () => {
    if (profile?.phone) {
      Linking.openURL(`sms:${profile.phone}`);
    }
  };

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="contact-phone" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.sectionTitle}>Contact</Text>
      </View>

      {profile?.phone && (
        <Pressable style={sectionStyles.contactRow} onPress={handlePhonePress}>
          <View style={sectionStyles.labelContainer}>
            <Icon name="sms" size={16} color={COLORS.specialTextColor} />
            <Text style={sectionStyles.label}>Phone SMS only</Text>
          </View>
          <Text style={sectionStyles.contactValue}>{profile.phone}</Text>
        </Pressable>
      )}

      {profile?.email && (
        <Pressable style={sectionStyles.contactRow} onPress={handleEmailPress}>
          <View style={sectionStyles.labelContainer}>
            <Icon name="email" size={16} color={COLORS.specialTextColor} />
            <Text style={sectionStyles.label}>Email</Text>
          </View>
          <Text style={sectionStyles.contactValue}>{profile.email}</Text>
        </Pressable>
      )}

      <View style={sectionStyles.contactActionsContainer}>
        {profile?.phone && (
          <>
            <Pressable style={sectionStyles.contactAction} onPress={handlePhonePress}>
              <Icon name="phone" size={20} color={COLORS.white} />
              <Text style={sectionStyles.contactActionText}>Call</Text>
            </Pressable>

            <Pressable style={sectionStyles.contactAction} onPress={handleSMSPress}>
              <Icon name="message" size={20} color={COLORS.white} />
              <Text style={sectionStyles.contactActionText}>SMS</Text>
            </Pressable>
          </>
        )}

        {profile?.email && (
          <Pressable style={sectionStyles.contactAction} onPress={handleEmailPress}>
            <Icon name="email" size={20} color={COLORS.white} />
            <Text style={sectionStyles.contactActionText}>Email</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

// Interests Section Component
const InterestsSection = ({ profile }) => (
  <>
    {profile?.interests && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="interests" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Interests</Text>
        </View>
        <Text style={sectionStyles.description}>{Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests}</Text>
      </View>
    )}

    {profile?.wishlist && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="favorite" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>Wishlist</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.wishlist}</Text>
      </View>
    )}

    {profile?.favorite_things && (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="thumb-up" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>My Favourite Things</Text>
        </View>
        <Text style={sectionStyles.description}>{profile.favorite_things}</Text>
      </View>
    )}
  </>
);

// Gallery Section Component
const GallerySection = ({ profile }) => {

  if (!profile?.selfie_gallery || !Array.isArray(profile.selfie_gallery) || profile.selfie_gallery.length === 0) {
    return null;
  }

  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="photo-library" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.sectionTitle}>My Selfie Gallery</Text>
      </View>

      <View style={sectionStyles.galleryGrid}>
        {profile.selfie_gallery.map((imageUrl, index) => (
          <Pressable
            key={index}
            style={sectionStyles.galleryItem}
            onPress={() => setSelectedImage(imageUrl)}
          >
            <FastImage
              source={{ uri: imageUrl }}
              style={sectionStyles.galleryImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={sectionStyles.imageOverlay}>
              <Icon name="zoom-in" size={24} color={COLORS.white} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Image Modal would go here */}
    </View>
  );
};

/**
 * Helper function to get complete image URL
 */

/**
 * UserProfileDetail Component
 * Professional profile detail screen with animated header and actions
 */
const UserProfileDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  //DISPATCH
  const dispatch = useDispatch();

  // Get profile data from route params - handle both 'profile', 'data', 'detailedProfile' and 'userId' keys
  const { profile, data, userId, detailedProfile } = route.params || {};

  // State management
  const [profileData, setProfileData] = useState(profile || data || {});
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [showChatButton, setShowChatButton] = useState(true);
  console.log("profileData",profileData)

  // Map API data to profile format for display
  const mapApiDataToProfile = (apiData) => {
    if (!apiData) return {};

    const userProfile = apiData.user_profile || apiData;
    const gallery = apiData?.gallery || []
    return {
      // Contact Details
      email: userProfile?.email || userProfile?.user_email,
      phone: userProfile?.phone || userProfile?.mobile,
      website: userProfile?.website,

      // Personal Details
      name: userProfile?.name || userProfile?.user_name || userProfile?.username,
      age: userProfile?.age,
      height: userProfile?.height,
      weight: userProfile?.weight,
      body_type: userProfile?.body_type,
      dress_size: userProfile?.dress_size,
      bust_size: userProfile?.bust_size,
      hair_color: userProfile?.hair_color,
      hair_style: userProfile?.hair_style,
      eyes: userProfile?.eyes || userProfile?.eye_color,
      ethnicity: userProfile?.ethnicity,
      education: userProfile?.education,
      gender: userProfile?.gender || userProfile?.gender_value,

      // Profile Categories
      profile_categories: userProfile?.profile_categories,
      profile_type: userProfile?.profile_type,

      // Services - handling both array and object structures
      services: Array.isArray(userProfile?.services)
        ? userProfile.services
        : userProfile?.services ? [userProfile.services] : [],

      // Location
      country: userProfile?.country,
      city: userProfile?.city || userProfile?.location,
      state: userProfile?.state,

      // Other options
      languages: userProfile?.languages,
      interested_in: userProfile?.interested_in,
      availability_type: userProfile?.availability_type,

      // Display data
      profile_image: gallery,
      description: userProfile?.description || userProfile?.bio,
      is_vip: userProfile?.is_vip || userProfile?.vip_status,

      // Keep original data for reference
      originalData: apiData
    };
  };

  // Get mapped profile data
  const mappedProfileData = detailedProfile ? mapApiDataToProfile(detailedProfile) : {};

  // Debug logging
  console.log("UserProfileDetail - detailedProfile:", detailedProfile);
  console.log("UserProfileDetail - mappedProfileData:", mappedProfileData);

  const checkChatRequestStatus = useSelector(state => state?.auth?.data?.checkChatRequestStatus);
  const currentUserProfile = useSelector(state => state.profile?.user_profile);

  // Fetch profile data when navigating via deep link (userId present but no profile data)
  useEffect(() => {
    const fetchProfileById = async () => {
      if (userId && !profile && !data) {
        setIsLoadingProfile(true);
        try {
          const { getUserProfileById } = require('../../reduxSlice/apiSlice');
          const response = dispatch(getUserProfileById(userId));

          if (response?.payload?.status === 1 || response?.payload?.data) {
            const fetchedProfile = response.payload?.data || response.payload;
            setProfileData(fetchedProfile);
            console.log('Fetched profile by ID:', fetchedProfile);
          } else {
            showErrorMessage('Profile Not Found', 'Unable to load this profile');
            navigation.goBack();
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          showErrorMessage('Error', 'Failed to load profile');
          navigation.goBack();
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    fetchProfileById();
  }, [userId, profile, data, dispatch, navigation]);

  // Check if chat button should be shown
  useEffect(() => {
    const checkChatButtonVisibility = async () => {
      // Hide chat button if current user is a companion (profile_type === 1)
      if (currentUserProfile?.profile_type === 1 || currentUserProfile?.profile_type === '1') {
        setShowChatButton(false);
        return;
      }

      // Check chat request status with the profile user
      if (profileData?.userId || profileData?.id) {
        try {
          const { checkChatRequestWithReceiver } = require('../../reduxSlice/apiSlice');
          const receiverId = profileData.userId || profileData.id;
          const response = await dispatch(checkChatRequestWithReceiver(receiverId));

          console.log('Chat request status response:', response);

          // Hide chat button if request_status is 'approved' or 'pending'
          if (response?.request_status === 'approved' ||
              response?.request_status === 'pending') {
            setShowChatButton(false);
          }
        } catch (error) {
          console.error('Error checking chat request status:', error);
          // On error, keep the button visible
        }
      }
    };

    checkChatButtonVisibility();
  }, [currentUserProfile, profileData, dispatch]);

  // Animation values
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);

  /**
   * Handle scroll animation
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      // Update header opacity based on scroll position
      const opacity = interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT / 2],
        [1, 0]
      );
      headerOpacity.value = opacity;

      // Check if header should collapse
      const shouldCollapse = scrollY.value > HEADER_HEIGHT / 2;
      if (shouldCollapse !== isHeaderCollapsed) {
        runOnJS(setIsHeaderCollapsed)(shouldCollapse);
      }
    },
  });

  /**
   * Animated header styles
   */
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT / 2],
      'clamp'
    );

    return {
      height,
      transform: [{ translateY }],
    };
  });

  /**
   * Animated image styles
   */
  const animatedImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [1, 1.2],
      'clamp'
    );

    return {
      transform: [{ scale }],
      opacity: headerOpacity.value,
    };
  });

  /**
   * Back button styles
   */
  const animatedBackButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT / 2],
      [0, 1]
    );

    return {
      backgroundColor: `rgba(47, 48, 145, ${backgroundColor})`,
    };
  });

  /**
   * Handle back navigation
   */
  const handleBack = () => {
    navigation.goBack();
  };

  /**
   * Handle chat navigation
   */
  // const handleChat = () => {
  //   if (profileData?.userId || profileData?.id) {
  //     navigation.navigate('Chat', {
  //       userId: profileData.userId || profileData.id,
  //       userName: profileData.name || profileData.username,
  //       userImage: profileData.profile_image || profileData.image,
  //     });
  //     showSuccessMessage('Opening chat', 'Starting conversation...');
  //   } else {
  //     showErrorMessage('Chat Unavailable', 'Unable to start chat with this user.');
  //   }
  // };
  const handleChat = async () => {
    try {
      // First, check if user is allowed to chat
      const chatStatus = await ChatService.checkRequestStatus(profileData.userId || profileData.id, dispatch);
      console.log("First, check if user is allowed to chat", chatStatus)
      if (chatStatus.canChat) {
        // User is allowed to chat, now fetch chat data
        try {
          // Fetch all chats using /chat endpoint
          const allChatsResponse = await ChatService.getChatUsers(dispatch);
          console.log("Fetch all chats using /chat endpoint", allChatsResponse)
          if (allChatsResponse.success && allChatsResponse.users) {
            // Filter data using user's email
            const userEmail = profileData.email || profileData.user_email;
            const matchingChat = allChatsResponse.users.find(chat =>
              chat.user_email === userEmail ||
              chat.email === userEmail ||
              chat.user_id === (profileData.userId || profileData.id)
            );
            console.log(" Match ", matchingChat)

            if (matchingChat) {
              // Get chat message list using the found chat ID
              const chatHistoryResponse = await ChatService.getChatHistory(matchingChat.id, dispatch);
              console.log("chatHistoryResponse  Get chat message list using the found chat ID", chatHistoryResponse)

              // Navigate to chat screen with both chat list and user details
              navigation.navigate('Chat', {
                routeData: {
                  userDetails: {
                    id: profileData.userId || profileData.id,
                    name: profileData.name || profileData.username,
                    image: profileData.profile_image || profileData.image,
                    email: userEmail
                  },
                  userChatHistory: chatHistoryResponse.messages || {}
                }
              });
            } else {
              // No existing chat found, create new chat
              navigation.navigate('Chat', {
                routeData: {
                  userDetails: {
                    id: profileData.userId || profileData.id,
                    name: profileData.name || profileData.username,
                    image: profileData.profile_image || profileData.image,
                    email: userEmail
                  },
                  userChatHistory: {}
                }
              });
            }
          } else {
            // Fallback: navigate without chat history
            navigation.navigate('Chat', {
              routeData: {
                userDetails: {
                  id: profileData.userId || profileData.id,
                  name: profileData.name || profileData.username,
                  image: profileData.profile_image || profileData.image,
                  email: profileData.email || profileData.user_email
                },
                userChatHistory: {}
              }
            });
          }
        } catch (chatError) {
          console.error('Error fetching chat data:', chatError);
          // Still navigate to chat even if chat data fetch fails
          navigation.navigate('Chat', {
            routeData: {
              userDetails: {
                id: profileData.userId || profileData.id,
                name: profileData.name || profileData.username,
                image: profileData.profile_image || profileData.image,
                email: profileData.email || profileData.user_email
              },
              userChatHistory: {}
            }
          });
        }
      } else {
        // User is not allowed to chat, check status
        if (chatStatus.status === 'pending') {
          showWarningMessage('Your chat request is still pending. Please wait for approval.');
        } else if (chatStatus.status === 'rejected') {
          showWarningMessage('Your chat request was rejected. You can send a new request.');
          // Optionally send a new chat request
          try {
            await ChatService.sendChatRequest(profileData.userId || profileData.id, '', dispatch);
          } catch (error) {
            showErrorMessage('Failed to send chat request');
          }
        } else {
          // No chat request exists, send a new one
          try {
            await ChatService.sendChatRequest(profileData.userId || profileData.id, '', dispatch);
          } catch (error) {
            showErrorMessage('Failed to send chat request');
          }
        }
      }
    } catch (error) {
      console.error('Chat verification error:', error);
      showErrorMessage('Failed to verify chat status');
    }
  };

  /**
   * Handle profile sharing
   */
  const handleShare = async () => {
    try {
      const profileId = profileData.userId || profileData.id;
      const profileName = profileData.name || 'this professional companion';

      const shareContent = {
        title: `${profileName} - The Companion Directory`,
        message: `Check out ${profileName}'s profile on The Companion Directory!\n\nView profile: https://thecompaniondirectory.com/profile/${profileId}`,
        url: `https://thecompaniondirectory.com/profile/${profileId}`,
      };

      const result = await Share.share(shareContent);
      console.log('Share result:', result);

      // Note: React Native Share API detection is unreliable across platforms
      // - Android: result.action may be 'sharedAction' even when user cancels
      // - Android: result.activityType is often undefined
      // - iOS: More reliable but still inconsistent in some scenarios

      // Conservative approach: Don't show automatic success messages
      // Users will get natural feedback from their chosen sharing app
      // This prevents false "Profile shared" messages when user cancels
    } catch (error) {
      showErrorMessage('Share Failed', 'Unable to share profile. Please try again.');
    }
  };

  /**
   * Handle booking button presspC
   */
  const handleBooking = () => {
    setShowBookingModal(true);
  };

  /**
   * Handle booking submission
   */
  const handleBookingSubmit = async (bookingData) => {
    try {
      // Start loading
      setIsBookingLoading(true);

      // Prepare booking parameters with all required fields
      const bookingParams = {
        escort_id: profileData?.userId || profileData.id,
        booking_date: bookingData?.date || bookingData?.booking_date,
        start_time: bookingData?.time || bookingData?.start_time || '10:00',
        duration_minutes: bookingData?.duration || bookingData?.duration_minutes || 120,
        service_type: bookingData?.serviceType || bookingData?.service_type || 'incall',
        notes: bookingData?.notes || bookingData?.special_requirements || ''
      };

      // Prepare availability check payload
      const availPayload = {
        escort_id: profileData?.userId || profileData.id,
        booking_date: bookingData?.date || bookingData?.booking_date,
        start_time: bookingData?.time || bookingData?.start_time || '10:00',
        duration_minutes: bookingData?.duration || bookingData?.duration_minutes || 120,
      };

      console.log('Checking availability with payload:', availPayload);
      // return;

      // Step 1: Check availability
      const availabilityResponse = await BookingService.getEscortAvailability(availPayload, dispatch);
      console.log('Availability response:', availabilityResponse);

      // Check if the API call was successful
      if (availabilityResponse?.success) {
        // Check if user is available
        // Empty availability array OR available: true means user IS available
        if (availabilityResponse.availability?.length === 0 || availabilityResponse.available === true) {
          console.log('User is available, proceeding with booking...');

          // Step 2: Create booking since user is available
          const bookingResponse = await BookingService.createBooking(bookingParams, dispatch);

          if (bookingResponse.success) {
            // Close modal
            setShowBookingModal(false);

            // Show success message
            showSuccessMessage(
              'Booking Requested',
              `Your booking request for ${profileData.name || 'this companion'} has been sent successfully!`
            );

            // Navigate back to previous screen
            navigation.goBack();
          } else {
            throw new Error(bookingResponse.message || 'Failed to create booking');
          }
        } else if (availabilityResponse.available === false) {
          // User is NOT available
          const errorMessage = availabilityResponse.reason || 'This time slot is not available';
          console.log('User is not available:', errorMessage);
          showErrorMessage('Booking Not Available', errorMessage);
        } else {
          // Unexpected response format
          throw new Error('Unable to verify availability. Please try again.');
        }
      } else {
        // API call failed
        throw new Error(availabilityResponse?.message || 'Failed to check availability');
      }
    } catch (error) {
      console.error('Booking submission error:', error);

      // Handle different error scenarios
      let errorMessage = 'Unable to process your booking. Please try again.';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      showErrorMessage('Booking Failed', errorMessage);
    } finally {
      // Always stop loading
      setIsBookingLoading(false);
    }
  };

  /**
   * Format user info
   */
  const formatUserInfo = () => {
    const age = profileData?.age ? `, ${profileData.age}` : '';
    const location = profileData?.country || profileData?.city || 'Location not specified';
    return `${location}${age}`;
  };

  // New Section Components for detailed profile data display

  /**
   * Contact Details Section Component
   */
  const ContactDetailsSection = ({ profile }) => (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="contact-page" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.title}>Contact Details</Text>
      </View>
      <View style={sectionStyles.content}>
        {profile?.email && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="email" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Email</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.email}</Text>
          </View>
        )}
        {profile?.phone && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="phone" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Phone</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.phone}</Text>
          </View>
        )}
        {profile?.website && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="language" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Website</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.website}</Text>
          </View>
        )}
      </View>
    </View>
  );


  const GallerySection = ({ profile }) => {

    if (!profile?.profile_image || !Array.isArray(profile?.profile_image) || profile?.profile_image.length === 0) {
      return null;
    }

    return (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="photo-library" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.sectionTitle}>My Selfie Gallery</Text>
        </View>

        {/* <View style={sectionStyles.galleryGrid}>
          {profile?.profile_image.map((imageUrl, index) => (
            <Pressable
              key={index}
              style={sectionStyles.galleryItem}
              onPress={() => setSelectedImage(imageUrl?.profile_image)}
            >
              <FastImage
                source={{ uri: imageUrl?.profile_image }}
                style={sectionStyles.galleryImage}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={sectionStyles.imageOverlay}>
                <Icon name="zoom-in" size={24} color={COLORS.white} />
              </View>
            </Pressable>
          ))}
        </View> */}

        {/* Image Modal would go here */}
      </View>
    );
  }

  /**
   * Personal Details Section Component
   */
  const PersonalDetailsSection = ({ profile }) => (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="person-outline" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.title}>Personal Details</Text>
      </View>
      <View style={sectionStyles.content}>
        {profile?.age && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="cake" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Age</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.age}</Text>
          </View>
        )}
        {profile?.height && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="height" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Height</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.height}</Text>
          </View>
        )}
        {profile?.weight && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="monitor-weight" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Weight</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.weight}</Text>
          </View>
        )}
        {profile?.body_type && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="accessibility" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Body Type</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.body_type}</Text>
          </View>
        )}
        {profile?.dress_size && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="checkroom" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Dress Size</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.dress_size}</Text>
          </View>
        )}
        {profile?.hair_color && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="palette" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Hair Color</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.hair_color}</Text>
          </View>
        )}
        {profile?.hair_style && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="face" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Hair Style</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.hair_style}</Text>
          </View>
        )}
        {profile?.eyes && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="visibility" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Eyes</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.eyes}</Text>
          </View>
        )}
        {profile?.ethnicity && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="public" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Ethnicity</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.ethnicity}</Text>
          </View>
        )}
        {profile?.education && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="school" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Education</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.education}</Text>
          </View>
        )}
        {profile?.gender && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="wc" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Gender</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.gender}</Text>
          </View>
        )}
      </View>
    </View>
  );

  /**
   * Profile Categories Section Component
   */
  const ProfileCategoriesSection = ({ profile }) => (
    profile?.profile_categories ? (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="category" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.title}>Profile Categories</Text>
        </View>
        <View style={sectionStyles.content}>
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="star" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Category</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.profile_categories}</Text>
          </View>
          {profile?.profile_type && (
            <View style={sectionStyles.row}>
              <View style={sectionStyles.labelContainer}>
                <Icon name="badge" size={16} color={COLORS.specialTextColor} />
                <Text style={sectionStyles.label}>Profile Type</Text>
              </View>
              <Text style={sectionStyles.value}>
                {profile.profile_type === 1 || profile.profile_type === '1' ? 'Companion' : 'Client'}
              </Text>
            </View>
          )}
        </View>
      </View>
    ) : null
  );

  /**
   * Services Section Component
   */
  const ServicesSection = ({ profile }) => (
    profile?.services && Array.isArray(profile.services) && profile.services.length > 0 ? (
      <View style={sectionStyles.container}>
        <View style={sectionStyles.titleContainer}>
          <Icon name="room-service" size={20} color={COLORS.specialTextColor} />
          <Text style={sectionStyles.title}>Services</Text>
        </View>
        <View style={sectionStyles.content}>
          {profile.services.map((service, index) => (
            <View key={index} style={sectionStyles.row}>
              <View style={sectionStyles.labelContainer}>
                <Icon name="check-circle" size={16} color={COLORS.specialTextColor} />
                <Text style={sectionStyles.label}>Service {index + 1}</Text>
              </View>
              <Text style={sectionStyles.value}>
                {typeof service === 'string' ? service : service?.name || service?.title || 'Service'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    ) : null
  );

  /**
   * Options Section Component
   */
  const OptionsSection = ({ profile }) => (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.titleContainer}>
        <Icon name="tune" size={20} color={COLORS.specialTextColor} />
        <Text style={sectionStyles.title}>Additional Options</Text>
      </View>
      <View style={sectionStyles.content}>
        {profile?.country && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="flag" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Country</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.country}</Text>
          </View>
        )}
        {profile?.city && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="location-city" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>City</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.city}</Text>
          </View>
        )}
        {profile?.state && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="map" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>State</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.state}</Text>
          </View>
        )}
        {profile?.languages && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="translate" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Languages</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.languages}</Text>
          </View>
        )}
        {profile?.interested_in && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="favorite" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Interested In</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.interested_in}</Text>
          </View>
        )}
        {profile?.availability_type && (
          <View style={sectionStyles.row}>
            <View style={sectionStyles.labelContainer}>
              <Icon name="schedule" size={16} color={COLORS.specialTextColor} />
              <Text style={sectionStyles.label}>Availability Type</Text>
            </View>
            <Text style={sectionStyles.value}>{profile.availability_type}</Text>
          </View>
        )}
      </View>
    </View>
  );

  /**
   * Render profile sections
   */
  const renderProfileSections = () => {
    // Use mapped detailed profile data when available, otherwise use regular profile data
    const displayProfile = detailedProfile ? mappedProfileData : profileData;

    return (
      <View style={styles.contentContainer}>
        {/* Profile Info Section */}
        <ProfileInfoSection profile={profileData} />

        {/* Conditional rendering based on detailed profile availability */}
        {detailedProfile ? (
          // Detailed profile sections using mapped API data
          <>
           <AvailabilitySection profile={profileData} />
           <GallerySection profile={displayProfile} />
            {/* Contact Details Section - exclude user_availability as requested */}
            <ContactDetailsSection profile={displayProfile} />

            {/* Personal Details Section */}
            <PersonalDetailsSection profile={displayProfile} />
            

            {/* Profile Categories Section */}
            <ProfileCategoriesSection profile={displayProfile} />

            {/* Services Section */}
            <ServicesSection profile={displayProfile} />

            {/* Options Section */}
            <OptionsSection profile={displayProfile} />

            {/* About Section */}
            <AboutSection profile={profileData} />

            {/* Gallery Section */}
            <GallerySection profile={profileData} />
          </>
        ) : (
          // Regular profile sections for existing users
          <>
            {/* About Section */}
            <AboutSection profile={profileData} />

            {/* Categories and Services Section */}
            <CategoriesServicesSection profile={profileData} />

            {/* Availability Section */}
            <AvailabilitySection profile={profileData} />

            {/* Contact Section */}
            <ContactSection profile={profileData} />

            {/* Interests Section */}
            <InterestsSection profile={profileData} />

            {/* Gallery Section */}
            <GallerySection profile={profileData} />
          </>
        )}
      </View>
    );
  };

  // Show loading screen when fetching profile via deep link
  if (isLoadingProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ScreenLoading loader={true} message="Loading profile..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <Animated.View style={[styles.imageContainer, animatedImageStyle]}>
          {(profileData?.profile_image || profileData?.image || profileData?.profile_file) ? (

            <FastImage
              style={styles.profileImage}
              source={{
                uri: profileData?.profile_file || profileData?.profile_image || profileData?.image,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              
              resizeMode={FastImage.resizeMode.cover}
            />

          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Icon name="person" size={80} color="rgba(255, 255, 255, 0.5)" />
            </View>
          )}

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.headerGradient}
          />
        </Animated.View>

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.profileName}>
              {profileData?.name || profileData?.username || 'Anonymous'}
            </Text>
            <Text style={styles.profileLocation}>
              📍 {formatUserInfo()}
            </Text>

            {/* VIP Badge */}
            {profileData?.is_vip && (
              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>VIP MEMBER</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Fixed Action Buttons */}
      <View style={[styles.fixedActions, { top: insets.top + 10 }]}>
        {/* Back Button */}
        <Animated.View style={[styles.actionButton, animatedBackButtonStyle]}>
          <Pressable onPress={handleBack} style={styles.actionButtonPressable}>
            <Icon name="arrow-back" size={20} color={COLORS.white} />
          </Pressable>
        </Animated.View>

        {/* Share Button */}
        <Animated.View style={[styles.actionButton, animatedBackButtonStyle]}>
          <Pressable onPress={handleShare} style={styles.actionButtonPressable}>
            <Icon name="share" size={20} color={COLORS.white} />
          </Pressable>
        </Animated.View>
      </View>

      {/* Chat Button (Left Side) - Only show if conditions are met */}
      {showChatButton && (
        <View style={[styles.chatFloatingButton, { bottom: insets.bottom + 20 }]}>
          <Pressable onPress={handleChat} style={styles.floatingChatButton}>
            <Icon name="chat" size={24} color={COLORS.white} />
          </Pressable>
        </View>
      )}

      {/* Book Now Button (Right Side) - Only show if current user is NOT a companion */}
      {(currentUserProfile?.profile_type !== 1 && currentUserProfile?.profile_type !== "1") && (
        <View style={[styles.bookFloatingButton, { bottom: insets.bottom + 20 }]}>
          <Pressable onPress={handleBooking} style={styles.floatingBookButton}>
            <Icon name="event" size={24} color={COLORS.white} />
            <Text style={styles.bookButtonText}>Book</Text>
          </Pressable>
        </View>
      )}

      {/* Scrollable Content */}
      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT, paddingBottom: insets.bottom + 100 }
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileSections()}
      </AnimatedScrollView>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        companionData={profileData}
        onSubmit={handleBookingSubmit}
      />
      <ScreenLoading loader={checkChatRequestStatus?.isLoading} message="Sending Request" />
      <ScreenLoading loader={isBookingLoading} message="Checking availability and creating booking..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: PADDING.large,
  },
  headerInfo: {
    alignItems: 'flex-start',
  },
  profileName: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileLocation: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  vipBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: PADDING.medium,
    paddingVertical: 6,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  vipText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    letterSpacing: 1,
  },
  fixedActions: {
    position: 'absolute',
    left: PADDING.large,
    right: PADDING.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionButtonPressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatFloatingButton: {
    position: 'absolute',
    left: PADDING.large,
    zIndex: 10,
  },
  floatingChatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.specialTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.specialTextColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bookFloatingButton: {
    position: 'absolute',
    right: PADDING.large,
    zIndex: 10,
  },
  floatingBookButton: {
    minWidth: 80,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',  // Gold color
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING.large,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: PADDING.large,
  },
  section: {
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.medium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.specialTextColor,
    marginBottom: PADDING.medium,
  },
  description: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PADDING.medium,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(47, 48, 145, 0.05)',
    padding: PADDING.medium,
    borderRadius: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontWeight: '500',
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PADDING.small,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successDark,
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small,
    borderRadius: 20,
  },
  availabilityBadgeToday: {
    backgroundColor: '#ff6b35',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  availabilityDotToday: {
    backgroundColor: COLORS.white,
  },
  availabilityText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: PADDING.medium,
  },
  chatButton: {
    flex: 1,
    backgroundColor: COLORS.specialTextColor,
    borderRadius: 12,
    paddingVertical: PADDING.medium,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.specialTextColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  chatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },
});

// Section Styles
const sectionStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: PADDING.medium,
    marginVertical: PADDING.small,
    padding: PADDING.large,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: PADDING.medium,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.textColor,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },

  label: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '600',
  },

  value: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    textAlign: 'right',
    flex: 1,
  },

  description: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 20,
  },

  // Schedule styles
  scheduleContainer: {
    marginTop: PADDING.small,
  },

  scheduleHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.specialTextColor,
  },

  scheduleHeaderText: {
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '700',
    color: COLORS.specialTextColor,
    textAlign: 'center',
  },

  scheduleRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  dayText: {
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
  },

  timeText: {
    flex: 1,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    textAlign: 'center',
  },

  availabilityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: PADDING.small,
    padding: PADDING.small,
    backgroundColor: 'rgba(47,48,145,0.05)',
    borderRadius: 8,
    gap: 6,
  },

  availabilityText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '500',
  },

  // Enhanced availability status styles
  availableTime: {
    color: COLORS.textColor,
    fontWeight: '600',
  },

  unavailableTime: {
    color: COLORS.placeHolderColor,
    fontStyle: 'italic',
  },

  statusContainer: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  availabilitySummary: {
    marginTop: PADDING.medium,
    paddingTop: PADDING.medium,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },

  noDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: PADDING.medium,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },

  noDataText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    fontStyle: 'italic',
  },

  summaryContainer: {
    gap: 6,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  summaryText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontWeight: '600',
  },

  summaryHint: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    fontStyle: 'italic',
  },

  // Contact styles
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  contactValue: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.specialTextColor,
    fontWeight: '600',
  },

  contactActionsContainer: {
    flexDirection: 'row',
    marginTop: PADDING.medium,
    gap: 10,
  },

  contactAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.specialTextColor,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },

  contactActionText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    fontWeight: '600',
  },

  // Gallery styles
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: PADDING.small,
    gap: 8,
  },

  galleryItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },

  galleryImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
});

export default UserProfileDetail;