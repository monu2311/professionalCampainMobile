// constants/PaymentMethods.js
export const PAYMENT_METHODS = {
    PAYPAL: {
        id: 'paypal',
        title: 'PayPal',
        subtitle: 'Pay securely with PayPal',
        iconName: 'payment',
        gradientColors: ['#0070ba', '#003087'],
        testID: 'paypal-payment-method',
        accessibilityLabel: 'Pay with PayPal',
    },
    STRIPE: {
        id: 'stripe',
        title: 'Credit/Debit Card',
        subtitle: 'Pay with Visa, MasterCard, etc.',
        iconName: 'credit-card',
        gradientColors: ['#635bff', '#4a4ae0'],
        testID: 'stripe-payment-method',
        accessibilityLabel: 'Pay with Credit or Debit Card',
    },
    // Easy to add more methods
    // APPLE_PAY: { ... },
    // GOOGLE_PAY: { ... },
};