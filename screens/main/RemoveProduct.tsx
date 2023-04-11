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
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Item } from './CartProductList';
import { ProductListContext } from '../../utils/ProductListContext';

import { DisplayData } from './CartProductList';
import { ItemData } from '../../utils/ProductListContext';
import { styles } from '../../styles/styles';
export const RemoveProduct = () => {
    const { cartList, removeList, isScanToRemove, setIsScanToRemove, addToCart, addToRemoveList, removeListFromCart, clearCartList, clearRemoveList } = useContext(ProductListContext);
    const [isProductRemoveModalVisible, setIsProductRemoveModalVisible] = useState<boolean>(false);
    const [displayList, setDisplayList] = useState<DisplayData[]>([]);

    useEffect(() => {
        // rebuild displayList whenever cartList changes
        let newDisplayList: DisplayData[] = []
        const iterator = removeList.values();

        for (const value of iterator) {
            const displayItem = newDisplayList.find(displayItem => value.refid === displayItem.refid)
            if (displayItem != undefined) {
                displayItem.quantity = displayItem.quantity + 1;
            } else {
                const newItem = { refid: value.refid, name: value.name, price: value.price, aisle: value.aisle, quantity: 1 }
                newDisplayList.push(newItem);
            }
        }

        setDisplayList(newDisplayList);
    }, [removeList])

    const openProductRemoveModal = () => {
        if (setIsScanToRemove) setIsScanToRemove(true);
        else console.log("no setIsScanToRemove");

        // console.log("test " + isScanToRemoveRef.current);
        setIsProductRemoveModalVisible(true);
    };

    const closeProductRemoveModal = () => {
        if (setIsScanToRemove) setIsScanToRemove(false);
        else console.log("no setIsScanToRemove");

        if (clearRemoveList) clearRemoveList();
        else console.log("no clearRemoveList");

        setIsProductRemoveModalVisible(false);
    };

    const confirmProductRemoveModal = () => {
        if (removeListFromCart) removeListFromCart();
        else console.log("no removeListFromCart");

        if (setIsScanToRemove) setIsScanToRemove(false);
        else console.log("no setIsScanToRemove");

        if (clearRemoveList) clearRemoveList();
        else console.log("no clearRemoveList");

        setIsProductRemoveModalVisible(false);
    };

    return (
        <>
            <Modal animationType={"slide"}
                // transparent={true}
                visible={isProductRemoveModalVisible}
                onRequestClose={closeProductRemoveModal}>
                <View style={styles.BLEDeviceTitleWrapper}>
                    <Text style={styles.BLEDeviceTitleText}>{"Please scan the items you wish to remove:"}</Text>
                </View>

                <FlatList
                    data={displayList}
                    renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} quantity={item.quantity} />}
                    keyExtractor={item => item.refid}
                />

                <TouchableOpacity
                    onPress={confirmProductRemoveModal}
                    style={styles.ctaButton}
                >
                    <Text style={styles.ctaButtonText}>
                        {'Confirm Removal'}
                    </Text>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity
                onPress={openProductRemoveModal}
                style={styles.removeProductButton}
            >
                <Text style={styles.ctaButtonText}>
                    {'Remove Items'}
                </Text>
            </TouchableOpacity>
        </>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8fff8',
//     },
//     // switchContainer: {
//     //   flexDirection: 'row',
//     //   justifyContent: 'center',
//     //   marginVertical: 50,
//     //   flexWrap: 'wrap',
//     // },
//     // switch: {
//     //   alignItems: 'center',
//     //   borderWidth: 1,
//     //   borderColor: 'black',
//     //   marginVertical: 2,
//     //   paddingVertical: 10,
//     //   width: Dimensions.get('window').width / 3,
//     // },
//     item: {
//         // position: 'absolute',
//         // bottom: 0,
//         flexDirection: 'column',
//         // justifyContent: 'space-between',
//         backgroundColor: '#00CC66',
//         padding: 20,
//         marginVertical: 8,
//         marginHorizontal: 16,
//         // height: 150,
//         // width: "90%",
//     },
//     rowBack: {
//         backgroundColor: '#eb4034',
//         padding: 20,
//         marginVertical: 8,
//         marginHorizontal: 16,
//     },
//     name: {
//         fontSize: 20,
//     },
//     price: {
//         fontSize: 18,
//         flexDirection: 'column',
//         textAlign: 'right',
//         fontWeight: '700',
//     },
//     aisle: {
//         fontSize: 18,
//         flexDirection: 'column',
//         textAlign: 'right',
//     },
//     BLEDeviceTitleWrapper: {
//         flex: 1,
//         // justifyContent: 'center',
//         alignItems: 'center',
//     },
//     BLEDeviceTitleText: {
//         fontSize: 30,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginHorizontal: 20,
//         color: 'black',
//     },
//     BLEDeviceText: {
//         fontSize: 25,
//         marginTop: 15,
//     },
//     ctaButton: {
//         backgroundColor: '#008959',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 50,
//         marginHorizontal: 20,
//         marginBottom: 5,
//         borderRadius: 8,
//     },
//     ctaButtonText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'white',
//     },
//     removeProductButton: {
//         backgroundColor: '#008959',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 50,
//         marginHorizontal: 20,
//         marginBottom: 5,
//         borderRadius: 8,
//     },
//     cartTotalButton: {
//         backgroundColor: '#54589A',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 50,
//         marginBottom: 5,
//         borderRadius: 8,
//     },
// });