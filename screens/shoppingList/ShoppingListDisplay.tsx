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

type ItemProps = { name: string, price: string, aisle: string, quantity: number, id: string, imgurl: string };
export type DisplayData = { refid: string, name: string, price: string, aisle: string, quantity: number, imgurl: string }

export const ShoppingListDisplay = () => {
    const { setAllProductList, removeFromShoppingList, shoppingList, removeList, isScanToRemove, setIsScanToRemove, addToCart, addToRemoveList, removeListFromCart, clearShoppingList, clearRemoveList } = useContext(ProductListContext);
    const [displayList, setDisplayList] = useState<DisplayData[]>([])
    const [dataUpdated, setDataUpdated] = useState<boolean>(false)

    const Item = ({ name, price, aisle, quantity, id, imgurl }: ItemProps) => (
        <View style={styles.item}>
            <Text style={styles.name}>{name}</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Image source={{ uri: imgurl }} style={{ width: 80, height: 80 }} />
                <View style={[{ flexDirection: 'column', alignSelf: 'stretch' }]}>
                    <TouchableOpacity style={styles.button} onPress={() => removeFromShoppingList ? removeFromShoppingList(id) : null}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                    <Text style={styles.aisle}>{"Aisle " + aisle}</Text>
                    <Text style={styles.price}>{price}</Text>
                    <Text style={styles.quantity}>{"Quantity: " + quantity}</Text>
                </View>
            </View>
        </View>
    );

    const shoppingListRef = useRef(shoppingList);
    const displayListRef = useRef(displayList);

    useEffect(() => {
        shoppingListRef.current = shoppingList;
        // rebuild displayList whenever shoppingList changes
        const newDisplayList: DisplayData[] = []
        const iterator = shoppingListRef.current.values();
        // console.log("test " + shoppingList);

        for (const value of iterator) {
            const displayItem = newDisplayList.find(displayItem => value.id === displayItem.refid)
            if (displayItem != undefined) {
                displayItem.quantity = displayItem.quantity + 1;
            } else {
                const newItem = { refid: value.id, name: value.name, price: value.price, aisle: value.aisle, quantity: 1, imgurl: value.imgurl }
                newDisplayList.push(newItem);
                console.log("display " + newDisplayList);

            }
        }

        setDisplayList(newDisplayList);
    }, [shoppingList])

    useEffect(() => {
        displayListRef.current = displayList;
    }, [displayList])

    useEffect(() => {
        setDataUpdated(!dataUpdated);
    }, [displayList])
    // convert the shoppingList, which indexes each item individually by uid, into a list which groups the items by database ref ID to display them in quantities
    // const groupedList: DisplayData[] = shoppingList.;
    // setDisplayList(groupedList);

    const sumTotal = shoppingListRef.current.reduce((acc, next) => {
        return acc + parseFloat(next.price)
    }, 0).toFixed(2)

    return (
        <>
            <FlatList
                data={displayListRef.current}
                extraData={dataUpdated}
                renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} quantity={item.quantity} id={item.refid} imgurl={item.imgurl} />}
                keyExtractor={item => item.refid}
            />
            <View
                style={styles.cartTotalButton}>
                <Text style={styles.searchButtonText}>
                    {'List Total: ' + sumTotal}
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
    quantity: {
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
        backgroundColor: 'darkorange',
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
    }
});