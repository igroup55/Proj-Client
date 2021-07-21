import React, { Component, useState } from 'react';
import { CheckBox, Container, Header, Content, Form, Item, Input, Label, Picker, Footer, Right, Button, Icon, DatePicker } from 'native-base';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import CheckBoxes from './CCCheckBox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReactDOM from "react-dom";
import DatePickerExample from './DatePicker';
import Map from './Map';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class CCExpressRouteSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {

      StartStation: null,
      StationsList: [],
      latitude: 0,
      longitude: 0,
      error: null,
      modalVisible: false
    };

  }

  // async componentDidMount () {


  // };
  onValueChange1 = (value) => {
    this.setState({
      StartStation: value
    });

  }


  async componentDidMount() {
    const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Stations';
    const response = await fetch(apiStationsUrl);
    const data = await response.json()
    this.setState({ StationsList: data, })
    console.log(data);


    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      });
    },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );
  }

  storeData = async (key, value) => {

    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(key + ": " + jsonValue);
    }
    catch (e) {
      console.log(e);
    }
  };

  navigate = () => {
    if (this.state.StartStation !== null) {
      this.state.StationsList.map((station, key) => {
        if (station.StationID === this.state.StartStation) {

          this.storeData('XSStationName', station.StationName)
          this.storeData('XSstationLat', station.Latitude)
          this.storeData('XSstationLong', station.Longitude)
          this.storeData('XSstationID', station.StationID)
        }

      }

      )

      this.storeData('XStartStation', this.state.StartStation)

      this.props.navigation.navigate('ExpressPackages')
    }
    else {
      this.setState({ AlertModal: 'בחר תחנה' });
      { this.setModalVisible(true) }
      //alert('בחר תחנה');

    }
  }



  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render() {

    let stations = this.state.StationsList.map((stations, key) => {
      return (<Picker.Item key={key} label={stations.StationName} value={stations.StationID} />)
    });
    let locations = this.state.StationsList.map((stations, key) => {
      return (<Marker key={key} coordinate={{ latitude: stations.Latitude, longitude: stations.Longitude }}
        title={stations.StationName}
        description=""
        image={require('../assets/trainStation.png')} />)
    });


    return (


      <View style={{ backgroundColor: 'lightyellow', flex: 1, borderTopColor: 'black', borderTopWidth: 2 }}>
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
        {/* <Header style={{ backgroundColor: '#ffed4b', borderBottomWidth: 2, borderColor: 'black', borderBottomColor: 'black' }}><Text style={{ fontSize: 30, fontWeight: 'bold', backgroundColor: '#ffed4b' }}> JestApp</Text></Header> */}
        {/* <Modal
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
            </Modal> */}

        <Form >
          <View >

            <Icon name="location" style={{ alignSelf: 'center', marginTop: 10 }} />
            <Text style={styles.titles} >תחנת מוצא</Text>
            <Item picker style={styles.InputText}>
              <Picker
                mode="dropdown"
                style={{ textAlign: 'right' }}
                placeholder="בחר תחנת מוצא"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.StartStation}
                onValueChange={this.onValueChange1.bind(this)}
              >

                <Picker.Item label='בחר תחנת מוצא' value='None' />

                {stations}


              </Picker>
            </Item>
          </View>

          <View style={styles.section}>
            <Icon name="map" style={{ alignSelf: 'center', marginTop: 10 }} />
            <Text style={styles.titles}>התחנה הקרובה</Text>


          </View>

          <View>
            <MapView region={{ latitude: this.state.latitude, longitude: this.state.longitude, longitudeDelta: 0.0121, latitudeDelta: 0.015 }} style={{ width: Dimensions.get('window').width, height: 250 }}
            >
              <Marker
                coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                title='my place:)'
                description='here i am'
              //image={require('../assets/icon.png')}
              />
              {locations}
            </MapView>
          </View>


          <Button onPress={this.navigate} style={{ alignSelf: 'center', backgroundColor: '#ffed4b', marginTop: 70, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}>  חפש חבילות </Text></Button>


        </Form>



      </View>


    );
  }
}



const styles = ({
  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

  },
  InputText: {
    textAlign: 'right',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    backgroundColor: '#ffed4b',
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10
  },
  titles: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    alignItems: 'center'
  },
  section: {
    marginTop: 15,
    marginBottom: 5
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
    backgroundColor: "#ffed4b",
  },
  buttonClose: {
    backgroundColor: "#ffed4b",
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

});
