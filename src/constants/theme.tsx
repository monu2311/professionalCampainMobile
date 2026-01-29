import {Dimensions, Platform} from 'react-native';

export const WIDTH = Dimensions.get('window').width;
export const HEIGHT = Dimensions.get('screen').height;
export const IOS = Platform.OS === 'ios' ? true : false;

export const COLORS = {
  white: '#FFF',
  black: '#000',
  textColor: '#000000', // Updated to black for normal text/labels
  red: '#DD0000',
  gold: '#C9A227',
  green: '#00CB07',
  placeHolderColor: '#B0B0B0',
  labelColor: '#000000', // Updated to black for labels
  underlineColor: '#2f3091',
  boxColor: '#D9D9D9',
  selectborder: '#BEBEBE',
  mainColor: '#2f3091', // Updated primary color
  borderColor: '#2f3091', // Updated border color
  specialTextColor: '#2f3091', // New special text color
  // Success colors
  successDark: '#0a3622',
  successLight: '#d1e7de',
  successMedium: '#a3d0bb',
  // Error colors
  errorDark: '#dc2626'
};

export const TYPOGRAPHY = {
  DMSERIF: 'DMSerifDisplay-Regular',
  QUICKBLOD: 'Quicksand-Bold',
  QUICKREGULAR: 'Quicksand-Medium',
  // QUICKREGULAR:'Quicksand-Regular',
};

export const PADDING = {
  small: 8,
  medium: 16,
  large: 20,
  xlarge: 24,
  extralarge: 30,
};

export const WIDTHACC = {
  WIDTH90: WIDTH * 0.9,
  WIDTH96: WIDTH * 0.96,
  WIDTH96PER: '96%',
  WIDTH45: '45%',
  WIDTHHALF: WIDTH / 2,
};

export const SHADOW = {
  // Light shadow for subtle elevation
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  // Medium shadow for cards
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  // Heavy shadow for modals/overlays
  heavy: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },

  // Card shadow specifically designed for login/profile cards
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },

  // Button shadow for elevated buttons
  button: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
};
