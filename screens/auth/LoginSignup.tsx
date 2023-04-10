import { createContext, useContext, FC, useState, useEffect, useRef } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ItemData } from '../../utils/ProductListContext';
import { ProductListContext } from '../../utils/ProductListContext';
import { RootStackParamList } from '../RootStackParams';
import { StackNavigationProp } from '@react-navigation/stack';

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/auth';

type authScreenProp = StackNavigationProp<RootStackParamList, 'Auth'>;
const Separator = () => <View style={styles.separator} />;
const Separator2 = () => <View style={styles.separator2} />;

export const LoginSignup = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const { userToken, setUserToken, setShoppingList } = useContext(ProductListContext);
    const navigation = useNavigation<authScreenProp>();

    const getShoppingList = (token: any) => {
        fetch(`${API_URL}/private`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status === 200 && jsonRes.data) {

                        if (setShoppingList) setShoppingList(jsonRes.data);
                        else console.log("no setShoppingList");
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    const login = () => {
        const userInfo = {
            email,
            password,
        };
        fetch(`${API_URL}/${'login'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status !== 200) {
                        setMessage(jsonRes.message);
                    } else {
                        getShoppingList(jsonRes.token);
                        navigation.navigate('Main');
                        if (setUserToken) setUserToken(jsonRes.token);
                        else console.log("no setUserToken");
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };
    const SignUp = () => {
        const userInfo = {
            email,
            password,
        };
        fetch(`${API_URL}/${'signup'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status !== 200) {

                        setMessage(jsonRes.message);
                    } else {
                        navigation.navigate('Auth');
                        if (setUserToken) setUserToken(jsonRes.token);
                        else console.log("no setUserToken");
                        setMessage(jsonRes.message);
                        setIsModalVisible(false)
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    const showModal = () => {
        setIsModalVisible(true)
    }

    return (
        <>
            <TextInput style={styles.button} placeholder="example@email.com" onChangeText={setEmail}></TextInput>
            <TextInput style={styles.button} secureTextEntry={true} placeholder="Password" onChangeText={setPassword}></TextInput>

            <TouchableOpacity style={styles.nextbutton} onPress={login}>
                <Text style={styles.buttontext}> Login</Text>

            </TouchableOpacity>

            <Modal animationType={"slide"} onRequestClose={() => { setIsModalVisible(false); }} visible={isModalVisible} >

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ddf8d7', }}>

                    <Image
                        style={styles.logo}
                        source={require('../../assets/SmartCart_font.png')}
                    />
                    <TextInput style={styles.button} placeholder="Name" onChangeText={setName}></TextInput>
                    <TextInput style={styles.button} placeholder="example@email.com" onChangeText={setEmail}></TextInput>
                    <TextInput style={styles.button} secureTextEntry={true} placeholder="Password" onChangeText={setPassword}></TextInput>
                    <Text >{message}</Text>

                    <TouchableOpacity style={styles.nextbutton} onPress={SignUp}>
                        <Text style={styles.text}> Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </Modal>

            <Separator2 />
            <Text >{message}</Text>


            <TouchableOpacity style={styles.nextbutton} onPress={showModal}>
                <Text style={styles.text}> Sign Up</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 45,
        borderRadius: 50,
        marginVertical: 10,
    },
    separator: {
        marginVertical: 5,
    },
    separator2: {
        marginVertical: 3,
    },
    title: {
        marginVertical: 8,
        fontSize: 28,
        fontWeight: 'bold',
    },
    buttontext: {
        marginVertical: 5,
        fontSize: 18,
        color: 'white'
    },
    nextbutton: {
        width: '75%',
        backgroundColor: '#004b75',
        height: 35,
        borderRadius: 20,
        marginVertical: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginVertical: 3,
        fontSize: 18,
        color: 'white'
    },
    logo: {
        width: 100,
        height: 150
    }
});