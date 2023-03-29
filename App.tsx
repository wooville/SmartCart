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
import DeviceModal from './DeviceConnectionModal';
// import PulseIndicator from './PulseIndicator';
import useBLE from './useBLE';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/main';
import AuthScreen from './screens/auth';
import TestScreen from './screens/test';
import SearchScreen from './screens/search';

import { RootStackParamList } from './screens/RootStackParams';


const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    allDevices,
    connectedDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>

    // <SafeAreaView style={styles.container}>
    //   <View style={styles.BLEDeviceTitleWrapper}>
    //     {connectedDevice ? (
    //       <>
    //         <Text style={styles.BLEDeviceTitleText}>Connected Device Info</Text>
    //         <Text style={styles.BLEDeviceText}>{connectedDevice.name} , {referenceNumber.toString()}</Text>
    //         <Text style={styles.BLEDeviceText}>TEST {referenceStr}</Text>
    //       </>
    //     ) : (
    //       <Text style={styles.BLEDeviceTitleText}>
    //         Please Connect to a BLE Device
    //       </Text>
    //     )}
    //   </View>
    //   <TouchableOpacity
    //     onPress={connectedDevice ? disconnectFromDevice : openModal}
    //     style={styles.ctaButton}>
    //     <Text style={styles.ctaButtonText}>
    //       {connectedDevice ? 'Disconnect' : 'Connect'}
    //     </Text>
    //   </TouchableOpacity>
    //   <DeviceModal
    //     closeModal={hideModal}
    //     visible={isModalVisible}
    //     connectToPeripheral={connectToDevice}
    //     devices={allDevices}
    //   />
    // </SafeAreaView>
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