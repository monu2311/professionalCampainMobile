/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Text } from 'react-native-paper';
import ChatHeader from './ChatHeader';
import { ICONS } from '../../constants/Icons';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { COLORS, PADDING, TYPOGRAPHY, WIDTH } from '../../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { getNewMsg, sendChatMessage } from '../../reduxSlice/apiSlice';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Chat = () => {
  const profileData = useSelector(state => state.profile?.user_profile);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const { userDetails, userChatHistory } = route?.params?.routeData || {
    userDetails: {
      image: "assd",
      name: 'Ravi'
    }
  };
  const propfileData = {
    image: userDetails?.profile_file,
    name: userDetails?.user_name,
    lastmessage: 'omg, this is amazing',
  };

  console.log("userDetails", userDetails)

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <ChatHeader data={propfileData} />,
    });
  }, [navigation, propfileData, userDetails]);

  const [chatList, steChatList] = useState(userChatHistory);
  console.log("chatList", chatList)
  const [massage, setMassage] = useState('');
  const [file, setFile] = useState('');
  const [isSending, setIsSending] = useState(false);

  const dispatch = useDispatch();

  // Keyboard listeners
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        // Scroll to bottom when keyboard opens
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Keyboard hidden
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  //UPLOAD IMAGES LOGICS

  const onCamera = () => {
    // Prevent if already sending
    if (isSending) {
      return;
    }

    setTimeout(() => {
      ImagePicker.openCamera({
        width: 120,
        height: 120,
        borderRadius: 60,
        cropping: true,
        includeBase64: true,
      }).then(image => {
        const file = {
          uri: image.path,
          type: image.mime,
          name: image.filename || `image_${Date.now()}.jpg`,
        };
        setFile(file);
        setTimeout(() => {
          sendMessages();
        }, 100);
      });
    }, 1000);
  };

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'];

  const onGallery = () => {
    // Prevent if already sending
    if (isSending) {
      return;
    }

    ImagePicker.openPicker({
      width: 120,
      height: 120,
      borderRadius: 60,
      cropping: true,
      includeBase64: true,
      multiple: true, // optional if you want multiple files
      maxFiles: 1,
    })
      .then(images => {
        const selectedImages = Array.isArray(images) ? images : [images];

        selectedImages.forEach(image => {
          if (allowedTypes.includes(image.mime)) {
            const file = {
              lastModified: image?.modificationDate,
              size: image?.size,
              type: image.mime,
              name: image.filename,
              uri: image?.path,
            };
            setFile(file); // single profile image
            setTimeout(() => {
              sendMessages();
            }, 1000);
          } else {
            Alert.alert(
              'Invalid File Type',
              `Only JPEG, PNG, and JFIF images are allowed.\n\nSelected: ${image.mime}`,
            );
          }
        });
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          console.error('Image Picker Error:', err);
        }
      });
  };

  const SelectFromGallery = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Alert.alert('Upload Image', 'Choose an option', [
          {
            text: 'Camera',
            onPress: () => {
              onCamera();
            },
          },
          {
            text: 'Gallery',
            onPress: () => {
              onGallery();
            },
          },
          { text: 'Cancel', onPress: () => { } },
        ]);
      } catch (error) {
        console.log('eeeeeeoeoeoeo', error);
      }
    }
  };

  //END

  const sendMessages = async () => {
    // Prevent multiple sends
    if (isSending) {
      return;
    }

    // Validate if there's content to send
    const hasMessage = massage?.trim()?.length > 0;
    const hasFile = file && (file.uri || file);

    // Return early if both message and file are empty
    if (!hasMessage && !hasFile) {
      return;
    }

    // Set sending state
    setIsSending(true);

    const date = moment(new Date()).format('YYYY-MM-DD');
    const formData = new FormData();

    if (hasMessage) {
      formData.append('message', massage.trim());
    }
    if (hasFile) {
      formData.append('file', file);
    }

    const messageObj = {
      from_id: {
        id: profileData?.user_id,
      },
      to_id: userDetails?.user_id,
      ...(hasMessage && { message: massage.trim() }),
      ...(hasFile && { file: file?.uri || file }),
    };

    try {
      const responsee = await dispatch(
        sendChatMessage({
          id: userDetails?.user_id,
          payloadData: formData,
        }),
      );
      if (responsee?.status != '0') {
        steChatList(prev => ({
          ...(prev || {}),
          [date]: [...((prev && prev[date]) ? prev[date] : []), messageObj],
        }));
        setMassage('');
        setFile(''); // Clear file after sending
        // Scroll to bottom after sending
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.log('error--->', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      // Always reset sending state
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!isFocused || !userDetails?.user_id) {
      return;
    }
    const interval = setInterval(async () => {
      const response = await dispatch(getNewMsg(userDetails?.user_id));
      console.log("getNewMsg getNewMsg", response)
      if (response?.message && response?.time) {
        const date = moment(new Date()).format('YYYY-MM-DD');
        const messageObj = {
          from_id: {
            id: userDetails?.user_id,
          },

          ...(response?.message?.trim() && { message: response?.message.trim() }),
          ...(response?.file && { file: response?.file?.uri }), // assuming `file` is a non-null object or string

        }
        console.log("messageObjmessageObjmessageObj",messageObj)
        steChatList(prev => ({
          ...(prev || {}),
          [date]: [...((prev && prev[date]) ? prev[date] : []), messageObj],
        }));

      };

    }, 15000);
    return () => clearInterval(interval);
  }, [dispatch, isFocused, userDetails?.id]);

  const renderMessage = (item, index, isFromUser) => {
    const messageStyle = isFromUser ? styles.sentMessage : styles.receivedMessage;
    const textStyle = isFromUser ? styles.sentText : styles.receivedText;

    return (
      <View key={index} style={[styles.messageContainer, isFromUser ? styles.sentContainer : styles.receivedContainer]}>
        {item?.message ? (
          <View style={messageStyle}>
            <Text style={textStyle}>{item.message}</Text>
          </View>
        ) : (
          <View style={[messageStyle, styles.imageMessage]}>
            <FastImage
              style={styles.messageImage}
              source={{
                uri: item?.image?.replace?.('/public/public/', '/public/') || item?.file?.uri || item?.file,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        )}
        <Text style={styles.messageTime}>
          {moment(item?.created_at || new Date()).format('HH:mm')}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">

        {Object?.entries(chatList)?.map(([date, messages]) => (
          <View key={date}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{moment(date).format('MMMM DD, YYYY')}</Text>
            </View>

            {messages?.map((item, index) => {
              const isFromUser = item?.from_id?.id === profileData?.user_id;
              return renderMessage(item, `${date}_${index}`, isFromUser);
            })}
          </View>
        ))}
      </ScrollView>
      <View style={[styles.inputContainer, Platform.OS === 'android' && { paddingBottom: 20 }]}>
        <View style={styles.inputWrapper}>
          <Pressable
            onPress={SelectFromGallery}
            style={[styles.attachButton, isSending && styles.attachButtonDisabled]}
            disabled={isSending}>
            <Icon name="attach-file" size={22} color={isSending ? COLORS.placeHolderColor : COLORS.specialTextColor} />
          </Pressable>

          <TextInput
            placeholder="Type a message..."
            style={styles.textInput}
            value={massage}
            onChangeText={setMassage}
            multiline
            maxLength={1000}
          />

          <Pressable
            onPress={sendMessages}
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            disabled={isSending}>
            <Icon name="send" size={20} color={COLORS.white} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: PADDING.medium,
  },
  messagesContent: {
    paddingTop: PADDING.medium,
    paddingBottom: PADDING.large,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: PADDING.medium,
  },
  dateText: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    backgroundColor: COLORS.white,
    paddingHorizontal: PADDING.medium,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageContainer: {
    marginVertical: 2,
    maxWidth: WIDTH * 0.75,
  },
  sentContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  sentMessage: {
    backgroundColor: COLORS.specialTextColor,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small + 2,
    marginBottom: 2,
  },
  receivedMessage: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small + 2,
    marginBottom: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sentText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    lineHeight: 20,
  },
  receivedText: {
    color: COLORS.textColor,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    lineHeight: 20,
  },
  imageMessage: {
    padding: 4,
    overflow: 'hidden',
  },
  messageImage: {
    width: WIDTH * 0.6,
    height: 200,
    borderRadius: 12,
  },
  messageTime: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginTop: 2,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: PADDING.medium,
    paddingVertical: PADDING.small,
    paddingBottom: Platform.OS === 'ios' ? PADDING.large : PADDING.medium,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f1f3f4',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 48,
  },
  attachButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    paddingHorizontal: PADDING.small,
    paddingVertical: PADDING.small,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: COLORS.specialTextColor,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  attachButtonDisabled: {
    opacity: 0.5,
  },
});

export default Chat;
