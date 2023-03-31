/* eslint-disable no-bitwise */
import { createContext, useContext, useState } from 'react';
import { PermissionsAndroid, Platform, TouchableOpacity, Text, StyleSheet, } from 'react-native';
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
} from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
// import { productContext, ProductListProvider } from './utils/ProductListProvider';
import { ProductListContext } from '../../utils/ProductListContext';
import DeviceModal from '../../DeviceConnectionModal';


import { atob } from 'react-native-quick-base64';

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product';

const bleManager = new BleManager();

type VoidCallback = (result: boolean) => void;

const BLE_DEVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
const BLE_DEVICE_CHARACTERISTIC = '0000FFE1-0000-1000-8000-00805F9B34FB';

interface ProductData {
    id: number
    name: string
    price: number
    aisle: string
    tags: string
    imgurl: string
    createdAt: string
    updatedAt: string
};

export type ItemData = { id: string, name: string, price: string, aisle: string };

export const UseBLE = () => {
    // const productListInterface = useContext(productContext);
    const [isDeviceModalVisible, setIsDeviceModalVisible] = useState<boolean>(false);
    const { productList, addItem, removeItem, clearItems } = useContext(ProductListContext);

    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    // const [productList, setProductList] = useState<ItemData[]>([]);
    // const [newProduct, setNewProduct] = useState<ProductData | null>(null);

    const requestPermissions = async (cb: VoidCallback) => {
        if (Platform.OS === 'android') {
            const apiLevel = await DeviceInfo.getApiLevel();

            if (apiLevel < 31) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'Bluetooth Low Energy requires Location',
                        buttonNeutral: 'Ask Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                cb(granted === PermissionsAndroid.RESULTS.GRANTED);
            } else {
                const result = await requestMultiple([
                    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ]);

                const isGranted =
                    result['android.permission.BLUETOOTH_CONNECT'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.BLUETOOTH_SCAN'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.ACCESS_FINE_LOCATION'] ===
                    PermissionsAndroid.RESULTS.GRANTED;

                cb(isGranted);
            }
        } else {
            cb(true);
        }
    }

    const scanForDevices = () => {
        requestPermissions((isGranted: boolean) => {
            if (isGranted) {
                scanForPeripherals();
            }
        });
    };

    const hideDeviceModal = () => {
        setIsDeviceModalVisible(false);
    };

    const openDeviceModal = async () => {
        scanForDevices();
        setIsDeviceModalVisible(true);
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    // const isDuplicateItem = (items: ItemData[], nextItem: ItemData) =>
    //     items.findIndex(item => nextItem.id === item.id) > -1;

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device && device.name?.includes('DSD')) {
                setAllDevices((prevState: Device[]) => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(deviceConnection);
        } catch (e) {
            console.log('FAILED TO CONNECT', e);
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
            if (clearItems) clearItems();
            else console.log("no clearItemsy");
        }
    };

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(
                BLE_DEVICE_UUID,
                BLE_DEVICE_CHARACTERISTIC,
                (error, characteristic) => onBLEUpdate(error, characteristic),
            );
        } else {
            console.log('No Device Connected');
        }
    };

    const getProduct = (refid: any, uid: any) => {
        fetch(`${API_URL}/${refid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status === 200) {
                        console.log(JSON.stringify(jsonRes.data));

                        let newProduct: ProductData = await JSON.parse(JSON.stringify(jsonRes.data));
                        // console.log(product);

                        // if uid is not already in list and there is a new product / server response
                        // if (!productList.some(e => e.id === uid) && newProduct != null) {
                        let newItem: ItemData = { id: uid, name: newProduct.name, price: newProduct.price.toString(), aisle: newProduct.aisle };
                        // setNewProduct(null);

                        // if (!isDuplicateItem(oldProductList, newItem)) {
                        if (addItem) addItem(newItem);
                        else console.log("no addItem");
                        // console.log("test1 " + productList);
                        // }
                        // console.log("test2 " + productList);


                        // setProductList((prevState: ItemData[]) => {
                        //     if (!isDuplicateItem(prevState, newItem)) {
                        //         return [...prevState, newItem];
                        //     }
                        //     return prevState;
                        // });
                        // }
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    const onBLEUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null,
    ) => {
        if (error) {
            console.log(error);
            return -1;
        } else if (!characteristic?.value) {
            console.log('No Data was received');
            return -1;
        }

        const uid = atob(characteristic.value).substring(0, 12);                  // first half of recvd value
        const refId = parseInt(atob(characteristic.value).substring(14, 16), 16);     // last half of received value (from hex to int)

        console.log(uid + "\n" + refId);

        getProduct(refId, uid);
    };



    return (
        <>
            <TouchableOpacity
                onPress={connectedDevice ? disconnectFromDevice : openDeviceModal}
                style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>
                    {connectedDevice ? 'Disconnect' : 'Connect'}
                </Text>
            </TouchableOpacity>
            <DeviceModal
                closeModal={hideDeviceModal}
                visible={isDeviceModalVisible}
                connectToPeripheral={connectToDevice}
                devices={allDevices}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fff8',
    },
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
});