import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import ButtonWrapper from '../../components/ButtonWrapper';
import {
  COLORS,
  HEIGHT,
  PADDING,
  TYPOGRAPHY,
  WIDTH,
} from '../../constants/theme';
import {otherQueries} from '../../constants/Static';
import CustomTextInput from '../../components/CustomTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {defaultStyles} from '../../constants/Styles';
import {ICONS} from '../../constants/Icons';
import WebView from 'react-native-webview';
import HTMLView from 'react-native-htmlview';

const AboutUs = ({navigation,data}) => {
  const submitHandler = () => {
    navigation.navigate('Final');
  };
  const cleanHTML = data?.description
  ?.replace(/\\r\\n/g, '')
  ?.replace(/\r?\n|\r/g, '');

  return (
    <ScrollView
      style={{backgroundColor: COLORS.white, padding: 5}}
      contentContainerStyle={{
        paddingBottom: 200,
        backgroundColor: COLORS.white,
      }}
      showsHorizontalScrollIndicator={false}
      >
      <Text
        style={{
          ...defaultStyles.header,
          color: COLORS.mainColor,
          alignSelf: 'flex-start',
          width: '100%',
          marginVertical: PADDING.small,
          paddingTop: 10,
          marginHorizontal: 10,
          marginBottom: PADDING.medium,
          fontSize: 20,
        }}>
       {data?.title}
      </Text>
      {/* <WebView
    originWhitelist={['*']}
    source={{ html:data?.description }}
/> */}
<HTMLView
        value={data?.description}
        stylesheet={htmlStyle}
      />
      {/* <Image source={ICONS.ABOUT1} style={styles.imgBox} />
      <Text
        style={{
          ...defaultStyles.header,
          color: COLORS.mainColor,
          alignSelf: 'flex-start',
          width: '100%',
          marginVertical: PADDING.small,
          marginHorizontal: 10,
          marginBottom: PADDING.medium,
          fontSize: 20,
        }}>
        Qualities of a Professional Companion
      </Text>
      <View style={{marginVertical: 0, marginHorizontal: 10}}>
        <Text style={styles?.bold}>
          Attention to Detail and Personal Grooming
        </Text>
        <Text style={styles?.light}>
          In the world of professional companionship, the allure begins with
          meticulous personal grooming—a seductive dance of attention to detail
          that tantalizes the senses. Picture a companion who not only embodies
          sophistication but takes pride in their appearance, leaving an
          indelible impression through impeccable style and the requested
          outfits.
        </Text>

        <Text style={{...styles?.bold, marginTop: PADDING.medium}}>
          Openness to Fulfilling Client Requests
        </Text>
        <Text style={styles?.light}>
          In the enticing realm of professional companionship picture a world
          where companions embrace a spectrum of requests within their defined
          limits. Whether it’s pure platonic connection via a coffee connection
          or attending a Theatre show, clarity reigns supreme. Imagine an
          atmosphere where companions and clients, in a delicate choreography,
          artfully outline services and personal boundaries upfront—a prelude to
          an experience where understanding, clarity, consent and openness
          ensures anticipation without discomfort.s
        </Text>
      </View>
      <Image
        source={ICONS.ABOUT2}
        style={{...styles.imgBox, marginTop: PADDING?.extralarge}}
      />

      <View
        style={{
          marginVertical: 0,
          marginHorizontal: 10,
          marginTop: PADDING.large,
        }}>
        <Text style={styles?.bold}>Effective Communication with Clients</Text>
        <Text style={styles?.light}>
          Communication becomes an art, a symphony of whispered desires and
          empathetic connection. A professional companion possesses the skill of
          engaging in meaningful conversation, creating an atmosphere where
          desires are understood and met with finesse.
        </Text>

        <Text style={{...styles?.bold, marginTop: PADDING.medium}}>
          Defining the Services Offered
        </Text>
        <Text style={styles?.light}>
          In the world of professional companionship, success becomes an art,
          painted with the strokes of clear definition and communication.
          Imagine a realm where companions craft a menu of services, delicately
          outlining their boundaries, and orchestrating a symphony of
          expectations. This clarity not only draws the right clientele but also
          sets the stage for a mutually satisfying experience.
        </Text>
      </View>

      <Image
        source={ICONS.ABOUT3}
        style={{...styles.imgBox, marginTop: PADDING?.extralarge}}
      />

      <View
        style={{
          marginVertical: 0,
          marginHorizontal: 10,
          marginTop: PADDING.large,
        }}>
        <Text style={styles?.bold}>Flexibility and Adaptability</Text>
        <Text style={styles?.light}>
          In the world of professional companionship, the art embraces the
          virtues of flexibility and adaptability. Picture a companion who
          effortlessly glides through a kaleidoscope of diverse needs, adjusting
          to various social settings and environments with grace. This journey
          may involve attending glamorous events, jet-setting on exotic travels,
          or engaging in activities that mirror the passions of their clients.
          The seamless dance of flexibility and adaptability not only crafts a
          bespoke experience but also ensures that what you need is tailored to
          your specific requirements.
        </Text>

        <Text style={{...styles?.bold, marginTop: PADDING.medium}}>
          Professional Ethics and Confidentiality
        </Text>
        <Text style={styles?.light}>
          Maintaining professional ethics and confidentiality is crucial for a
          professional companion. They must respect clients’ privacy, personal
          information, and any confidential conversations shared during their
          time together. This includes refraining from discussing client details
          with others and ensuring that all interactions remain confidential and
          discreet.
        </Text>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    fontSize: 15,
  },
  light: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontSize: 14,
    marginTop: PADDING.small,
    lineHeight: 26,
  },
  imgBox: {
    width: '96%',
    height: HEIGHT * 0.25,
    alignSelf: 'center',
    borderRadius: 10,
  },
});

const htmlStyle = StyleSheet.create({
  p: {
    fontWeight: '300',
  },
});

export default AboutUs;
