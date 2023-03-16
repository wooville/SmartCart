import React from 'react';
import {Text, Button, View, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackParams';
import { SafeAreaView } from 'react-native';
import { Card , TextInput} from 'react-native-paper';
import { loginStyle } from './login.style';

type authScreenProp = StackNavigationProp<RootStackParamList, 'SmartCart'>;

function AuthScreen() {
  const navigation = useNavigation<authScreenProp>();

  return (
    

    <SafeAreaView>
      <View>
      <Card>
      <Card.Title title="Please sign in:"></Card.Title>
      <Card.Content>
        <TextInput label ="Email" keyboardType="email-address"></TextInput>
        <TextInput label="Password" secureTextEntry={true} ></TextInput>
        
        <Button
        title="Login"
        onPress={() => navigation.navigate('Main') 
      }
        
      />
        <Button title="Sign Up"
        onPress={() => navigation.navigate('Signup')}
         />
        <Button title="Forgot Email or Password" />
        
      </Card.Content>

      </Card>
      </View>
       
  </SafeAreaView>
   
  );
}

export default AuthScreen;