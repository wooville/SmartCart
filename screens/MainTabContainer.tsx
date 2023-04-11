import 'react-native-gesture-handler';
import 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { RootStackParamList } from './RootStackParams';
import { ProductListContext, ProductListProvider } from '../utils/ProductListContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-ionicons';

import MainScreen from './main';
import SearchScreen from './search';
import ShoppingListScreen from './shoppingList';

const Tab = createBottomTabNavigator();

const MainTabContainer = () => {
    return (
        // <NavigationContainer>
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Cart') {
                    iconName = focused ? 'cart' : 'cart-outline';
                } else if (route.name === 'Shopping List') {
                    iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Search') {
                    iconName = focused ? 'search' : 'search-outline';
                } else {
                    iconName = 'musical-note'
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
        })}>
            <Tab.Screen name="Cart" component={MainScreen} />
            <Tab.Screen name="Shopping List" component={ShoppingListScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>
        // </NavigationContainer>
    );
};

export default MainTabContainer;