/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
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
import HelpSupport from '../screens/Setting/HelpSupport';
import AdvertisingRate from '../screens/Setting/AdvertisingRate';
import Setting from '../screens/Setting/Setting';
import Subscription from '../screens/SubScriptionFlow/Subscription';
import SplashScreen from '../screens/SplashFlow/SplashScreen';
import Service from '../screens/ServiceFlow/Service';
import PayPalWebView from '../screens/Payment/PayPalWebView';
import StripePaymentScreen from '../screens/Payment/StripePaymentScreen';
import MyBookings from '../screens/BookingFlow/MyBookings';
import UserProfileDetail from '../screens/ProfileFlow/UserProfileDetail';
import FeaturedListPage from '../screens/SplashFlow/FeaturedListPage';
import SelectMethod from '../screens/LoginFlow/SelectMethod';
import { MembershipProvider } from '../contexts/MembershipContext';
import UserChatListEnhanced from '../screens/MessageFlow/UserChatListEnhanced';
import MembershipPlansScreen from '../screens/SubScriptionFlow/MembershipPlansScreen';
import TermsAndConditions from '../screens/Setting/TermsAndConditions';
import { DdRumReactNavigationTracking } from "@datadog/mobile-react-navigation";
import { setNavigationRef } from '../apiConfig/apicall';
import SessionExpiredModal from '../components/SessionExpiredModal';
import sessionManager from '../utils/sessionManager';
import membershipService from '../services/MembershipService';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();




function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      {/* <Stack.ScreenUserChatListEnhanced
        name="UserChatList"
        component={UserChatList}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="UserChatList"
        component={UserChatListEnhanced}
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
              label="Packages"
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
          header: () => <CustomHeader label="Profile" rightIcon={true} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}
     initialRouteName='SplashScreen'
     >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="SelectMethod" component={SelectMethod} />
      <Stack.Screen name="Chat" component={Chat} options={{headerShown:true}}/>
      <Stack.Screen
        name="ChatRequests"
        component={ChatRequestList}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Chat Requests" />,
        }}
      />
      <Stack.Screen name="PleaseSelect" component={PleaseSelect} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="singup" component={CreateAccount} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="SelectPlan" component={SelectPlan} />
      <Stack.Screen name="MembershipPlansScreen" component={MembershipPlansScreen} />
      
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
          header: () => <CustomHeader label="Upload Image" step={2} />,
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Details" step={3} />,
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Contact" step={4} />,
        }}
      />
      <Stack.Screen
        name="Opition"
        component={Opition}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Opition" step={5} />,
        }}
      />
      <Stack.Screen name="Final" component={Final} />
      <Stack.Screen name="Submit" component={Submit} />
      <Stack.Screen name="Home" component={TabStack} />
      <Stack.Screen
        name="PayPalWebView"
        component={PayPalWebView}
        options={{headerShown: true, title: 'Pay with PayPal'}}
      />
      <Stack.Screen
        name="StripePaymentScreen"
        component={StripePaymentScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="PersonalDetails"
        component={Personal}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Personal Details" />,
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={UploadImage}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Gallery" />,
        }}
      />
      <Stack.Screen
        name="Video"
        component={Vedio}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Video" />,
        }}
      />
      <Stack.Screen
        name="EditDetails"
        component={Details}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Details" />,
        }}
      />
      <Stack.Screen
        name="EditContact"
        component={Contact}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Contact" />,
        }}
      />
      <Stack.Screen
        name="Optional"
        component={Opition}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Optional" />,
        }}
      />
        <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Change Password" />,
        }}
      />
       <Stack.Screen
        name="Enquriries"
        component={Enquriries}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="All other enquiries" />,
        }}
      />
       <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="About Us" />,
        }}
      />
       <Stack.Screen
        name="HelpSupport"
        component={HelpSupport}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Help & Support" />,
        }}
      />
       <Stack.Screen
        name="AdvertisingRate"
        component={AdvertisingRate}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Advertising Rate" />,
        }}
      />

<Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerShown: true,
          header: () => <CustomHeader label="Setting" />,
        }}
      />
      <Stack.Screen
        name="UserProfileDetail"
        component={UserProfileDetail}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FeaturedListPage"
        component={FeaturedListPage}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
}

// Navigation wrapper component with membership provider
const NavigationWithMembership = () => {
  return (
    <MembershipProvider>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        {/* <Stack.Screen name="HomeTabs" component={HomeTabs} /> */}
      </Stack.Navigator>
    </MembershipProvider>
  );
};

// Wrapper component that includes session modal with navigation context
const NavigationWithSessionModal = ({ navigationRef }) => {
  const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false);

  useEffect(() => {
    // Subscribe to session manager state changes
    const unsubscribe = sessionManager.subscribe((state) => {
      setSessionExpiredVisible(state.isModalVisible);
    });

    return () => unsubscribe();
  }, []);

  // Track navigation state changes
  useEffect(() => {
    if (navigationRef?.current) {
      const getCurrentRoute = () => {
        const state = navigationRef.current?.getRootState();
        if (!state) return '';

        let route = state.routes[state.index];
        while (route.state && route.state.index !== undefined) {
          route = route.state.routes[route.state.index];
        }
        return route.name;
      };

      // Get initial route
      const routeName = getCurrentRoute();
      membershipService.setCurrentRoute(routeName);
    }
  }, [navigationRef]);

  return (
    <>
      <NavigationWithMembership />
      {/* Session Expired Modal - Now inside NavigationContainer with navigation context! */}
      <SessionExpiredModal visible={sessionExpiredVisible} />
    </>
  );
};

export default function MainStack() {
  const navigationRef = React.useRef(null);

  // Deep linking configuration
  const linking = {
    prefixes: [
      'professionalcompanionship://',
      'https://thecompaniondirectory.com',
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
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
        onReady={() => {
          DdRumReactNavigationTracking.startTrackingViews(navigationRef.current);
          // Set navigation reference for API error handling
          setNavigationRef(navigationRef.current);
        }}
      onStateChange={() => {
        // Track route changes
        if (navigationRef.current) {
          const state = navigationRef.current.getRootState();
          if (state) {
            let route = state.routes[state.index];
            while (route.state && route.state.index !== undefined) {
              route = route.state.routes[route.state.index];
            }
            membershipService.setCurrentRoute(route.name);
          }
        }
      }}
>
      <NavigationWithSessionModal navigationRef={navigationRef} />
    </NavigationContainer>
  );
}
