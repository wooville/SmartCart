import React, { createContext, useContext, FC, useState, useRef, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProductListContext } from '../../utils/ProductListContext';
import { showMessage, hideMessage } from "react-native-flash-message";
import { ItemData, ProductData } from '../../utils/ProductListContext';
import { BackHandler } from 'react-native';

type ItemProps = { id: string, name: string, price: string, aisle: string };

export const SearchShop = () => {
  const { userToken, allProductList, setAllProductList, shoppingList, addToShoppingList, setLocalShoppingList } = useContext(ProductListContext);
  const [productList, setProductList] = useState<ProductData[]>([]);

  const allProductListRef = useRef(allProductList);
  const shoppingListRef = useRef(shoppingList);

  useEffect(() => {
    if (productList.length < 1) setProductList(allProductList.sort((a, b) => a.name.localeCompare(b.name)));
    allProductListRef.current = allProductList;
  }, [allProductList])

  useEffect(() => {
    shoppingListRef.current = shoppingList;
  }, [shoppingList])
  // const [shoppingList, setShoppingList] = useState<string>("");

  const Item = ({ id, name, price, aisle }: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.name}>{name}</Text>
      <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
        <View style={[{ flex: 1, flexDirection: 'row' }]}>
          <TouchableOpacity style={styles.button} onPress={() => updateShoppingList(id)}>
            <Text style={styles.buttonText}>Add to List</Text>
          </TouchableOpacity>
        </View>
        <View style={[{ justifyContent: 'space-evenly', marginVertical: 10 }]}>
          <Text style={styles.aisle}>{aisle}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
      </View>
    </View>
  );

  const updateShoppingList = (id: string) => {
    const item2add = productList.find(item => item.id == id);
    console.log("item " + item2add?.id);

    // let shoppingListStr = "";
    // for (var item of shoppingListRef.current) {
    //   shoppingListStr += item.id + ",";
    // }
    // shoppingListStr += id;

    // console.log(shoppingListStr)
    if (item2add) {
      if (addToShoppingList) {
        // const item2add = productList.find(item => item.id == id);

        addToShoppingList(item2add);
        // // if (setLocalShoppingList) setLocalShoppingList(shoppingListStr);
        // else console.log("no setLocalShoppingList");

        showMessage({
          message: item2add?.name + ' added to shopping list',
          type: 'success',
        });
      }
    }
    else {
      showMessage({
        message: 'Failed to add Item',
        type: 'warning',
      })
    }
  }

  const filterProducts = () => {

    // if uid is not already in list and there is a new product / server response

    let displayList: ProductData[] = [];
    for (var product of allProductListRef.current) {
      let newItem: ProductData = { id: product.id.toString(), name: product.name, price: product.price.toString(), aisle: product.aisle, tags: product.tags, imgurl: product.imgurl };

      displayList.push(newItem);
    }

    const filteredList = displayList.filter((prod) => prod.tags.includes(text.toLowerCase()) || prod.name.includes(text))
    filteredList.sort((a, b) => a.name.localeCompare(b.name))

    setProductList(filteredList);
  }

  const [text, onChangeText] = React.useState('');

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={"Enter Search Here..."}
        placeholderTextColor={"black"}
        onChangeText={onChangeText}
        value={text}
      />
      <TouchableOpacity
        onPress={filterProducts}
        style={styles.searchButton}>
        <Text style={styles.searchButtonText}>
          {'Search'}
        </Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <FlatList
          data={productList}
          renderItem={({ item }) => <Item id={item.id} name={item.name} price={item.price} aisle={item.aisle} />}
          keyExtractor={item => item.id}
        />
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
  rowBack: {
    backgroundColor: '#eb4034',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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
  }
});