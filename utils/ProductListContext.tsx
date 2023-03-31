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
    productList: ItemData[];
    addItem?: (item: ItemData) => void;
    removeItem?: (id: string) => void;
    clearItems?: () => void;
}

const defaultState = {
    productList: [],
};

// const [productList, setProductList] = useState<ItemData[]>([]);

// const ProductListContext = createContext({ productList, setProductList });
const ProductListContext = createContext<IProductContext>(defaultState);

interface Props {
    children: React.ReactNode;
}

const ProductListProvider: FC<Props> = ({ children }) => {
    const [productList, setProductList] = useState<ItemData[]>(defaultState.productList);

    const addItem = (item: ItemData) => {
        setProductList(prev => {
            return [...prev, item];
        });
    }

    const removeItem = (id: string) => {
        // setProductList([...productList, item]);
    }

    const clearItems = () => {
        setProductList([])
    }

    return (
        <ProductListContext.Provider value={{ productList: productList, addItem: addItem, removeItem: removeItem, clearItems: clearItems }}>
            {children}
        </ProductListContext.Provider>
    );
};

export { ProductListContext, ProductListProvider };