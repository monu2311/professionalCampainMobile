/**
 * Professional Login Screen
 * Handles user authentication with proper validation, error handling, and navigation
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Keyboard,
  Platform,
} from 'react-native';
import { Card } from 'react-native-paper';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Theme and constants
import { COLORS, PADDING, TYPOGRAPHY, WIDTH } from '../../constants/theme';
import { ICONS } from '../../constants/Icons';
import { defaultStyles } from '../../constants/Styles';

// Components
import GradientWrapper from '../../components/GradientWrapper';
import CustomTextInput from '../../components/CustomTextInput';
import ButtonWrapper from '../../components/ButtonWrapper';
import ScreenLoading from '../../components/ScreenLoading';

// Custom hooks and utilities
import { useLogin } from '../../hooks/useLogin';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../localization/hooks/useTranslation';
import { NAMESPACES } from '../../localization/config/namespaces';
import { useLoginValidation } from '../../hooks/useValidation';

/**
 * Login Component
 * Professional login screen with comprehensive validation and error handling
 */
const Login = () => {
  // Localization hook
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);

  // Validation hook
  const { schema: validationSchema } = useLoginValidation();

  // Custom hooks for login functionality
  const {
    isLoading,
    errors,
    performLogin,
    validateField,
    clearFieldError,
    getFieldState,
    navigateToForgotPassword,
    navigateToSignUp,
    isTooManyAttempts,
  } = useLogin();

  const { updateAuthState } = useAuth();

  /**
   * Dismiss keyboard when tapping outside
   */
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  /**
   * Handle form submission
   */
  const handleLoginSubmit = async (values) => {
    const result = await performLogin(values);

    if (result.success) {
      // Update auth state for the app
      await updateAuthState(result.user);
    }

    return result;
  };

  /**
   * Handle field validation on blur
   */
  const handleFieldBlur = (fieldName, value) => {
    validateField(fieldName, value);
  };

  /**
   * Handle field focus (clear errors)
   */
  const handleFieldFocus = (fieldName) => {
    clearFieldError(fieldName);
  };

  /**
   * Initial form values
   */
  const initialValues = {
    user_name: '',
    password: '',
  };

  return (
    <GradientWrapper style={styles.gradientWrapper}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={50}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <Pressable onPress={dismissKeyboard}>
          <View style={styles.cardContainer}>
            <Card mode="contained" style={styles.cardStyle}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Image source={ICONS.LOGO} style={styles.logo} />
              <Text style={styles.companyName}>
                {t('common:appName.professional')} {t('common:appName.companionship')}
              </Text>
            </View>

            {/* Login Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLoginSubmit}>
              {({ handleSubmit, values, touched, setFieldValue, setFieldTouched }) => (
                <View style={styles.formContainer}>
                  <Text style={styles.loginTitle}>{t('screens:auth.loginTitle')}</Text>

                  {/* Username Field */}
                  <CustomTextInput
                    label={t('forms:labels.userName')}
                    placeholder={t('forms:placeholders.userName')}
                    name="user_name"
                    value={values.user_name}
                    onChangeText={(value) => {
                      setFieldValue('user_name', value);
                      if (errors.user_name) {
                        clearFieldError('user_name');
                      }
                    }}
                    onBlur={() => {
                      setFieldTouched('user_name', true);
                      handleFieldBlur('user_name', values.user_name);
                    }}
                    onFocus={() => handleFieldFocus('user_name')}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                    textContentType="username"
                    keyboardType="email-address"
                    returnKeyType="next"
                    error={getFieldState('user_name', values.user_name, touched.user_name).hasError}
                    errorMessage={getFieldState('user_name', values.user_name, touched.user_name).errorMessage}
                  />

                  {/* Password Field */}
                  <CustomTextInput
                    label={t('forms:labels.password')}
                    placeholder={t('forms:placeholders.password')}
                    name="password"
                    value={values.password}
                    onChangeText={(value) => {
                      setFieldValue('password', value);
                      if (errors.password) {
                        clearFieldError('password');
                      }
                    }}
                    onBlur={() => {
                      setFieldTouched('password', true);
                      handleFieldBlur('password', values.password);
                    }}
                    onFocus={() => handleFieldFocus('password')}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    error={getFieldState('password', values.password, touched.password).hasError}
                    errorMessage={getFieldState('password', values.password, touched.password).errorMessage}
                  />

                  {/* Forgot Password Link */}
                  <Pressable
                    style={styles.forgotPasswordContainer}
                    onPress={navigateToForgotPassword}
                    disabled={isLoading}>
                    <Text style={styles.forgotPasswordText}>
                      {t('screens:auth.forgotPassword')}
                    </Text>
                  </Pressable>

                  {/* Login Button */}
                  <ButtonWrapper
                    label={isLoading ? t('common:loading') : t('screens:auth.signIn')}
                    onClick={handleSubmit}
                    disabled={isLoading || isTooManyAttempts}
                    style={styles.loginButton}
                  />

                  {/* Sign Up Link */}
                  <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>
                      {t('screens:auth.dontHaveAccount')}{' '}
                      <Text
                        style={styles.signUpLink}
                        onPress={navigateToSignUp}
                        disabled={isLoading}>
                        {t('screens:auth.signUp')}
                      </Text>
                    </Text>
                  </View>

                  {/* Rate Limiting Warning */}
                  {isTooManyAttempts && (
                    <View style={styles.warningContainer}>
                      <Text style={styles.warningText}>
                        {t('screens:auth.tooManyAttempts')}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Formik>
            </Card>
          </View>
        </Pressable>
      </KeyboardAwareScrollView>

      {/* Loading Overlay */}
      <ScreenLoading loader={isLoading} />
    </GradientWrapper>
  );
};

const styles = StyleSheet.create({
  gradientWrapper: {
    backgroundColor: '#f8f9fa', // Very light background for subtle contrast
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: PADDING.large,
  },
  cardContainer: {
    alignItems: 'center',
    paddingHorizontal: PADDING.medium,
  },
  cardStyle: {
    backgroundColor: COLORS.white,
    width: WIDTH * 0.9,
    maxWidth: 400,
    borderRadius: 16,
    paddingHorizontal: PADDING.large,
    paddingVertical: PADDING.extralarge,
    marginVertical: PADDING.medium,
    // Enhanced shadow for better visibility on white background
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
    // Additional styling for better contrast
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: PADDING.large,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: PADDING.small,
  },
  companyName: {
    ...defaultStyles.buttonTextSmall,
    color: COLORS.textColor,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginTitle: {
    ...defaultStyles.header,
    color: COLORS.specialTextColor,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: PADDING.large,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: PADDING.medium,
    paddingVertical: PADDING.small,
    paddingHorizontal: PADDING.small,
  },
  forgotPasswordText: {
    color: COLORS.specialTextColor,
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: PADDING.small,
    marginBottom: PADDING.medium, // Ensure space below button
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  signUpContainer: {
    marginTop: PADDING.large,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    textAlign: 'center',
  },
  signUpLink: {
    color: COLORS.specialTextColor,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  warningContainer: {
    marginTop: PADDING.medium,
    padding: PADDING.medium,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    width: '100%',
  },
  warningText: {
    color: '#856404',
    fontSize: 12,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Login;
