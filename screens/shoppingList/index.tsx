import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../RootStackParams';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Modal } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
// import ListViewRenderPropGeneric from '../../ListViewRenderPropGeneric';
import { ProductListContext, ProductListProvider } from '../../utils/ProductListContext';
import { ShoppingListDisplay } from './ShoppingListDisplay';
const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/product/';

// type mainScreenProp = StackNavigationProp<RootStackParamList, 'Main'>;
type ItemProps = { name: string, price: string, aisle: string };

function ShoppingListScreen() {
    // const navigation = useNavigation<mainScreenProp>();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <ShoppingListDisplay />
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fff8',
    },
});

export default ShoppingListScreen;