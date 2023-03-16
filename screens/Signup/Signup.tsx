import React from 'react';
import {Text, Button, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../RootStackParams';
import { SafeAreaView } from 'react-native';
import { Card , TextInput} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


type SignupScreenProp = StackNavigationProp<RootStackParamList, 'Signup'>;

function SignupScreen() {
  const navigation = useNavigation<SignupScreenProp>();

  return (

    <SafeAreaView>
      <Card>
      <Card.Title title="Please enter your information:"></Card.Title>
      <Card.Content>
        <TextInput label ="Email" keyboardType="email-address"></TextInput>
        <TextInput label="Password" secureTextEntry={true} ></TextInput>
        
        <Button
        title="Sign up"
        onPress={() => navigation.navigate('Main')}
      />
       

</Card.Content>

      </Card>
    </SafeAreaView>
   
  );
}

export default SignupScreen;