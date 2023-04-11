import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackParams';
import { TextInput } from 'react-native-gesture-handler';
import { LoginSignup } from './LoginSignup';
import { ProductListProvider } from '../../utils/ProductListContext';

function AuthScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ddf8d7', }}>
      <Image
        style={styles.logo}
        source={require('../../assets/SmartCart_font.png')}

      />

      {/* <ProductListProvider> */}
      <LoginSignup />
      {/* </ProductListProvider> */}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'black',
    height: 45,
    borderRadius: 50,
    marginVertical: 10,

  },
  separator: {
    marginVertical: 5,

  },
  separator2: {
    marginVertical: 3,

  },
  title: {
    marginVertical: 8,
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttontext: {
    marginVertical: 5,
    fontSize: 18,
    color: 'white'
  },
  nextbutton: {
    width: '75%',
    backgroundColor: '#004b75',
    height: 35,
    borderRadius: 20,
    marginVertical: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginVertical: 3,
    fontSize: 18,
    color: 'white'
  },
  logo: {
    width: 100,
    height: 150
  }

});


export default AuthScreen;