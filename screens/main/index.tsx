import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackParams';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modal } from 'react-native';
import { UseBLE } from './UseBLE';
import { SwipeListView } from 'react-native-swipe-list-view';
// import ListViewRenderPropGeneric from '../../ListViewRenderPropGeneric';
import { ProductListContext, ProductListProvider } from '../../utils/ProductListContext';
import { CartProductList } from './CartProductList';
import { RemoveProduct } from './RemoveProduct';

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product/';

// type mainScreenProp = StackNavigationProp<RootStackParamList, 'Main'>;
type ItemProps = { name: string, price: string, aisle: string };

function MainScreen() {
  // const navigation = useNavigation<mainScreenProp>();


  return (
    <SafeAreaView style={styles.container}>
      {/* <ProductListProvider> */}
      <UseBLE />
      <View style={styles.container}>
        <RemoveProduct />

        <CartProductList />
      </View>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {'Search'}
        </Text>
      </TouchableOpacity> */}
      {/* </ProductListProvider> */}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fff8',
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
    backgroundColor: '#00CC66',
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
  },
  price: {
    fontSize: 18,
    flexDirection: 'column',
    textAlign: 'right',
    fontWeight: '700',
  },
  aisle: {
    fontSize: 18,
    flexDirection: 'column',
    textAlign: 'right',
  },
  BLEDeviceTitleWrapper: {
    flex: 1,
    // justifyContent: 'center',
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
  searchButton: {
    backgroundColor: '#54589A',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  ctaButton: {
    backgroundColor: '#54589A',
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
  removeProductButton: {
    backgroundColor: '#54589A',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  cartTotalButton: {
    backgroundColor: '#004b75',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 5,
    borderRadius: 8,
  },
});

export default MainScreen;