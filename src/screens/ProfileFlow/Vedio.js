/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {COLORS, HEIGHT, PADDING, WIDTH} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {uploadVideo} from '../../reduxSlice/apiSlice';
import ScreenLoading from '../../components/ScreenLoading';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Vedio = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const profileData = useSelector(state => state.profile);
  const [loader, setLoader] = useState(false);
  const [videoArray, setVideoArray] = useState(profileData?.video || []);

  const clickhandler = async () => {
    if (videoArray.length === 0) {
      Alert.alert('No Videos', 'Please select at least one video to upload.');
      return;
    }
    submitHandler();
  };

  const submitHandler = async () => {
    try {
       const token = await AsyncStorage.getItem('ChapToken');
      setLoader(true);
      const formdata = new FormData();
      // Add videos to FormData
      for (let i = 0; i < videoArray.length; i++) {
        const video = videoArray[i];
        // Only upload new videos (not already uploaded ones)
        if (!video?.path?.includes('uploads')) {
          // Fix: Properly structure the file object for React Native FormData
          const videoUri = Platform.OS === 'ios' && video.uri && !video.uri.startsWith('file://')
            ? `file://${video.uri}`
            : video.uri;

          // Create proper file object structure for FormData
          const fileObject = {
            uri: videoUri,
            type: video.type || 'video/mp4',
            name: video.name || `video_${Date.now()}_${i}.mp4`,
            size: video.size,
            lastModifiedDate: Date.now(),
            lastModified:1768068661735
          };

          console.log('Uploading video file:', fileObject);

          // Append with correct structure - THIS IS THE KEY FIX
          formdata.append('gallery_images[]', fileObject);
          formdata.append('gallery_images[]', fileObject);  
        }
      }

      // Call the upload API
      const response = await axios.post('https://thecompaniondirectory.com/api/upload-video', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          // Add additional headers for better compatibility
          'Accept': 'application/json',
        },
        // Add timeout for large video uploads
        timeout: 120000, // 2 minutes
      });

      console.log("Upload response:", response.data);

      // Fix: Correct response handling for axios (not Redux)
      if (response?.data?.status === 1 || response?.status === 200) {
        Alert.alert('Success', 'Videos uploaded successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        // Fix: Handle error message from axios response
        const errorMessage = response?.data?.message || response?.data?.errors;
        const displayMessage = Array.isArray(errorMessage)
          ? errorMessage.join('\n')
          : (errorMessage || 'Failed to upload videos');
        Alert.alert('Error', displayMessage);
      }
    } catch (error) {
      console.error('Video upload error:', error?.response);

      // Enhanced error handling
      let errorMessage = 'Failed to upload videos. Please try again.';

      // if (error?.response?.data) {
      //   const serverError = error.response.data;
      //   if (serverError?.message) {
      //     errorMessage = Array.isArray(serverError.message)
      //       ? serverError.message.join('\n')
      //       : serverError.message;
      //   } else if (serverError?.errors) {
      //     const errors = Object.values(serverError.errors).flat();
      //     errorMessage = errors.join('\n');
      //   }
      // } else if (error?.message) {
      //   errorMessage = error.message;
      // }

      Alert.alert('Upload Error', errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const onCamera = () => {
    setTimeout(() => {
      ImagePicker.openCamera({
        mediaType: 'video',
        compressVideo: true,
      }).then(video => {
        validateAndAddVideo(video);
      }).catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          console.error('Camera Error:', err);
        }
      });
    }, 500);
  };

  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/ogg', 'video/mov'];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  const validateAndAddVideo = (video) => {
    // Check file type
    const fileType = video.mime || video.type;
    if (!allowedVideoTypes.some(type => fileType.includes(type.split('/')[1]))) {
      Alert.alert(
        'Invalid File Type',
        `Only MP4, MOV, OGG, and QT video files are allowed.\n\nSelected: ${fileType}`
      );
      return;
    }

    // Check file size
    if (video.size > MAX_FILE_SIZE) {
      const sizeMB = (video.size / (1024 * 1024)).toFixed(2);
      Alert.alert(
        'File Too Large',
        `Video size must be less than 50MB.\n\nSelected file size: ${sizeMB}MB`
      );
      return;
    }

    const file = {
      uri: video.path || video.sourceURL,
      type: video.mime || 'video/mp4',
      name: video.filename || `video_${Date.now()}.mp4`,
      size: video.size,
      duration: video.duration,
    };

    setVideoArray(prev => [...prev, file]);
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
      multiple: true,
      maxFiles: 4,
      compressVideo: true,
    })
      .then(videos => {
        const selectedVideos = Array.isArray(videos) ? videos : [videos];

        selectedVideos.forEach(video => {
          validateAndAddVideo(video);
        });
      })
      .catch(err => {
        if (err.code !== 'E_PICKER_CANCELLED') {
          console.error('Gallery Picker Error:', err);
        }
      });
  };

  const SelectFromGallery = () => {
    if (videoArray.length >= 4) {
      Alert.alert('Limit Reached', 'You can only upload up to 4 videos.');
      return;
    }

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Alert.alert('Upload Video', 'Choose an option', [
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
        console.log('Error opening picker:', error);
      }
    }
  };

  const clearVideos = () => {
    Alert.alert(
      'Clear Videos',
      'Are you sure you want to remove all videos?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => setVideoArray([]),
          style: 'destructive',
        },
      ]
    );
  };

  const removeVideo = (index) => {
    Alert.alert(
      'Remove Video',
      'Are you sure you want to remove this video?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            setVideoArray(prev => prev.filter((_, i) => i !== index));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const RenderHeader = ({
    onClick,
    Title,
    subtitle,
    deletICon,
    clearHandler,
  }) => {
    return (
      <View style={styles.flexstyle}>
        <View>
          <Text style={{...defaultStyles.header, fontSize: 22}}>{Title}</Text>
          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
              marginTop: PADDING.small / 2,
            }}>
            {subtitle}
          </Text>
        </View>

        <View
          style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
          {deletICon && videoArray.length > 0 && (
            <Pressable onPress={clearHandler}>
              <Image source={ICONS.DELETICON} style={styles.deletedtyles} />
            </Pressable>
          )}

          <Pressable onPress={onClick}>
            <Image source={ICONS.ADDDICON} style={styles.addStyles} />
          </Pressable>
        </View>
      </View>
    );
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
  };

  return (
    <ScrollView
      style={{backgroundColor: COLORS.white}}
      contentContainerStyle={{
        padding: PADDING.small,
        paddingBottom: PADDING.large,
        backgroundColor: COLORS.white
      }}>
      <View>
        <RenderHeader
          onClick={SelectFromGallery}
          Title={'Gallery Videos'}
          subtitle={`Upload Videos (MP4, MOV, OGG, QT - Max 50MB)`}
          deletICon={true}
          clearHandler={clearVideos}
        />

        <View
          style={{
            ...styles.flexstyle,
            justifyContent: 'space-between',
            paddingTop: 0,
            flexWrap: 'wrap',
            gap: 10,
          }}>
          {[0].map(index => {
            const video = videoArray[index];
            return video ? (
              <Pressable
                key={index}
                onPress={() => removeVideo(index)}
                style={styles.videoContainer}>
                <View style={styles.boxStyles}>
                  <Image
                    source={ICONS.VIDEOPLAYER}
                    style={styles.videoIcon}
                  />
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoName} numberOfLines={1}>
                      {video.name || 'Video'}
                    </Text>
                    {video.duration && (
                      <Text style={styles.videoDuration}>
                        {formatDuration(video.duration)}
                      </Text>
                    )}
                    {video.size && (
                      <Text style={styles.videoSize}>
                        {formatFileSize(video.size)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>×</Text>
                  </View>
                </View>
              </Pressable>
            ) : (
              <View style={styles.boxStyles} key={index}>
                <Image
                  source={ICONS.VIDEOPLAYER}
                  style={[styles.videoIcon, {opacity: 0.3}]}
                />
              </View>
            );
          })}
        </View>

          {/* <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {videoArray.length}/4 videos selected
            </Text>
          </View> */}

        <ButtonWrapper
          onClick={clickhandler}
          label={'Upload Videos'}
          buttonMainStyle={{alignSelf: 'flex-end', width: '36%'}}
        />
      </View>
      <ScreenLoading
        loader={loader}
        message="Uploading videos..."
      />
    </ScrollView>
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
  addStyles: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  deletedtyles: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 16,
  },
  boxStyles: {
    width: '100%',
    height: HEIGHT * 0.4,
    backgroundColor: COLORS.boxColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoContainer: {
    width: '100%',
  },
  videoIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: COLORS.specialTextColor,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  videoName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  videoDuration: {
    color: COLORS.white,
    fontSize: 10,
    marginTop: 2,
  },
  videoSize: {
    color: COLORS.white,
    fontSize: 10,
    marginTop: 2,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  infoContainer: {
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.small,
  },
  infoText: {
    color: COLORS.placeHolderColor,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Vedio;