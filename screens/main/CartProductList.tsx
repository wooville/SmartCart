import { createContext, useContext, FC, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ProductListContext } from '../../utils/ProductListContext';

type ItemProps = { name: string, price: string, aisle: string };

const Item = ({ name, price, aisle }: ItemProps) => (
    <View style={styles.item}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.aisle}>{aisle}</Text>
        <Text style={styles.price}>{price}</Text>
    </View>
);

export const CartProductList = () => {
    const { productList, addItem, removeItem, clearItems } = useContext(ProductListContext);

    const sumTotal = productList.reduce((acc, next) => {
        return acc + parseFloat(next.price)
    }, 0).toFixed(2)

    return (
        <>
            <FlatList
                data={productList}
                renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} />}
                keyExtractor={item => item.id}
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