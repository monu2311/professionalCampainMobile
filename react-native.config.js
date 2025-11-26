module.exports = {
    project: {
      ios: {},
      android: {},
    },
    assets: ['./src/assets/fonts'],
    dependencies: {
    'react-native-reanimated': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-reanimated/android',
        },
      },
    },
  },
};