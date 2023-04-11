import React, { Component } from 'react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackParams';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { ProductListContext, ProductListProvider } from '../../utils/ProductListContext';
import { SearchShop } from './SearchShop';
import { styles } from '../../styles/styles';
function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ProductListProvider>
        <SearchShop />
      </ProductListProvider>

      <FlashMessage position="top" />
    </SafeAreaView>
  );

}

export default SearchScreen;