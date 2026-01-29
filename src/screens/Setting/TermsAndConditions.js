/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY, WIDTH} from '../../constants/theme';
import CustomHeader from '../../navigation/CustomHeader';

const TermsAndConditions = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader label="Terms and Conditions" />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          <Text style={styles.mainTitle}>Terms and Conditions of Use</Text>
          <Text style={styles.subTitle}>For Site Users</Text>

          <Text style={styles.notice}>
            PLEASE TAKE YOUR TIME TO READ THESE TERMS AND CONDITIONS BEFORE USING THE SITE.
          </Text>

          <Text style={styles.paragraph}>
            These Terms govern your use of the Site located at Uniform Resource Locator www.professionalcompanionship.com, and form a binding contractual agreement between you, the user of the Site, and us, Professionalcompanionship.com (Professional Companionship). For that reason, these Terms are important, and you should read them carefully before you use the Site.
          </Text>

          <Text style={styles.paragraph}>
            By using the Site, including viewing or browsing the Site, you agree that you have had sufficient chance to read and understand these Terms and that you agree to be bound by these Terms. You acknowledge and agree that these Terms incorporate the Privacy Policy, The Advertiser Terms and the Replacement and Refund Policy.
          </Text>

          <Text style={styles.paragraph}>
            You warrant that you are at least 18-years old and you are legally capable of entering into these Terms. Professional Companionship specifically prohibits the use of the Site by minors.
          </Text>

          <Text style={styles.paragraph}>
            If you do not agree to these Terms, you must not access or otherwise use the Site.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessing the Site</Text>
            <Text style={styles.paragraph}>
              The content of the Site is provided to you "as is" and "as available" and we make no warranty that the Site will be uninterrupted or error-free. There may be temporary interruptions in service or content may be out-of-date. We reserve the right to withdraw or amend this Site at any time.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scope of Services</Text>
            <Text style={styles.paragraph}>
              We provide an online platform for the advertisement of companionship services. We are not a party to any communications between users and advertisers. We cannot guarantee the performance of any advertiser.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Members Only</Text>
            <Text style={styles.paragraph}>
              Access to certain areas of the Site is granted only after payment of a subscription fee. Subscription fees are subject to change and payments are processed through third-party payment gateways.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prohibited Use</Text>
            <Text style={styles.paragraph}>
              You must not use the Site for any of the following prohibited activities:
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bulletPoint}>• Defamation or harassment of any person</Text>
              <Text style={styles.bulletPoint}>• Uploading disruptive commercial messages or advertisements</Text>
              <Text style={styles.bulletPoint}>• Impersonating another person</Text>
              <Text style={styles.bulletPoint}>• Using the Site for any illegal purpose</Text>
              <Text style={styles.bulletPoint}>• Transmitting viruses or malicious code</Text>
              <Text style={styles.bulletPoint}>• Reproducing Site content without consent</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disclaimer</Text>
            <Text style={styles.paragraph}>
              We make no warranties about the completeness or accuracy of the Site content. You rely on information from the Site at your own risk.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intellectual Property</Text>
            <Text style={styles.paragraph}>
              Professional Companionship owns all intellectual property rights in the Site. You may not reproduce or commercialize any Site content without our express written consent.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Limitation of Liability and Indemnity</Text>
            <Text style={styles.paragraph}>
              We are not liable for any damages arising from your use of the Site. You agree to indemnify us against any claims arising from your use of the Site.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Termination</Text>
            <Text style={styles.paragraph}>
              We may terminate your access to the Site at any time without notice. We are not liable for any consequences of termination.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Governing Law</Text>
            <Text style={styles.paragraph}>
              These Terms are governed by the laws of Victoria, Australia. Any disputes will be subject to the exclusive jurisdiction of Australian courts.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Updates to these Terms</Text>
            <Text style={styles.paragraph}>
              We may amend these Terms at any time. Your continued use of the Site after amendments constitutes acceptance of the updated Terms.
            </Text>
          </View>

          <View style={styles.lastSection}>
            <Text style={styles.copyright}>
              © Copyright Want Some Company. All Rights Reserved
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: PADDING.large * 2,
  },
  content: {
    paddingHorizontal: PADDING.medium,
    paddingTop: PADDING.medium,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontWeight: '700',
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: PADDING.small,
    lineHeight: 28,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontWeight: '600',
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: PADDING.large,
    lineHeight: 22,
  },
  notice: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontWeight: '600',
    color: COLORS.specialTextColor,
    textAlign: 'center',
    marginBottom: PADDING.large,
    lineHeight: 20,
    backgroundColor: '#f0f4ff',
    padding: PADDING.medium,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.specialTextColor,
  },
  section: {
    marginBottom: PADDING.large,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontWeight: '600',
    color: COLORS.textColor,
    marginBottom: PADDING.small,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '400',
    color: COLORS.textColor,
    lineHeight: 22,
    textAlign: 'justify',
  },
  bulletContainer: {
    marginTop: PADDING.small,
    paddingLeft: PADDING.small,
  },
  bulletPoint: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '400',
    color: COLORS.textColor,
    lineHeight: 22,
    marginBottom: 4,
    textAlign: 'justify',
  },
  lastSection: {
    marginTop: PADDING.large,
    paddingTop: PADDING.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor || '#e5e7eb',
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontWeight: '600',
    color: COLORS.specialTextColor,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default TermsAndConditions;