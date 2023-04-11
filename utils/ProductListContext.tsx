import { createContext, FC, useState, useRef, useEffect } from 'react';

export type ItemData = { uid: string, refid: string, name: string, price: string, aisle: string, imgurl: string };
export type ProductData = { id: string, name: string, price: string, aisle: string, tags: string, imgurl: string };

export const PRODUCT_API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product';
export const AUTH_API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/auth';

interface IProductContext {
    allProductList: ProductData[];
    cartList: ItemData[];
    removeList: ItemData[];
    shoppingList: ProductData[];
    isScanToRemove: boolean;
    userToken: string;
    setAllProductList?: (items: ProductData[]) => void;
    addToCart?: (item: ItemData) => void;
    addToRemoveList?: (item: ItemData) => void;
    addToShoppingList?: (item: ProductData) => void;
    setLocalShoppingList?: (list: string) => void;
    removeListFromCart?: () => void;
    removeFromShoppingList?: (is: string) => void;
    setIsScanToRemove?: (bool: boolean) => void;
    setUserToken?: (token: string) => void;
    clearCartList?: () => void;
    clearRemoveList?: () => void;
    clearShoppingList?: () => void;
}

const defaultState = {
    allProductList: [],
    cartList: [],
    removeList: [],
    shoppingList: [],
    isScanToRemove: false,
    userToken: "noToken",
};

// const [cartList, setCartList] = useState<ItemData[]>([]);

// const CartListContext = createContext({ cartList, setCartList });
const ProductListContext = createContext<IProductContext>(defaultState);

interface Props {
    children: React.ReactNode;
}

const ProductListProvider: FC<Props> = ({ children }) => {
    const [allProductList, setAllProductList] = useState<ProductData[]>(defaultState.allProductList);

    const [shoppingList, setShoppingList] = useState<ProductData[]>(defaultState.shoppingList);
    const [cartList, setCartList] = useState<ItemData[]>(defaultState.cartList);
    const [removeList, setRemoveList] = useState<ItemData[]>(defaultState.removeList);
    const [isScanToRemove, setIsScanToRemove] = useState<boolean>(defaultState.isScanToRemove);
    const [userToken, setUserToken] = useState<string>(defaultState.userToken);

    // use refs and useEffect to circumvent stale closure (ie always ensure up to date states)
    const userTokenRef = useRef(userToken);
    const cartListRef = useRef(cartList);
    const removeListRef = useRef(removeList);
    const shoppingListRef = useRef(shoppingList);

    useEffect(() => {
        cartListRef.current = cartList;
        removeListRef.current = removeList;
        shoppingListRef.current = shoppingList;
    }, [cartList, removeList, shoppingList,])

    useEffect(() => {
        userTokenRef.current = userToken;
        getShoppingList(userToken);
        console.log("effect " + userToken);
    }, [userToken])

    useEffect(() => {
        getAllProducts()
    }, [])

    const getShoppingList = (token: any) => {
        fetch(`${AUTH_API_URL}/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    // console.log(JSON.stringify(jsonRes.data));

                    if (res.status === 200 && jsonRes.data) {
                        if (setLocalShoppingList) setLocalShoppingList(jsonRes.data);
                        else console.log("no setLocalShoppingList");
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    const getAllProducts = () => {
        fetch(`${PRODUCT_API_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status === 200) {
                        let allProducts: ProductData[] = await JSON.parse(JSON.stringify(jsonRes.data));

                        if (setAllProductList) setAllProductList(allProducts);
                        else console.log("no setAllProductList")
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }
    // getAllProducts();

    const isDuplicateItem = (items: ItemData[], nextItem: ItemData) =>
        items.findIndex(item => nextItem.uid === item.uid) > -1;

    const addToCart = (item: ItemData) => {
        if (!isDuplicateItem(cartListRef.current, item)) {
            setCartList(prev => {
                return [...prev, item];
            });
        }
    }

    const setLocalShoppingList = (list: string) => {
        let newList: ProductData[] = [];
        let eachItem;

        const splitList = list.split(",");
        for (var id of splitList) {
            eachItem = allProductList.find(item => item.id == id);
            if (eachItem) newList.push();
        }

        setShoppingList(newList);
        console.log(shoppingListRef.current);

        updateRemoteShoppingList();
    }

    const addToShoppingList = (item: ProductData) => {
        if (item == undefined) return;

        setShoppingList(prev => {
            return [...prev, item];
        });
        console.log(shoppingListRef.current);

        updateRemoteShoppingList();
    }

    const removeFromShoppingList = (id: string) => {
        const item2remove = shoppingListRef.current.find(item => item.id == id);
        if (item2remove) {
            const index = shoppingListRef.current.indexOf(item2remove, 0);
            if (index > -1) {
                shoppingListRef.current.splice(index, 1);
            }

            updateRemoteShoppingList();
        }
    }

    const updateRemoteShoppingList = () => {
        let shoppingListStr = "";
        for (var item of shoppingListRef.current) {
            shoppingListStr += item.id + ",";
        }
        // console.log(userTokenRef.current);
        console.log(JSON.stringify({ shoppingList: shoppingListStr }))

        fetch(`${AUTH_API_URL}/list`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userTokenRef.current}`,
            },
            body: JSON.stringify({ shoppingList: shoppingListStr })
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status === 200) {
                        console.log(JSON.stringify(jsonRes.message));
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
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
        <ProductListContext.Provider value={{ allProductList: allProductList, cartList: cartList, removeList: removeList, shoppingList: shoppingList, isScanToRemove: isScanToRemove, userToken: userToken, setUserToken: setUserToken, setAllProductList: setAllProductList, setIsScanToRemove: setIsScanToRemove, addToCart: addToCart, addToRemoveList: addToRemoveList, addToShoppingList: addToShoppingList, setLocalShoppingList: setLocalShoppingList, removeListFromCart: removeListFromCart, removeFromShoppingList: removeFromShoppingList, clearCartList: clearCartList, clearRemoveList: clearRemoveList, clearShoppingList: clearShoppingList }}>
            {children}
        </ProductListContext.Provider>
    );
};

export { ProductListContext, ProductListProvider };