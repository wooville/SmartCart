import { createContext, FC, useState, useRef, useEffect } from 'react';

export type ItemData = { uid: string, refid: string, name: string, price: string, aisle: string };

interface IProductContext {
    cartList: ItemData[];
    removeList: ItemData[];
    shoppingList: ItemData[];
    isScanToRemove: boolean;
    userToken: string;
    addToCart?: (item: ItemData) => void;
    addToRemoveList?: (item: ItemData) => void;
    addToShoppingList?: (item: ItemData) => void;
    removeListFromCart?: () => void;
    removeItemFromShoppingList?: (item: ItemData) => void;
    setIsScanToRemove?: (bool: boolean) => void;
    setUserToken?: (token: string) => void;
    clearCartList?: () => void;
    clearRemoveList?: () => void;
    clearShoppingList?: () => void;
}

const defaultState = {
    cartList: [],
    removeList: [],
    shoppingList: [],
    isScanToRemove: false,
    userToken: "",
};

// const [cartList, setCartList] = useState<ItemData[]>([]);

// const CartListContext = createContext({ cartList, setCartList });
const ProductListContext = createContext<IProductContext>(defaultState);

interface Props {
    children: React.ReactNode;
}

const ProductListProvider: FC<Props> = ({ children }) => {
    const [shoppingList, setShoppingList] = useState<ItemData[]>(defaultState.shoppingList);
    const [cartList, setCartList] = useState<ItemData[]>(defaultState.cartList);
    const [removeList, setRemoveList] = useState<ItemData[]>(defaultState.removeList);
    const [isScanToRemove, setIsScanToRemove] = useState<boolean>(defaultState.isScanToRemove);
    const [userToken, setUserToken] = useState<string>(defaultState.userToken);

    // use refs and useEffect to circumvent stale closure (ie always ensure up to date states)
    const cartListRef = useRef(cartList)
    const removeListRef = useRef(removeList)
    const shoppingListRef = useRef(removeList)

    useEffect(() => {
        cartListRef.current = cartList;
        removeListRef.current = removeList;
        shoppingListRef.current = shoppingList;
    }, [cartList, removeList, shoppingList])

    const isDuplicateItem = (items: ItemData[], nextItem: ItemData) =>
        items.findIndex(item => nextItem.uid === item.uid) > -1;

    const addToCart = (item: ItemData) => {
        if (!isDuplicateItem(cartListRef.current, item)) {
            setCartList(prev => {
                return [...prev, item];
            });
        }
    }

    const addToShoppingList = (item: ItemData) => {
        if (!isDuplicateItem(shoppingListRef.current, item)) {
            setShoppingList(prev => {
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
    const removeListFromCart = () => {
        // setCartList(cartList.filter(val => !removeList.includes(val)));

        let newCartList = cartList

        for (var i = 0, len = removeList.length; i < len; i++) {
            var ItemIndex = newCartList.findIndex(item => item.uid === removeList[i].uid);

            newCartList.splice(ItemIndex, 1)
        }

        setCartList(newCartList);
        clearRemoveList();
    }

    const removeItemFromShoppingList = (item: ItemData) => {
        const index = shoppingList.indexOf(item, 0);
        if (index > -1) {
            shoppingList.splice(index, 1);
        }
    }

    const clearCartList = () => {
        setCartList([]);
    }

    const clearRemoveList = () => {
        setRemoveList([]);
    }

    const clearShoppingList = () => {
        setShoppingList([]);
    }

    return (
        <ProductListContext.Provider value={{ cartList: cartList, removeList: removeList, shoppingList: shoppingList, isScanToRemove: isScanToRemove, userToken: userToken, setUserToken: setUserToken, setIsScanToRemove: setIsScanToRemove, addToCart: addToCart, addToRemoveList: addToRemoveList, addToShoppingList: addToShoppingList, removeListFromCart: removeListFromCart, removeItemFromShoppingList: removeItemFromShoppingList, clearCartList: clearCartList, clearRemoveList: clearRemoveList, clearShoppingList: clearShoppingList }}>
            {children}
        </ProductListContext.Provider>
    );
};

export { ProductListContext, ProductListProvider };