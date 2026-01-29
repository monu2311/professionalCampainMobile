/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text} from 'react-native';
import Login from '../screens/LoginFlow/Login';
import ForgetPassword from '../screens/LoginFlow/ForgetPassword';
import CreateAccount from '../screens/LoginFlow/CreateAccount';
import CreateProfile from '../screens/ProfileFlow/CreateProfile';
import GetStarted from '../screens/SplashFlow/GetStarted';
import PleaseSelect from '../screens/SplashFlow/PleaseSelect';
import Main from '../screens/SplashFlow/Main';
import UploadImage from '../screens/ProfileFlow/UploadImage';
import Details from '../screens/ProfileFlow/Details';
import Contact from '../screens/ProfileFlow/Contact';
import Opition from '../screens/ProfileFlow/Opition';
import Final from '../screens/ProfileFlow/Final';
import Submit from '../screens/ProfileFlow/Submit';
import SelectPlan from '../screens/LoginFlow/SelectPlan';
import {CustomTabBar} from './CustomTabBar';
import CustomHeader from './CustomHeader';
import ProfileScreen from '../screens/EditProfileFlow/ProfileScreen';
import Vedio from '../screens/ProfileFlow/Vedio';
import Personal from '../screens/ProfileFlow/Personal';
import UserChatList from '../screens/MessageFlow/UserChatList';
import Chat from '../screens/MessageFlow/Chat';
import ChatRequestList from '../screens/MessageFlow/ChatRequestList';
import ChangePassword from '../screens/Setting/ChangePassword';
import Enquriries from '../screens/Setting/Enquriries';
import AboutUs from '../screens/Setting/AboutUs';
import AdvertisingRate from '../screens/Setting/AdvertisingRate';
import Setting from '../screens/Setting/Setting';
import Subscription from '../screens/SubScriptionFlow/Subscription';
import SplashScreen from '../screens/SplashFlow/SplashScreen';
import Service from '../screens/ServiceFlow/Service';
import PayPalWebView from '../screens/Payment/PayPalWebView';
import MyBookings from '../screens/BookingFlow/MyBookings';
import UserProfileDetail from '../screens/ProfileFlow/UserProfileDetail';
import { useTranslation } from '../localization/hooks';
import { NAMESPACES } from '../localization/localizationIndex';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();




function ChatStack() {
    
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen
        name="UserChatList"
        component={UserChatList}
        options={{headerShown: false}}
      />
     
    </Stack.Navigator>
  );
}


function ServiceStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <Stack.Screen
        name="Service"
        component={Service}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          // header: () => <CustomHeader label="Service" />,
          headerShown:false
        }}
      />
     
    </Stack.Navigator>
  );
}

function TabStack() {
  const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={Main}  options={{headerShown:false}}/>
      <Tab.Screen
        name="Message"
        component={ChatStack}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Subscription" component={Subscription}  options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          header: () => (
            <CustomHeader
              label={t('common:navigation.Subscription')}
              // eslint-disable-next-line react-native/no-inline-styles
              backStyle={{
                width: 20,
                height: 20,
              }}
            />
          ),
        }}/>
      <Tab.Screen name="MyBookings" component={MyBookings} options={{headerShown: false}} />
      <Tab.Screen name="Service" component={ServiceStack} options={{headerShown: false}} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          header: () => <CustomHeader label={t('common:navigation.Profile')} rightIcon={true} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
    const { t } = useTranslation([NAMESPACES.SCREENS, NAMESPACES.FORMS, NAMESPACES.COMMON]);
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}
     initialRouteName='Details'
     >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Chat" component={Chat} options={{headerShown:true}}/>
      <Stack.Screen
        name="ChatRequests"
        component={ChatRequestList}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.ChatRequests')} />,
        }}
      />
      <Stack.Screen name="PleaseSelect" component={PleaseSelect} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="singup" component={CreateAccount} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="SelectPlan" component={SelectPlan} />
      <Stack.Screen
        name="Profile1"
        component={ProfileScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="CreateProfile1"
        component={UploadImage}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.UploadImage')} step={2} />,
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Details')} step={3} />,
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Contact')} step={4} />,
        }}
      />
      <Stack.Screen
        name="Opition"
        component={Opition}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Option')} step={5} />,
        }}
      />
      <Stack.Screen name="Final" component={Final} />
      <Stack.Screen name="Submit" component={Submit} />
      <Stack.Screen name="Home" component={TabStack} />
      <Stack.Screen
        name="PayPalWebView"
        component={PayPalWebView}
        options={{headerShown: true, title: t('common:navigation.PayPalWebView')}}
      />

      <Stack.Screen
        name="PersonalDetails"
        component={Personal}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.PersonalDetails')} />,
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={UploadImage}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Gallery')} />,
        }}
      />
      <Stack.Screen
        name="Video"
        component={Vedio}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Video')} />,
        }}
      />
      <Stack.Screen
        name="EditDetails"
        component={Details}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Details')} />,
        }}
      />
      <Stack.Screen
        name="EditContact"
        component={Contact}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Contact')} />,
        }}
      />
      <Stack.Screen
        name="Optional"
        component={Opition}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Optional')} />,
        }}
      />
        <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.ChangePassword')} />,
        }}
      />
       <Stack.Screen
        name="Enquriries"
        component={Enquriries}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.AllOtherEnquiries')} />,
        }}
      />
       <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.AboutUs')} />,
        }}
      />
       <Stack.Screen
        name="AdvertisingRate"
        component={AdvertisingRate}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.AdvertisingRate')} />,
        }}
      />

<Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: true,
          header: () => <CustomHeader label={t('common:navigation.Setting')} />,
        }}
      />
      <Stack.Screen
        name="UserProfileDetail"
        component={UserProfileDetail}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
}

export default function MainStack() {
  // Deep linking configuration
  const linking = {
    prefixes: [
      'professionalcompanionship://',
      'https://professionalcompanionship.com',
      'app://',
    ],
    config: {
      screens: {
        AuthStack: {
          screens: {
            // Profile deep link
            UserProfileDetail: {
              path: 'profile/:userId',
              parse: {
                userId: (userId) => userId,
              },
            },
            // Chat deep link
            Chat: {
              path: 'chat/:userId',
              parse: {
                userId: (userId) => userId,
              },
            },
            // Tab navigation screens
            Home: {
              screens: {
                Home: 'main',
                Message: 'messages',
                Subscription: 'subscription',
                MyBookings: 'bookings',
                Service: 'services',
                Profile: 'my-profile',
              },
            },
            // Auth screens
            Login: 'login',
            ForgetPassword: 'forgot-password',
            singup: 'signup',
            Setting: 'settings',
          },
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        {/* <Stack.Screen name="HomeTabs" component={HomeTabs} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
