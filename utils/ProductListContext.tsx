import { createContext, FC, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export type ItemData = { id: string, name: string, price: string, aisle: string };

interface IProductContext {
    cartList: ItemData[];
    removeList: ItemData[];
    isScanToRemove: boolean;
    setIsScanToRemove?: (bool: boolean) => void;
    addToCart?: (item: ItemData) => void;
    addToRemoveList?: (item: ItemData) => void;
    removeFromCart?: () => void;
    clearCartList?: () => void;
    clearRemoveList?: () => void;
}

const defaultState = {
    cartList: [],
    removeList: [],
    isScanToRemove: false,
};

// const [cartList, setCartList] = useState<ItemData[]>([]);

// const CartListContext = createContext({ cartList, setCartList });
const ProductListContext = createContext<IProductContext>(defaultState);

interface Props {
    children: React.ReactNode;
}

const ProductListProvider: FC<Props> = ({ children }) => {
    const [cartList, setCartList] = useState<ItemData[]>(defaultState.cartList);
    const [removeList, setRemoveList] = useState<ItemData[]>(defaultState.removeList);
    const [isScanToRemove, setIsScanToRemove] = useState<boolean>(false);

    const addToCart = (item: ItemData) => {
        setCartList(prev => {
            return [...prev, item];
        });
    }

    const addToRemoveList = (item: ItemData) => {
        setRemoveList(prev => {
            return [...prev, item];
        });
    }

    // remove all the items common between cartList and removeList from cartList
    const removeFromCart = () => {
        setCartList(cartList.filter(val => !removeList.includes(val)));
        clearRemoveList();
    }

    const clearCartList = () => {
        setCartList([]);
    }

    const clearRemoveList = () => {
        setRemoveList([]);
    }

    const scanToRemove = (bool: boolean) => {
        setIsScanToRemove(bool);
    }

    return (
        <ProductListContext.Provider value={{ cartList: cartList, removeList: removeList, isScanToRemove: isScanToRemove, setIsScanToRemove: scanToRemove, addToCart: addToCart, addToRemoveList: addToRemoveList, removeFromCart: removeFromCart, clearCartList: clearCartList, clearRemoveList: clearRemoveList }}>
            {children}
        </ProductListContext.Provider>
    );
};

export { ProductListContext, ProductListProvider };