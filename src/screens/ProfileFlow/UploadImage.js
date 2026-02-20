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
import {COLORS, HEIGHT, PADDING} from '../../constants/theme';
import {ICONS} from '../../constants/Icons';
import {defaultStyles} from '../../constants/Styles';
import ButtonWrapper from '../../components/ButtonWrapper';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {UpdateProfile} from '../../reduxSlice/apiSlice';
import ScreenLoading from '../../components/ScreenLoading';

const UploadImage = () => {
  const profileData = useSelector(state => state.profile);
  // console.log('profileDataprofileData', profileData?.gallery);

  const navigation = useNavigation();

  const route = useRoute();
  const [loader, setLoader] = useState(false);
  const [image, setImageUpload] = useState(
    profileData?.user_profile?.profile_image || null,
  );
  const [arrayImage, setArrayImage] = useState(profileData?.gallery || []);
  const dispatch = useDispatch();

  const clickhandler = async () => {
    // if (!image || arrayImage.length === 0) {
    //   Alert.alert('Missing Images', 'Please upload at least one image (Profile or Gallery).');
    //   return;
    // }
    submitHanlder();


  };

  const onCamera = type => {
    ImagePicker.openCamera({
      width: 120,
      height: 120,
      borderRadius: 60,
      cropping: true,
      includeBase64: true,
    }).then(pickedImage => {
      const file = {
        uri: pickedImage.path,
        type: pickedImage.mime,
        name: pickedImage.filename || `image_${Date.now()}.jpg`,
      };

      if (type === 0) {
        setImageUpload(file); // for profile image
      } else {
        setArrayImage(prev => [...prev, file]); // for gallery images
      }
    }).catch(err => {
      if (err.code !== 'E_PICKER_CANCELLED') {
        console.error('Camera Error:', err);
        Alert.alert('Camera Error', 'Unable to take picture. Please try again.');
      }
    });
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
      maxFiles: 4,
    })
      .then(images => {
        const selectedImages = Array.isArray(images) ? images : [images];

        selectedImages.forEach(selectedImage => {
          console.log('imageimage', selectedImage);
          if (allowedTypes.includes(selectedImage.mime)) {
            const file = {
              lastModified: selectedImage?.modificationDate,
              size: selectedImage?.size,
              type: selectedImage.mime,
              name: selectedImage.filename,
              uri: selectedImage?.path,
            };
            // const file = `file:/${image.path}`
            if (type === 0) {
              setImageUpload(file); // single profile image
            } else {
              setArrayImage(prev => [...prev, file]); // for gallery images
            }

            console.log('Prepared File:', file);
          } else {
            Alert.alert(
              'Invalid File Type',
              `Only JPEG, PNG, and JFIF images are allowed.\n\nSelected: ${selectedImage.mime}`,
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

  const SelectFromGallery = type => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Alert.alert('Upload Image', 'Choose an option', [
          {
            text: 'Camera',
            onPress: () => {
              onCamera(type);
            },
          },
          {
            text: 'Gallery',
            onPress: () => {
              onGallery(type);
            },
          },
          {text: 'Cancel', onPress: () => {}},
        ]);
      } catch (error) {
        console.log('Error showing image options:', error);
      }
    }
  };

  const submitHanlder = async () => {
    try {
      setLoader(true);
      const formdata = new FormData();
      if(typeof image !== "string"){
        formdata.append('profile_image', image);
      }

      for (let i = 0; i < arrayImage.length - 1; i++) {
        if(!arrayImage[i]?.image?.includes("uploads")){
          formdata.append('gallery_images[]', arrayImage[i]);
        }
      }
      if (route.name === 'Gallery') {
        formdata.append('is_editing', true);
      }
      console.log('formdata', formdata);
      // setLoading(true)
      const response = await dispatch(UpdateProfile(formdata, {step: 3}));
      console.log('success--->', response);
      if (response?.status === 200) {
        route.name === 'Gallery'
          ? navigation?.goBack()
          : navigation.navigate('Details');
      }
    } catch (error) {
      console.log('error--->', error);
    } finally {
      setLoader(false);
    }
  };

  const clearhandler = () => {
    setImageUpload(null);
  };
  const clearhandler1 = () => {
    console.log('askjhdkja');
    setArrayImage([]);
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
          <Pressable onPress={clearHandler}>
            <Image source={ICONS.DELETICON} style={styles.deletedtyles} />
          </Pressable>

          <Pressable onPress={onClick}>
            <Image source={ICONS.ADDDICON} style={styles.addStyles} />
          </Pressable>
        </View>
      </View>
    );
  };

  const conactImage = path => {
    return 'https://thecompaniondirectory.com/' + path;
  };

  return (
    <ScrollView
      style={{backgroundColor: COLORS.white}}
      contentContainerStyle={{
        padding: PADDING.small,
        paddingBottom: PADDING.large,
        backgroundColor: COLORS.white,
      }}>
      <View>
        <RenderHeader
          onClick={() => {
            SelectFromGallery(0);
          }}
          Title={'Profile Image'}
          subtitle={'Upload Images'}
          deletICon={false}
          clearHandler={clearhandler}
        />
        <View
          style={{
            ...styles.flexstyle,
            justifyContent: 'flex-start',
            paddingTop: 0,
          }}>
          {image ? (
            <Image
              source={{uri: image?.uri ?? conactImage(image)}}
              style={styles.boxStyles}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.boxStyles} />
          )}
        </View>
        <RenderHeader
          onClick={() => {
            SelectFromGallery(1);
          }}
          Title={'Gallery Image'}
          subtitle={'Images Requirements*'}
          deletICon={true}
          clearHandler={clearhandler1}
        />

        <View
          style={{
            ...styles.flexstyle,
            justifyContent: 'space-between',
            paddingTop: 0,
            flexWrap: 'wrap',
            gap: 10,
          }}>
          {Array.from({ length: Math.max(4, arrayImage.length) }, (_, index) => {
            const image = arrayImage[index];
            return image ? (
              <Image
                key={index}
                source={{
                  uri: image?.uri ?? conactImage(image?.image),
                }}
                style={styles.boxStyles}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.boxStyles} key={index} />
            );
          })}
        </View>
        <ButtonWrapper
          onClick={clickhandler}
          label={route.name === 'Gallary' ? 'Next' : 'Update'}
          buttonMainStyle={{alignSelf: 'flex-end', width: '36%'}}
        />
      </View>
      <ScreenLoading loader={loader} />
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
    width: '48%',
    height: HEIGHT * 0.18,
    backgroundColor: COLORS.boxColor,
    borderRadius: 8,
  },
});

export default UploadImage;
