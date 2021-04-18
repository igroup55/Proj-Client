import React, { Component } from 'react'
import { Modal, Pressable, Image, Linking, Text, TouchableOpacity, TextInput, StyleSheet, View, navigate, navigation } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from 'native-base';

export default class CCLogin extends Component {
  state = {
    email: '',
    password: '',
    Users: [],
    AlertModal: '',
    modalVisible: false
  }

  storeData = async (key, value) => {

    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(key + ": " + jsonValue);

    } catch (e) {
      console.log(e);
    }
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }



  loginuser() {



    console.log(this.state.Users);
    this.state.Users.map((user) => {
      console.log(user);

      if (this.state.email == user.EmailAddress && this.state.password == user.Password) {
        { this.storeData('UserId', user) }
        this.props.navigation.navigate('Home');

      }
      else {

        this.setState({ AlertModal: 'Wrong email or passowrd' });

        { this.setModalVisible(true) }

      }
    });


  }



  async login(email, password) {



    const apiUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Users?email=' + email + '&pass=' + password;
    const response = await fetch(apiUserUrl);
    const data = await response.json()
    this.setState({ Users: data, });
    console.log(email, password)
    { this.loginuser() }
  }

  

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={styles.centeredView}>

            <View style={styles.modalView}>
              <Icon style={{ marginBottom: 20, marginTop: 0 }} name="cube" />
              <Text style={styles.modalText}>{this.state.AlertModal}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              >
                <Text style={styles.textStyle}> סגור </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Image source={{ uri: 'https://s4.gifyu.com/images/package-removebg-preview-1.png' }}
          style={{
            width: 80,
            height: 80,
            alignSelf: 'center',
            marginBottom: 20
          }}
        />
        <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', marginBottom: 30 }}> JestApp  </Text>
        <Text style={{ fontSize: 22, textAlign: 'center' }}>Sign In </Text>
        <Text style={{ color: 'grey', textAlign: 'center', margin: 10 }}>Hey there! nice to see you again</Text>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Email"
          placeholderTextColor="green"
          autoCapitalize="none"
          onChangeText={val => this.setState({ email: val })}
        />

        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Password"
          placeholderTextColor="green"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={val => this.setState({ password: val })}

        />
        <Button onPress={() => { this.login(this.state.email, this.state.password) }} style={styles.submitButton}><Text style={styles.submitButtonText}>Sign In          </Text></Button>

        <View style={{ flexDirection: 'row-reverse' }}>
          <Text style={{ color: 'blue' }}
            onPress={() => { this.props.navigation.navigate('Register'); }} >
            Not a member? Sign Up  {'\u00A0'}
          </Text>
          
        </View>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    margin: 25


  },
  input: {
    margin: 30,
    height: 40,
    borderColor: 'lightgrey',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0

  },
  submitButton: {
    backgroundColor: 'green',
    textAlign: 'center',
    height: 55,
    width: 150,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 20



  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#cbe8ba",
  },
  buttonClose: {
    backgroundColor: "#cbe8ba",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  }
})
