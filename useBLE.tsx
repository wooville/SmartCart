/* eslint-disable no-bitwise */
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
    BleError,
    BleManager,
    Characteristic,
    Device,
} from 'react-native-ble-plx';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

import { atob } from 'react-native-quick-base64';

const bleManager = new BleManager();

type VoidCallback = (result: boolean) => void;

const BLE_DEVICE_UUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
const BLE_DEVICE_CHARACTERISTIC = '0000FFE1-0000-1000-8000-00805F9B34FB';

type ItemData = { id: string, title: string };

interface BluetoothLowEnergyApi {
    requestPermissions(callback: VoidCallback): Promise<void>;
    connectToDevice: (deviceId: Device) => Promise<void>;
    disconnectFromDevice: () => void;
    connectedDevice: Device | null;
    scanForPeripherals(): void;
    allDevices: Device[];
    referenceNumber: Number;
    referenceStr: String;
    referenceList: ItemData[];
}

function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [referenceNumber, setReferenceNumber] = useState<number>(0);
    const [referenceStr, setReferenceStr] = useState<String>("");
    const [referenceList, setReferenceList] = useState<ItemData[]>([]);

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

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const isDuplicateReference = (references: ItemData[], nextReference: ItemData) =>
        references.findIndex(reference => nextReference.id === reference.id) > -1;

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
            setReferenceNumber(0);
            setReferenceStr("");
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

        const rawData = atob(characteristic.value);
        let referenceNumber: number = -1;

        let newItem: ItemData = { id: rawData, title: rawData };

        setReferenceList((prevState: ItemData[]) => {
            if (!isDuplicateReference(prevState, newItem)) {
                return [...prevState, newItem];
            }
            return prevState;
        });


        // if (firstBitValue === 0) {
        //     referenceNumber = rawData[1].charCodeAt(0);
        // } else {
        //     referenceNumber =
        //         Number(rawData[1].charCodeAt(0) << 8) +
        //         Number(rawData[2].charCodeAt(2));
        // }

        setReferenceNumber(referenceNumber);
        setReferenceStr(rawData);
    };

    const onReferenceNumberUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null,
    ) => {
        if (error) {
            console.log(error);
            return -1;
        } else if (!characteristic?.value) {
            console.log('No Data was recieved');
            return -1;
        }

        const rawData = atob(characteristic.value);
        let innerreferenceNumber: number = -1;

        const firstBitValue: number = Number(rawData) & 0x01;

        if (firstBitValue === 0) {
            innerreferenceNumber = rawData[1].charCodeAt(0);
        } else {
            innerreferenceNumber =
                Number(rawData[1].charCodeAt(0) << 8) +
                Number(rawData[2].charCodeAt(2));
        }

        setReferenceNumber(innerreferenceNumber);
    };

    return {
        requestPermissions,
        scanForPeripherals,
        connectToDevice,
        disconnectFromDevice,
        allDevices,
        connectedDevice,
        referenceNumber,
        referenceStr,
        referenceList
    };
}

export default useBLE;