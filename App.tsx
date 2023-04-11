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
import { NavigationContainer, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/main';
import AuthScreen from './screens/auth';
import SearchScreen from './screens/search';
import ShoppingListScreen from './screens/shoppingList';
import { RootStackParamList } from './screens/RootStackParams';
import { ProductListContext, ProductListProvider } from './utils/ProductListContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

const Stack = createStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

type MainTabContainerProps = StackNavigationProp<RootStackParamList, 'MainTabContainer'>;

const MainTabContainer = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'MainTabContainer'>>();
  // const provider = route.params.provider;


  return (
    // <NavigationContainer>
    // <ProductListProvider>

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
    // </ProductListProvider>

    // </NavigationContainer>
  );
};

const App = () => {
  return (
    <ProductListProvider>
      <NavigationContainer >
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="MainTabContainer" component={MainTabContainer} />
          {/* <Stack.Screen name="Search" component={SearchScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </ProductListProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  BLEDeviceTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BLEDeviceTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
  },
  BLEDeviceText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;