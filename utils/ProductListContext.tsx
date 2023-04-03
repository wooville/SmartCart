import { createContext, FC, useState, useRef, useEffect } from 'react';

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
    const [isScanToRemove, setIsScanToRemove] = useState<boolean>(defaultState.isScanToRemove);

    const cartListRef = useRef(cartList)
    const removeListRef = useRef(removeList)

    useEffect(() => {
        cartListRef.current = cartList;
        removeListRef.current = removeList;
    }, [cartList, removeList])

    const isDuplicateItem = (items: ItemData[], nextItem: ItemData) =>
        items.findIndex(item => nextItem.id === item.id) > -1;


    const addToCart = (item: ItemData) => {
        if (!isDuplicateItem(cartListRef.current, item)) {
            setCartList(prev => {
                return [...prev, item];
            });
        }
    }

    const addToRemoveList = (item: ItemData) => {
        if (!isDuplicateItem(removeListRef.current, item) && isDuplicateItem(cartListRef.current, item)) {
            setRemoveList(prev => {
                return [...prev, item];
            });
        }
    }

    // remove all the items common between cartList and removeList from cartList
    const removeFromCart = () => {
        // setCartList(cartList.filter(val => !removeList.includes(val)));

        let newCartList = cartList

        for (var i = 0, len = removeList.length; i < len; i++) {
            var ItemIndex = newCartList.findIndex(item => item.id === removeList[i].id);

            newCartList.splice(ItemIndex, 1)
        }

        setCartList(newCartList);
        clearRemoveList();
    }

    const clearCartList = () => {
        setCartList([]);
    }

    const clearRemoveList = () => {
        setRemoveList([]);
    }

    return (
        <ProductListContext.Provider value={{ cartList: cartList, removeList: removeList, isScanToRemove: isScanToRemove, setIsScanToRemove: setIsScanToRemove, addToCart: addToCart, addToRemoveList: addToRemoveList, removeFromCart: removeFromCart, clearCartList: clearCartList, clearRemoveList: clearRemoveList }}>
            {children}
        </ProductListContext.Provider>
    );
};

export { ProductListContext, ProductListProvider };