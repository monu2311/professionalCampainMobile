/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import ChatHeader from './ChatHeader';
import {ICONS} from '../../constants/Icons';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, HEIGHT, IOS, PADDING, TYPOGRAPHY, WIDTH} from '../../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import {getNewMsg, sendChatMessage} from '../../reduxSlice/apiSlice';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Chat = () => {
  const newChatMsg = useSelector(state => state?.auth?.data?.newChatMsg);
  const profileData = useSelector(state => state.profile?.user_profile);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const {userDetails, userChatHistory} = route?.params?.routeData;
  const propfileData = {
    image: userDetails?.image,
    name: userDetails?.name,
    lastmessage: 'omg, this is amazing',
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <ChatHeader data={propfileData} />,
    });
  }, [navigation, propfileData, userDetails]);

  const [chatList, steChatList] = useState(userChatHistory);
  const [massage, setMassage] = useState('');
  const [file, setFile] = useState('');

  const dispatch = useDispatch();

  //UPLOAD IMAGES LOGICS

  const onCamera = type => {
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

  const onGallery = type => {
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
          {text: 'Cancel', onPress: () => {}},
        ]);
      } catch (error) {
        console.log('eeeeeeoeoeoeo', error);
      }
    }
  };

  //END

  const sendMessages = async () => {
    const date = moment(new Date()).format('YYYY-DD-MM');
    const formData = new FormData();

    if (massage?.length > 0 && massage?.trim()?.length > 0) {
      formData.append('message', massage);
    }
    if (file) {
      formData.append('file', file);
    }

    const messageObj = {
      from_id: profileData?.user_id,
      to_id: userDetails?.id,
      ...(massage?.trim() && {message: massage.trim()}),
      ...(file && {file: file?.uri}), // assuming `file` is a non-null object or string
    };
    try {
      const responsee = await dispatch(
        sendChatMessage({
          id: userDetails?.id,
          payloadData: formData,
        }),
      );
      if (responsee?.status != '0') {
        steChatList(prev => ({
          ...(prev || {}),
          [date]: [...((prev && prev[date]) ? prev[date] : []), messageObj],
        }));
        setMassage('');
      }
    } catch (error) {
      console.log('error--->', error);
    }
  };

  useEffect(() => {
    if (!isFocused || !userDetails?.id) {
      return;
    }
    const interval = setInterval(() => {
      dispatch(getNewMsg(userDetails?.id));
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
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}>

        {Object?.entries(chatList)?.map(([date, messages]) => (
          <View key={date}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{moment(date).format('MMMM DD, YYYY')}</Text>
            </View>

            {messages?.map((item, index) => {
              const isFromUser = item?.from_id === profileData?.user_id;
              return renderMessage(item, `${date}_${index}`, isFromUser);
            })}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Pressable onPress={SelectFromGallery} style={styles.attachButton}>
            <Icon name="attach-file" size={22} color={COLORS.specialTextColor} />
          </Pressable>

          <TextInput
            placeholder="Type a message..."
            style={styles.textInput}
            value={massage}
            onChangeText={setMassage}
            multiline
            maxLength={1000}
          />

          <Pressable onPress={sendMessages} style={styles.sendButton}>
            <Icon name="send" size={20} color={COLORS.white} />
          </Pressable>
        </View>
      </View>
    </View>
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
});

export default Chat;
