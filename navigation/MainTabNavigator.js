import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const SignUpStack = createStackNavigator({
  SignUp: SignUpScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ) 
};

SignUpStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};

export default createBottomTabNavigator({
  HomeStack,
  SignUpStack
});
