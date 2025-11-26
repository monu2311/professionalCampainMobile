/**
 * Professional Forget Password Screen
 * Handles password reset with proper validation, error handling, and navigation
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
import { Card, Snackbar } from 'react-native-paper';
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
import { useForgetPassword } from '../../hooks/useForgetPassword';
import { forgetPasswordValidationSchema } from '../../utils/forgetPasswordValidation';

/**
 * ForgetPassword Component
 * Professional password reset screen with comprehensive validation and error handling
 */
const ForgetPassword = () => {
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarType, setSnackbarType] = React.useState('info'); // 'success', 'error', 'info'

  // Custom hooks for forget password functionality
  const {
    isLoading,
    errors,
    performPasswordReset,
    validateField,
    clearFieldError,
    getFieldState,
    navigateToLogin,
    navigateToSignUp,
    isTooManyAttempts,
  } = useForgetPassword();

  /**
   * Dismiss keyboard when tapping outside
   */
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  /**
   * Show inline snackbar message
   */
  const showSnackbar = (message, type = 'info') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  /**
   * Handle form submission
   */
  const handleResetSubmit = async (values) => {
    if (!values.email || values.email.trim() === '') {
      showSnackbar('Please enter your email address', 'error');
      return;
    }

    showSnackbar('Sending reset instructions...', 'info');
    const result = await performPasswordReset(values);

    if (result.success) {
      showSnackbar('Reset instructions sent successfully!', 'success');
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
    email: '',
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
                  Professional Companionship
                </Text>
              </View>

              {/* Reset Form */}
              <Formik
                initialValues={initialValues}
                validationSchema={forgetPasswordValidationSchema}
                onSubmit={handleResetSubmit}>
                {({ handleSubmit, values, touched, setFieldValue, setFieldTouched }) => (
                  <View style={styles.formContainer}>
                    <Text style={styles.resetTitle}>Forget Password</Text>
                    <Text style={styles.resetSubtitle}>
                      Enter your email address and we'll send you instructions to reset your password.
                    </Text>

                    {/* Email Field */}
                    <CustomTextInput
                      label="Email Address"
                      placeholder="Enter your email address"
                      name="email"
                      value={values.email}
                      onChangeText={(value) => {
                        setFieldValue('email', value);
                        if (errors.email) {
                          clearFieldError('email');
                        }
                      }}
                      onBlur={() => {
                        setFieldTouched('email', true);
                        handleFieldBlur('email', values.email);
                      }}
                      onFocus={() => handleFieldFocus('email')}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                      error={getFieldState('email', values.email, touched.email).hasError}
                      errorMessage={getFieldState('email', values.email, touched.email).errorMessage}
                    />

                    {/* Reset Button */}
                    <ButtonWrapper
                      label={isLoading ? "Sending..." : "Send"}
                      onClick={handleSubmit}
                      disabled={isLoading || isTooManyAttempts}
                      style={styles.resetButton}
                    />

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                      <Text style={styles.loginText}>
                        Remember your password?{' '}
                        <Text
                          style={styles.loginLink}
                          onPress={navigateToLogin}
                          disabled={isLoading}>
                          Sign In
                        </Text>
                      </Text>
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                      <Text style={styles.signUpText}>
                        Don't have an account?{' '}
                        <Text
                          style={styles.signUpLink}
                          onPress={navigateToSignUp}
                          disabled={isLoading}>
                          Create Account
                        </Text>
                      </Text>
                    </View>

                    {/* Rate Limiting Warning */}
                    {isTooManyAttempts && (
                      <View style={styles.warningContainer}>
                        <Text style={styles.warningText}>
                          Too many reset attempts. Please wait before trying again.
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
    backgroundColor: '#f8fafc', // Modern light background
    flex: 1,
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
    maxWidth: 420,
    borderRadius: 20,
    paddingHorizontal: PADDING.extralarge,
    paddingVertical: PADDING.extralarge * 1.2,
    marginVertical: PADDING.medium,
    // Enhanced modern shadow for better depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
    // Modern border with subtle gradient effect
    borderWidth: 1,
    borderColor: 'rgba(47, 48, 145, 0.1)',
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
  resetTitle: {
    ...defaultStyles.header,
    color: COLORS.specialTextColor,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: PADDING.small,
    textAlign: 'center',
  },
  resetSubtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    textAlign: 'center',
    marginBottom: PADDING.large,
    lineHeight: 20,
    paddingHorizontal: PADDING.small,
  },
  resetButton: {
    marginTop: PADDING.large,
    marginBottom: PADDING.large,
    width: '100%',
    borderRadius: 12,
    // Enhanced button shadow
    ...Platform.select({
      ios: {
        shadowColor: COLORS.specialTextColor,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginContainer: {
    marginTop: PADDING.medium,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    textAlign: 'center',
  },
  loginLink: {
    color: COLORS.specialTextColor,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    marginTop: PADDING.medium,
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
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 8,
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  snackbarSuccess: {
    backgroundColor: COLORS.successDark,
  },
  snackbarError: {
    backgroundColor: COLORS.red,
  },
  snackbarInfo: {
    backgroundColor: COLORS.specialTextColor,
  },
  snackbarText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontWeight: '500',
  },
});

export default ForgetPassword;
