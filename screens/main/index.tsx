import {useNavigation} from '@react-navigation/native';
import React, { useState } from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackParams';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceModal from '../../DeviceConnectionModal';
// import PulseIndicator from './PulseIndicator';
import useBLE from '../../useBLE';
// import ListViewRenderPropGeneric from '../../ListViewRenderPropGeneric';

type mainScreenProp = StackNavigationProp<RootStackParamList, 'Main'>;

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

type ItemProps = {title: string};

const Item = ({title}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

function MainScreen() {
  const navigation = useNavigation<mainScreenProp>();
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    allDevices,
    connectedDevice,
    referenceNumber,
    referenceStr,
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
    <SafeAreaView style={styles.container}>
      <View style={styles.BLEDeviceTitleWrapper}>
        {connectedDevice ? (
          <>
            <Text style={styles.BLEDeviceTitleText}>Connected Device Info</Text>
            <Text style={styles.BLEDeviceText}>{connectedDevice.name} , {referenceNumber.toString()}</Text>
            <Text style={styles.BLEDeviceText}>TEST {referenceStr}</Text>
          </>
        ) : (
          <Text style={styles.BLEDeviceTitleText}>
            Please Connect to a BLE Device
          </Text>
        )}
      </View>
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
        data={DATA}
        renderItem={({item}) => <Item title={item.title} />}
        keyExtractor={item => item.id}
      />
    </View>
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
    backgroundColor: '#f2f2f2',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
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

export default MainScreen;