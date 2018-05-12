import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import MapScreen from '../screens/MapScreen';
import StopsScreen from '../screens/StopsScreen';
import StopScreen from '../screens/StopScreen';
import TripScreen from '../screens/TripScreen';
import SettingsScreen from '../screens/SettingsScreen';

const MapStack = createStackNavigator({
  Map: MapScreen,
});

MapStack.navigationOptions = {
  tabBarLabel: 'Mapa',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-map${focused ? '' : '-outline'}`
          : 'md-map'
      }
    />
  ),
};

const StopsStack = createStackNavigator({
  Stops: StopsScreen,
  Stop: StopScreen,
});

StopsStack.navigationOptions = {
  tabBarLabel: 'Przystanki',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-train${focused ? '' : '-outline'}` : 'md-train'}
    />
  ),
};

export default createBottomTabNavigator({
  MapStack,
  StopsStack
});
