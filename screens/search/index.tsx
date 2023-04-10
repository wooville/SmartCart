import React from 'react';
import { createContext, useContext, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackParams';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

type ItemData = { id: string, name: string, price: string, aisle: string, tags: string };
type ItemProps = { name: string, price: string, aisle: string };

const Item = ({ name, price, aisle }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.aisle}>{aisle}</Text>
    <Text style={styles.price}>{price}</Text>
  </View>
);

interface ProductData {
  id: number
  name: string
  price: number
  aisle: string
  tags: string
  createdAt: string
  updatedAt: string
};

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product';

type SearchScreenProp = StackNavigationProp<RootStackParamList, 'Search'>;

function SearchScreen() {

  const [productList, setProductList] = useState<ItemData[]>([]);

  const navigation = useNavigation<SearchScreenProp>();

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
            for (let i = 0; i < allProducts.length; i++) {
              let newItem: ItemData = { id: allProducts[i].id.toString(), name: allProducts[i].name, price: allProducts[i].price.toString(), aisle: allProducts[i].aisle, tags: allProducts[i].tags };

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
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //   <Text>Search Screen</Text>
    //   <Button title="Login" onPress={() => navigation.navigate('Main')} />
    // </View>
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={"Enter Search Here..."}
        placeholderTextColor={"black"}
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
          renderItem={({ item }) => <Item name={item.name} price={item.price} aisle={item.aisle} />}
          keyExtractor={item => item.id}
        />
        {/* {swipeListRender()} */}
      </View>
    </SafeAreaView>
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
  cartTotalButton: {
    backgroundColor: '#54589A',
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
});
export default SearchScreen;