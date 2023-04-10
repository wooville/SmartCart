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
import {showMessage, hideMessage} from "react-native-flash-message";

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product';

interface ProductData {
    id: number
    name: string
    price: number
    aisle: string
    tags: string
    createdAt: string
    updatedAt: string
};
type ItemData = { id: string, name: string, price: string, aisle: string, tags: string};
type ItemProps = { id: string, name: string, price: string, aisle: string };

export const SearchShop = () => {
    const { shoppingList, addToShoppingList, removeItemFromShoppingList } = useContext(ProductListContext);

    const [productList, setProductList] = useState<ItemData[]>([]);

    const shoppingListRef = useRef(shoppingList)

    useEffect(() => {
        shoppingListRef.current = shoppingList;
    }, [shoppingList])

    const Item = ({ id, name, price, aisle }: ItemProps) => (
        <View style={styles.item}>
          <Text style={styles.name}>{name}</Text>
          <View style={[{flexDirection: 'row', alignItems:'center'}]}>
            <View style={[{flex:1,flexDirection: 'row'}]}>
              <TouchableOpacity style ={styles.button} onPress = {() => _onPress(id)}>
                <Text style ={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
            <View style={[{justifyContent:'space-evenly',marginVertical:10}]}>
              <Text style={styles.aisle}>{aisle}</Text>
              <Text style={styles.price}>{price}</Text>
            </View>
          </View>    
        </View>
      );

      const _onPress = (id: string) => {
    
        const item2add = productList.find(item => item.id == id);
    
        if (item2add != undefined){
          if (addToShoppingList) addToShoppingList(item2add);
          else console.log("no addToShoppingList")
          showMessage({
            message: item2add.name+ ' added to shopping list',
            type: 'success',
          });
          console.log(shoppingListRef.current)
        }
        else {
          showMessage({
            message: 'Failed to add Item',
            type: 'warning',
          })
        }
      }
    
      const getList = () => {
    
        fetch(`${API_URL}/`, {
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
                  // console.log(product);
    
                  // if uid is not already in list and there is a new product / server response
    
                  let displayList: ItemData[] = [];
                  for (let i = 0; i<allProducts.length; i++) {
                      let newItem: ItemData = { id: allProducts[i].id.toString(), name: allProducts[i].name, price: allProducts[i].price.toString(), aisle: allProducts[i].aisle , tags: allProducts[i].tags};
    
                      displayList.push(newItem);
                  }
                  
                  const filteredList = displayList.filter((prod) => prod.tags.includes(text.toLowerCase()) || prod.name.includes(text))
                  filteredList.sort((a, b) => a.name.localeCompare(b.name))
    
                  setProductList(filteredList);
              }
          } catch (err) {
              console.log(err);
          };
      })
      .catch(err => {
          console.log(err);
      });
      }  
        
      const [text, onChangeText] = React.useState('');

    return (
        <>
            <TextInput
                style={styles.input}
                placeholder = {"Enter Search Here..."}
                placeholderTextColor = {"black"}
                onChangeText={onChangeText}
                value={text}
            />
            <TouchableOpacity
                onPress={getList}
                style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>
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
    BLEDeviceTitleWrapper: {
      flex: 1,
      justifyContent: 'center',
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
      backgroundColor: '#008959',
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