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

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product';

type ItemProps = { name: string, price: string, aisle: string, quantity: number };
export type DisplayData = { refid: string, name: string, price: string, aisle: string, quantity: number }

export const Item = ({ name, price, aisle, quantity }: ItemProps) => (
    <View style={styles.item}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.aisle}>{aisle}</Text>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.quantity}>{quantity}</Text>
    </View>
);

export const ShoppingListDisplay = () => {
    const { setAllProductList, shoppingList, removeList, isScanToRemove, setIsScanToRemove, clearShoppingList, clearRemoveList } = useContext(ProductListContext);
    const [displayList, setDisplayList] = useState<DisplayData[]>([])

    useEffect(() => {
        // rebuild displayList whenever shoppingList changes
        let newDisplayList: DisplayData[] = []
        const iterator = shoppingList.values();

        console.log("Giga List " + shoppingList);

        for (const value of iterator) {
            const displayItem = newDisplayList.find(displayItem => value.id === displayItem.refid)
            if (displayItem != undefined) {
                displayItem.quantity = displayItem.quantity + 1;
            } else {
                const newItem = { refid: value.id, name: value.name, price: value.price, aisle: value.aisle, quantity: 1 }
                newDisplayList.push(newItem);
            }
        }

        setDisplayList(newDisplayList);
    }, [shoppingList, removeList])
    // convert the shoppingList, which indexes each item individually by uid, into a list which groups the items by database ref ID to display them in quantities
    // const groupedList: DisplayData[] = shoppingList.;
    // setDisplayList(groupedList);

    const sumTotal = shoppingList.reduce((acc, next) => {
        return acc + parseFloat(next.price)
    }, 0).toFixed(2)

    return (
        <>
            <FlatList
                data={displayList}
                renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} quantity={item.quantity} />}
                keyExtractor={item => item.refid}
            />
            <View
                style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>
                    {'Cart Total: ' + sumTotal}
                </Text>
            </View>
        </>
    );
};

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
    quantity: {
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