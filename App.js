import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AuthService, CallService} from './src';
import ConnectyCube from 'react-native-connectycube';

const App = () => {
  useEffect(() => {
    AuthService.init();
  }, []);

  return (
    <View style={{marginTop: 50}}>
      <Pressable
        onPress={() => {
          AuthService.login({
            id: 2896638,
            login: 'teddy1',
            password: 'assortment',
          }).then(() => {
            console.log(ConnectyCube, 'aaa');
          });
        }}>
        <Text>login</Text>
      </Pressable>
      <View style={{height: 100}}></View>
      <Pressable
        onPress={() => {
          CallService.startCall([2896641]).then((stream) =>
            console.log(stream, 'star'),
          );
        }}>
        <Text>call me</Text>
      </Pressable>
      <View style={{height: 100}}></View>

      <Pressable
        onPress={() => {
          CallService.stopCall();
        }}>
        <Text>stop</Text>
      </Pressable>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
