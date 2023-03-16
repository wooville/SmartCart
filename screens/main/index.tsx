import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
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
import DeviceModal from '../../DeviceConnectionModal';
import useBLE from '../../useBLE';
import { SwipeListView } from 'react-native-swipe-list-view';
// import ListViewRenderPropGeneric from '../../ListViewRenderPropGeneric';

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/auth';

type mainScreenProp = StackNavigationProp<RootStackParamList, 'Main'>;
type ItemProps = { name: string, price: string, aisle: string };

const Item = ({ name, price, aisle }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.aisle}>{aisle}</Text>
    <Text style={styles.price}>{price}</Text>
  </View>
);

// import SwipeToDelete from '../../swipe_lists/swipe_to_delete';

// const testList = Array(20)
//   .fill("")
//   .map((_, i) => ({ id: `${i}`, title: `item #${i}` }));

// const componentMap = {
//   SwipeToDelete,
// };


function MainScreen() {
  const navigation = useNavigation<mainScreenProp>();
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    allDevices,
    connectedDevice,
    productList,
    cartTotal,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const sumTotal = productList.reduce((acc, next) => {
    return acc + parseFloat(next.price)
  }, 0)

  const scanForDevices = () => {
    requestPermissions((isGranted: boolean) => {
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  // const swipeListRender = () => {
  //   const Component = SwipeToDelete;
  //   return <Component />;
  // };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.BLEDeviceTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text style={styles.BLEDeviceTitleText}>Connected Device Info</Text>
            <Text style={styles.BLEDeviceText}>{connectedDevice.name}</Text>
          </>
        ) : (
          <Text style={styles.BLEDeviceTitleText}>
            Please Connect to a BLE Device
          </Text>
        )}
      </View> */}
      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
      <View style={styles.container}>
        <FlatList
          data={productList}
          renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} />}
          keyExtractor={item => item.id}
        />
        {/* {swipeListRender()} */}
      </View>
      <View
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {'Cart Total: ' + sumTotal}
        </Text>
      </View>
      {/* <Text style={styles.ctaButtonText}>
        {'Cart Total: ' + cartTotal}
      </Text> */}
    </SafeAreaView>

    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //   <Text>Main Screen</Text>
    //   <Button title="Login" onPress={() => navigation.navigate('Auth')} />
    // </View>
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
  cartTotalButton: {
    backgroundColor: '#54589A',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 5,
    borderRadius: 8,
  },
});

export default MainScreen;