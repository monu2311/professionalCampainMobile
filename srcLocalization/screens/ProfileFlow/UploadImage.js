/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {register, UpdateProfile} from '../../reduxSlice/apiSlice';

import ReactNativeBlobUtil from 'react-native-blob-util';
import ScreenLoading from '../../components/ScreenLoading';
import {setProfile} from '../../reduxSlice/profileSlice';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';
import { useRTL } from '../../localization/hooks/useRTL';
import { useLanguageContext } from '../../localization/LanguageProvider';
import { getFlexDirection, getJustifyContent, getTextAlign,getWritingDirection } from '../../localization/RTLProvider';
// import { getTextAlign, getWritingDirection } from '../localization/RTLProvider';

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
  const [active, setActive] = useState(0);
  const dispatch = useDispatch();
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);
  const rtl = useRTL();
      const { isRTL } = useLanguageContext();

  const clickhandler = async () => {
    // if (!image || arrayImage.length === 0) {
    //   Alert.alert(t('common:alerts.warning'), t('screens:profile.uploadImages.imageRequired'));
    //   return;
    // }
    submitHanlder();


  };

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

        if (type === 0) {
          setImageUpload(file); // for profile image
        } else {
          setArrayImage(prev => [...prev, file]); // for gallery images
        }
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
      maxFiles: 4,
    })
      .then(images => {
        const selectedImages = Array.isArray(images) ? images : [images];

        selectedImages.forEach(image => {
          console.log('imageimage', image);
          if (allowedTypes.includes(image.mime)) {
            const file = {
              lastModified: image?.modificationDate,
              size: image?.size,
              type: image.mime,
              name: image.filename,
              uri: image?.path,
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
              t('common:alerts.error'),
              t('forms:validation.unsupportedFormat'),
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
        Alert.alert(t('screens:profile.uploadImages.uploadProfilePicture'), t('common:messages.selectOption', { defaultValue: 'Choose an option' }), [
          {
            text: t('common:buttons.takePhoto'),
            onPress: () => {
              onCamera(type);
            },
          },
          {
            text: t('screens:profile.uploadImages.selectFromGallery'),
            onPress: () => {
              onGallery(type);
            },
          },
          {text: t('common:buttons.cancel'), onPress: () => {}},
        ]);
      } catch (error) {
        console.log('eeeeeeoeoeoeo', error);
      }
    }
  };

  const submitHanlder = async () => {
    try {
      setLoader(true);
      const formdata = new FormData();
      const dave = {
        gallery: arrayImage,
        user_profile: {
          profile_image: image,
        },
      };
      if(typeof image != "string"){
        formdata.append('profile_image', image);
      }

      for (let i = 0; i < arrayImage.length - 1; i++) {
        if(!arrayImage[i]?.image?.includes("uploads")){
          formdata.append('gallery_images[]', arrayImage[i]);
        }
      }
      if (route.name == 'Gallery') {
        formdata.append('is_editing', true);
      }
      console.log('formdata', formdata);
      // setLoading(true)
      const response = await dispatch(UpdateProfile(formdata, {step: 3}));
      console.log('success--->', response);
      if (response?.status === 200) {
        route.name == 'Gallery'
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
      <View style={{...styles.flexstyle, flexDirection:getFlexDirection(isRTL), justifyContent: 'space-between', marginTop: PADDING.large}}>
        <View>
          <Text style={{...defaultStyles.header, fontSize: 22, textAlign: getTextAlign(isRTL)}}>{Title}</Text>
          <Text
            style={{
              ...defaultStyles.placeholderStyle,
              color: COLORS.black,
              marginTop: PADDING.small / 2,
              textAlign:  getTextAlign(isRTL),
            }}>
            {subtitle}
          </Text>
        </View>

        <View
          style={{display: 'flex', alignItems: 'center', flexDirection: getFlexDirection(isRTL),gap: 16}}>
          <Pressable onPress={clearHandler}>
            <Image source={ICONS.DELETICON} style={{...styles.deletedtyles}} />
          </Pressable>

          <Pressable onPress={onClick}>
            <Image source={ICONS.ADDDICON} style={styles.addStyles} />
          </Pressable>
        </View>
      </View>
    );
  };

  const conactImage = path => {
    return 'https://thecompaniondirectory.com/public/' + path;
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
          Title={t('screens:profile.uploadImages.profilePicture')}
          subtitle={t('screens:profile.uploadImages.uploadProfilePicture')}
          deletICon={false}
          clearHandler={clearhandler}
        />
        <View
          style={{
            ...styles.flexstyle,
            justifyContent: getJustifyContent(isRTL),
            paddingTop: 0,
            // flexDirection: getFlexDirection(isRTL),
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
          Title={t('screens:profile.uploadImages.gallery')}
          subtitle={t('screens:profile.uploadImages.imageRequirements')}
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
            flexDirection: getFlexDirection(isRTL),
          }}>
          {[0, 1, 2, 3].map(item => {
            return arrayImage[item] == 'undefine' ? (
              <View style={styles.boxStyles} key={item} />
            ) : (
              <Image
                source={{
                  uri:
                    arrayImage[item]?.uri ??
                    conactImage(arrayImage[item]?.image),
                }}
                style={styles.boxStyles}
                resizeMode="cover"
              />
            );
          })}
        </View>
        <ButtonWrapper
          onClick={clickhandler}
          label={ t('common:buttons.next')}
          // label={route.name === 'Gallary' ? t('common:buttons.next') : t('common:buttons.update')}
          buttonMainStyle={{alignSelf: rtl.isRTL ? 'flex-start' : 'flex-end', width: '36%'}}
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
    // marginRight: 16,
  },
  boxStyles: {
    width: '48%',
    height: HEIGHT * 0.18,
    backgroundColor: COLORS.boxColor,
    borderRadius: 8,
  },
});

export default UploadImage;
