import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const SignUpStack = createStackNavigator({
  SignUp: SignUpScreen,
});

const LogInStack = createStackNavigator({
  LogIn: LogInScreen,
});


HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false } 
};

SignUpStack.navigationOptions = {
  tabBarLabel: 'Sign Up',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};

LogInStack.navigationOptions = {
  tabBarLabel: 'Log In',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};

export default createBottomTabNavigator({
  HomeStack,
  SignUpStack,
  LogInStack
});
