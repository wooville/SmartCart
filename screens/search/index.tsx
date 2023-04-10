import React, {Component} from 'react';
import { createContext, useContext, useState, useRef, useEffect } from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackParams';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FlashMessage from "react-native-flash-message";
import {showMessage, hideMessage} from "react-native-flash-message";
import { ProductListContext, ProductListProvider } from '../../utils/ProductListContext';
import { SearchShop } from './SearchShop';

type ItemProps = { id: string, name: string, price: string, aisle: string };

type SearchScreenProp = StackNavigationProp<RootStackParamList, 'Search'>;

function SearchScreen() {  
  const navigation = useNavigation<SearchScreenProp>();

  return (
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //   <Text>Search Screen</Text>
    //   <Button title="Login" onPress={() => navigation.navigate('Main')} />
    // </View>
    <SafeAreaView style={styles.container}>
      <ProductListProvider>
        <SearchShop/>
      </ProductListProvider>  
    
    <FlashMessage position="top" />
    </SafeAreaView>
  );

  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    // switchContainer: {
    //   flexDirection: 'row',
    //   justifyContent: 'center',
    //   marginVertical: 50,
    //   flexWrap: 'wrap',
    // },
    // switch: {
    //   alignItems: 'center',
    //   borderWidth: 1,
    //   borderColor: 'black',
    //   marginVertical: 2,
    //   paddingVertical: 10,
    //   width: Dimensions.get('window').width / 3,
    // },
    item: {
      // position: 'absolute',
      // bottom: 0,
      flexDirection: 'column',
      // justifyContent: 'space-between',
      backgroundColor: '#F1FCF6',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      // height: 150,
      // width: "90%",
    },
    rowBack: {
      backgroundColor: '#eb4034',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    name: {
      fontSize: 20,
      color: 'black',
    },
    price: {
      fontSize: 18,
      textAlign: 'right',
      fontWeight: '700',
      color: 'black',
    },
    aisle: {
      fontSize: 18,
      textAlign: 'right',
      color: 'black',
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
      backgroundColor: '#008959',
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
    cartTotalButton: {
      backgroundColor: '#008959',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      marginBottom: 5,
      borderRadius: 8,
    },
    input: {
      color: 'black',
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    button: {
      backgroundColor: '#008959',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: 30,
      width: 90,
      marginHorizontal: '1%',
      marginBottom: 6,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
    }
  });
export default SearchScreen;