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
                const newItem = { refid: value.refid, name: value.name, price: value.price, aisle: value.aisle, quantity: 1, imgurl: value.imgurl }
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
                <Text style={styles.modalTitleText}>{"Please scan the items you wish to remove:"}</Text>

                <FlatList
                    data={displayList}
                    renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} quantity={item.quantity} imgurl={item.imgurl} />}
                    keyExtractor={item => item.refid}
                />

                <TouchableOpacity
                    onPress={confirmProductRemoveModal}
                    style={styles.searchButton}
                >
                    <Text style={styles.searchButtonText}>
                        {'Confirm Removal'}
                    </Text>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity
                onPress={openProductRemoveModal}
                style={styles.searchButton}
            >
                <Text style={styles.searchButtonText}>
                    {'Remove Items'}
                </Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    modalTitleText: {
        marginTop: 40,
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: 'center',
        color: 'black'
    },
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
    searchButton: {
        backgroundColor: 'darkorange',
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
    },
    quantity: {
        fontSize: 18,
        flexDirection: 'column',
        textAlign: 'right',
    },
});