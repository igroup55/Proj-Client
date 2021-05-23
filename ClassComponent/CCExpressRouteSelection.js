import React, { Component, useState } from 'react';
import { CheckBox, Container, Header, Content, Form, Item, Input, Label, Picker, Footer, Right, Button, Icon, DatePicker } from 'native-base';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
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
      error: null
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
    if (this.state.StartStation !== '') {
      this.state.StationsList.map((station, key) => {
        if (station.StationID === this.state.StartStation) {

          this.storeData('XSStationName', station.StationName)
          this.storeData('XSstationLat', station.Latitude)
          this.storeData('XSstationLong', station.Longitude)

        }

      }
      
      )

      this.storeData('XStartStation', this.state.StartStation)
        
      this.props.navigation.navigate('DeliveryExpress')
    }
    else
    {
      // this.setState({ AlertModal: 'לא ניתן לחפש משלוחים במסלול הנבחר' });
      // { this.setModalVisible(true) }
      alert('בחר תחנה');

    }
  }

  render() {

    let stations = this.state.StationsList.map((stations, key) => {
      return (<Picker.Item key={key} label={stations.StationName} value={stations.StationID} />)
    });

    return (
      <SafeAreaView>
        <ScrollView>
          <View >
            <Header style={{ backgroundColor: 'green', borderBottomWidth: 2, borderColor: 'black', borderBottomColor: 'black' }}><Text style={{ fontSize: 30, fontWeight: 'bold', backgroundColor: 'green' }}> JestApp</Text></Header>
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

            <Form style={{ width: 390 }}>
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

              <View style={styles.container}>
                <MapView region={{ latitude: this.state.latitude, longitude: this.state.longitude, longitudeDelta: 0.0121, latitudeDelta: 0.015 }} style={{ width: Dimensions.get('window').width, height: 250 }}
                >
                  <Marker
                    coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                    title='my place:)'
                    description='here i am'
                  //image={require('../assets/icon.png')}
                  />
                </MapView>
              </View>


              <Button onPress={this.navigate} style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 70, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}>  חפש חבילות </Text></Button>


            </Form>



          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}



const styles = ({
  container: {
    flex: 1,
    backgroundColor: '#cbe8ba',
    alignItems: 'center',
    justifyContent: 'center',

  },
  InputText: {
    textAlign: 'right',
    borderColor: 'green',
    borderStyle: 'solid',
    backgroundColor: '#cbe8ba',
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
  }

});
