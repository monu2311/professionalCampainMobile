import { Pressable, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IOS, COLORS } from '../constants/theme';

const TAB_ICONS = {
  Home: 'home',
  Message: 'message',
  Subscription: 'workspace-premium',
  Service: 'business-center',
  Profile: 'person'
};

export const CustomTabBar = ({ state, navigation }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        height: IOS ? 90 : 60,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 0,
        paddingTop: 16,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            elevation: 8,
          },
        }),
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = TAB_ICONS[route.name] || 'help';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={index} style={{ flex: 1, alignItems: 'center' }} onPress={onPress}>
            <Icon
              name={iconName}
              size={24}
              color={isFocused ? COLORS.mainColor : 'rgba(47, 48, 145, 0.5)'}
            />
          </Pressable>
        );
      })}
    </View>
  );
};