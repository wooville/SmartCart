import { useContext } from 'react';
import { ProductListContext } from './ProductListContext';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type ItemProps = { name: string, price: string, aisle: string };

const Item = ({ name, price, aisle }: ItemProps) => (
    <View style={styles.item}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.aisle}>{aisle}</Text>
        <Text style={styles.price}>{price}</Text>
    </View>
);

export default function ProductList() {
    const productList = useContext(ProductListContext);

    const setProductList = () => {

    }

    return (
        <section className="section">
            <ProductListContext.Provider value={productList, setProductList}>
                <FlatList
                    data={productList}
                    renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} />}
                    keyExtractor={item => item.id}
                />
            </ProductListContext.Provider>
        </section>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fff8',
    },
    // switchContainer: {
    //   flexDirection: 'row',
    //   justifyContent: 'center',
    //   marginVertical: 50,
    //   flexWrap: 'wrap',
    // },
    // switch: {
    //   alignItems: 'center',
    //   borderWidth: 1,
    //   borderColor: 'black',
    //   marginVertical: 2,
    //   paddingVertical: 10,
    //   width: Dimensions.get('window').width / 3,
    // },
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
    rowBack: {
        backgroundColor: '#eb4034',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
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
    BLEDeviceTitleWrapper: {
        flex: 1,
        // justifyContent: 'center',
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
    removeProductButton: {
        backgroundColor: '#54589A',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginHorizontal: 20,
        marginBottom: 5,
        borderRadius: 8,
    },
    cartTotalButton: {
        backgroundColor: '#54589A',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginBottom: 5,
        borderRadius: 8,
    },
});