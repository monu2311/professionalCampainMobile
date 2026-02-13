import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
} from 'react-native';
import {
  COLORS,
  PADDING,
  TYPOGRAPHY,
  SHADOW,
} from '../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HelpSupport = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const ContentSection = ({ title, content, icon, delay = 0 }) => {
    const sectionAnim = useRef(new Animated.Value(0)).current;
    const sectionSlide = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(sectionAnim, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(sectionSlide, {
          toValue: 0,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.section,
          {
            opacity: sectionAnim,
            transform: [{ translateY: sectionSlide }],
          },
        ]}
      >
        {icon && (
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Icon name={icon} size={20} color={COLORS.white} />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        {!icon && title && <Text style={styles.sectionTitle}>{title}</Text>}
        <Text style={styles.sectionContent}>{content}</Text>
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.specialTextColor, '#4a4db8', '#6366f1']}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{  alignItems: 'center', paddingVertical:Platform.OS === 'ios' ? PADDING.medium : 0, }}> 
<Text style={styles.heroTagline}>Want Some Company</Text>
          <Text style={styles.heroTitle}>PROFESSIONAL COMPANIONSHIP</Text>
          <View style={styles.divider} />
          <Text style={styles.heroSubtitle}>
            Platonic Companions and Friends for Your Life.
          </Text>
          <Text style={styles.heroEmphasis}>
            ✨ Building Connections, Changing Lives. ✨
          </Text>
          </View>
          
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <ContentSection
          title="Professional Companionship Service"
          content="Professional Companionship was born from a desire to soothe the pangs of isolation and enhance the wellbeing of our clients. It is proven that we are all social creatures looking for connection and we are here to provide that."
          icon="people"
          delay={200}
        />

        <ContentSection
          content="Our service is designed to allow individuals to enhance connection and their enjoyment of their life and city through the warmth of companionship."
          delay={300}
        />

        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            For it is not where you are, its who you're with!
          </Text>
        </View>

        <ContentSection
          content="Our companions are carefully selected to suit a wide range of occasions from casual to luxurious."
          delay={400}
        />

        <ContentSection
          content="Whether you seek someone to enjoy a quiet night, a day of adventure or someone special for events, or just to go for a walk with or have a philosophical dialogue with, we are here to make sure you have the perfect someone to enjoy it with."
          delay={500}
        />

        <ContentSection
          content="A modern companion is a well read, eloquent, charismatic, charming and focused on your needs. Our companions enjoy learning about you, your dreams, ambitions and desires. They are caring compassionate, mysterious and sincere and each have their own shining personalities, interests and preferences."
          delay={600}
        />

        {/* What We Offer Section */}
        <Animated.View
          style={[
            styles.offerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeaderLarge}>
            <Icon name="card-giftcard" size={24} color={COLORS.specialTextColor} />
            <Text style={styles.sectionTitleLarge}>What We Offer You</Text>
          </View>
          <View style={styles.offerContent}>
            <Text style={styles.offerText}>
              Have a look at our Companion Profiles to select your perfect match, or let us know your preferences and requirements and we can match you appropriately.
            </Text>
          </View>
        </Animated.View>

        {/* Advantages Section */}
        <Animated.View
          style={[
            styles.advantagesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeaderLarge}>
            <Icon name="star" size={24} color={COLORS.gold} />
            <Text style={styles.sectionTitleLarge}>Advantages of Companionship</Text>
          </View>

          {/* Travel Partner Subsection */}
          <View style={styles.advantageItem}>
            <View style={styles.advantageHeader}>
              <Icon name="flight" size={20} color="#4ECDC4" />
              <Text style={styles.advantageTitle}>
                Excursions with Your Travel Partner:
              </Text>
            </View>
            <Text style={styles.advantageContent}>
              Travelling with someone special is a beautiful luxury. Whether it's a business rendezvous or an urban-filled escape, our high-end companions can accompany you wherever you want to go. For comfort and indulgence our companions will become key to enjoying any destination.
            </Text>
          </View>

          {/* Elegance Subsection */}
          <View style={styles.advantageItem}>
            <View style={styles.advantageHeader}>
              <Icon name="diamond" size={20} color="#FF6B6B" />
              <Text style={styles.advantageTitle}>
                Elegance Meets Sophistication:
              </Text>
            </View>
            <Text style={styles.advantageContent}>
              Our companions can enchant you and your fellow guests. In the alluring world of business, where power meets pleasure, our companions add a touch of allure. For those lavish formal dinners, let them play the role of your tantalizing partner or spouse, ensuring your evenings are as enchanting as they are business-focused.
            </Text>
          </View>

          {/* Platonic Companions Subsection */}
          <View style={styles.advantageItem}>
            <View style={styles.advantageHeader}>
              <Icon name="favorite" size={20} color="#96CEB4" />
              <Text style={styles.advantageTitle}>
                Platonic Companions for your elderly or disabled loved ones.
              </Text>
            </View>
            <Text style={styles.advantageContent}>
              Our loved ones may be missing out
            </Text>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  heroSection: {
    marginBottom: PADDING.large,
    
  },
  heroGradient: {
    padding: Platform.OS === 'android' ? PADDING.extralarge : 0,
    paddingVertical: Platform.OS === 'android' ? 40 : 0,
    alignItems: 'center',
  },
  heroTagline: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 16,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroEmphasis: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 4,
  },
  mainContent: {
    paddingHorizontal: PADDING.large,
  },
  section: {
    marginBottom: PADDING.extralarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.specialTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...SHADOW.light,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    flex: 1,
  },
  sectionContent: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 24,
  },
  highlightBox: {
    backgroundColor: COLORS.white,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.specialTextColor,
    padding: PADDING.medium,
    marginVertical: PADDING.large,
    borderRadius: 8,
    ...SHADOW.medium,
  },
  highlightText: {
    fontSize: 17,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.specialTextColor,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  offerSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: PADDING.large,
    marginBottom: PADDING.extralarge,
    ...SHADOW.medium,
  },
  sectionHeaderLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitleLarge: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginLeft: 12,
  },
  offerContent: {
    paddingTop: 8,
  },
  offerText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 24,
  },
  advantagesSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: PADDING.large,
    marginBottom: PADDING.extralarge,
    ...SHADOW.medium,
  },
  advantageItem: {
    marginTop: PADDING.large,
    paddingTop: PADDING.medium,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  advantageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  advantageTitle: {
    fontSize: 17,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginLeft: 10,
    flex: 1,
  },
  advantageContent: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 24,
    paddingLeft: 30,
  },
});

export default HelpSupport;