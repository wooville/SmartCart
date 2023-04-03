import React, { useState } from 'react';
import {View, Text, Button, StyleSheet, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackParams';
import { TextInput } from 'react-native-gesture-handler';

const API_URL = 'http://smartcartbeanstalk-env.eba-3jmpa3xe.us-east-2.elasticbeanstalk.com/auth';


type authoffScreenProp = StackNavigationProp<RootStackParamList, 'Test'>;
const Separator = () => <View style={styles.separator} />;
const Separator2 = () => <View style={styles.separator2} />;



function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<authoffScreenProp>();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const onChangeHandler = () => {
        setIsLogin(!isLogin);
        setMessage('');
    };

    const onLoggedIn = (token: any) => {
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
                    if (res.status === 200) {
                        setMessage(jsonRes.message);
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    }

    const onSubmitHandler = () => {
        const payload = {
            email,
            password,
        };
        fetch(`${API_URL}/${'signup'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(async res => {
                try {
                    const jsonRes = await res.json();
                    if (res.status !== 200) {
                        setIsError(true);
                        setMessage(jsonRes.message);
                    } else {
                        onLoggedIn(jsonRes.token);
                        setIsError(false);
                        setMessage(jsonRes.message);
                        navigation.navigate('Main');
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
    };

    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }

  return (

    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',   backgroundColor: '#ddf8d7',}}>
      <Text style={styles.title}> Smart Cart</Text>
      <TextInput style={styles.button} placeholder="example@mcmaster.ca" onChangeText={setEmail}></TextInput>
      <TextInput style={styles.button} placeholder="Password" onChangeText={setPassword}></TextInput>
     
     
     

    <TouchableOpacity style={styles.nextbutton} onPress={onSubmitHandler}>
      <Text style={styles.buttontext}> Login</Text>

     
        </TouchableOpacity>
          
    <Separator2 />
    <Text style={[styles.buttontext, { color: isError ? 'red' : 'green' }]}>{message ? getMessage() : null}</Text>


    <TouchableOpacity style={styles.nextbutton} onPress={() => navigation.navigate('Test')}>
      <Text style={styles.text}> Sign Up</Text>  
    </TouchableOpacity>

    <Separator2 />



    </View>
  );

  

  
}

const styles = StyleSheet.create({
  button: {
    width: '75%',
    backgroundColor: 'white',
    height: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  fontSize:28,
  fontWeight: 'bold',
  

},
buttontext: {
  marginVertical:5,
  fontSize:18,
  color: 'white'
  

},
nextbutton: {
  width: '75%',
  backgroundColor: '#004b75',
  height: 35,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 2,
},
text: {
  marginVertical:3,
  fontSize:18,
  color: 'white'
  

}
});


export default AuthScreen;