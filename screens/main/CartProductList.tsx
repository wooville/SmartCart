import { createContext, useContext, FC, useState, useEffect, useRef } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ItemData, ProductData } from '../../utils/ProductListContext';
import { ProductListContext } from '../../utils/ProductListContext';
import { Image } from '@rneui/base';

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product';

type ItemProps = { name: string, price: string, aisle: string, quantity: number, imgurl: string };
export type DisplayData = { refid: string, name: string, price: string, aisle: string, quantity: number, imgurl: string }

export const Item = ({ name, price, aisle, quantity, imgurl }: ItemProps) => (
    <View style={styles.item}>
        <Text style={styles.name}>{name}</Text>
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Image source={{ uri: imgurl }} style={{ width: 80, height: 80 }} />
            <View style={[{ flexDirection: 'column', alignSelf: 'stretch' }]}>

                <Text style={styles.aisle}>{"Aisle " + aisle}</Text>
                <Text style={styles.price}>{price}</Text>
                <Text style={styles.quantity}>{"Quantity: " + quantity}</Text>
            </View>


        </View>
    </View>
);

export const CartProductList = () => {
    const { setAllProductList, cartList, removeList, isScanToRemove, setIsScanToRemove, addToCart, addToRemoveList, removeListFromCart, clearCartList, clearRemoveList } = useContext(ProductListContext);
    const [displayList, setDisplayList] = useState<DisplayData[]>([])

    useEffect(() => {
        // rebuild displayList whenever cartList changes
        let newDisplayList: DisplayData[] = []
        const iterator = cartList.values();

        for (const value of iterator) {
            const displayItem = newDisplayList.find(displayItem => value.refid === displayItem.refid)
            if (displayItem != undefined) {
                displayItem.quantity = displayItem.quantity + 1;
            } else {
                const newItem: DisplayData = { refid: value.refid, name: value.name, price: value.price, aisle: value.aisle, quantity: 1, imgurl: value.imgurl }
                newDisplayList.push(newItem);
            }
        }

        setDisplayList(newDisplayList);
    }, [cartList, removeList])
    // convert the cartList, which indexes each item individually by uid, into a list which groups the items by database ref ID to display them in quantities
    // const groupedList: DisplayData[] = cartList.;
    // setDisplayList(groupedList);

    const sumTotal = cartList.reduce((acc, next) => {
        return acc + parseFloat(next.price)
    }, 0).toFixed(2)

    return (
        <>
            <FlatList
                data={displayList}
                renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} quantity={item.quantity} imgurl={item.imgurl} />}
                keyExtractor={item => item.refid}
            />
            <View
                style={styles.cartTotalButton}>
                <Text style={styles.searchButtonText}>
                    {'Cart Total: ' + sumTotal}
                </Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        backgroundColor: '#008959',
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