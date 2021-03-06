import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Button, Modal, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';
//import Geocode from "react-geocode";
import { getDistance } from 'geolib';
import { Icon } from 'native-base';
import * as Location from 'expo-location';
import moment from 'moment';

export default class CCDeliveryExpressFeed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      PackagesList: [],
      StartStation: null,
      EndStation: 0,
      StationName: '',
      StationLat: null,
      StationLong: null,
      AddressLat: 32.437408,
      AddressLong: 34.925621,
      selectedItem: [],
      SelectedArr: [],
      XDistance: null,
      custArray: [],
      AlertModal: '',
      modalVisible: false
    }
  }

  async componentDidMount() {

    this.getData('start')


    let values = await AsyncStorage.multiGet(['XSStationName', 'XSstationLat', 'XSstationLong', 'UserId'])

    this.setState({ StationName: values[0][1], StationLat: values[1][1], StationLong: values[2][1], UserID: JSON.parse(values[3][1]) }, () => {

      StationLat = this.state.StationLat
      StationLong = this.state.StationLong
      AddressLat = this.state.AddressLat
      AddressLong = this.state.AddressLong

    })

  }

  onPressHandler(pack) {
    let renderData = [...this.state.PackagesList];

    renderData.map((data, key) => {

      if (data.PackageId === pack.PackageId) {

        data.selected = (data.selected == null) ? true : !data.selected;

      }

      this.setState({ renderData });
    })

    this.setState({ SelectedArr: [...renderData] })


  }

  async getData(activity) {
    try {
      if (activity === 'start') {
        jsonValue = await AsyncStorage.getItem('XStartStation')
        jsonValue != null ? ExpressStation = JSON.parse(jsonValue) : null;
        this.setState({ StartStation: ExpressStation })
        this.getpackages()
      }


      if (activity === 'selectedpacks') {

        jsonValue = await AsyncStorage.getItem('SelectedPacks')
        jsonValue != null ? ExpressPacks = JSON.parse(jsonValue) : null;
        this.setState({ SelectedArr: ExpressPacks })

      }

    }
    catch (e) {

    }
  }

  storeData = async (key, value) => {

    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    }
    catch (e) {
    }
  };

  getpackages = async () => {

    //  fetch to get address from customerspackages

    let weight = 0
    let express = 'True'

    const apiExpressUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight=' + weight + '&express=' + express;
    const response = await fetch(apiExpressUrl);
    const data = await response.json()
    this.setState({ PackagesList: data }, () => {
      this.state.PackagesList.map((data, key) => {
        this.getcustDetails(data.PackageId, key)
      })
    })




  }

  getcustDetails = async (PackageId, key) => {


    const apiCustDetailsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Customers?PackageId=' + PackageId;
    const custresponse = await fetch(apiCustDetailsUrl);
    const CustDetails = await custresponse.json()

    // this.state.PackagesList[key].AddressLat = reverseGC[0].latitude
    // this.state.PackagesList[key].AddressLong = reverseGC[0].longitude

    this.state.PackagesList[key].Address = CustDetails.Address
    let reverseGC = await Location.geocodeAsync(CustDetails.Address);
    let Distance = getDistance({ latitude: StationLat, longitude: StationLong }, { latitude: reverseGC[0].latitude, longitude: reverseGC[0].longitude })
    this.state.PackagesList[key].Distance = Distance

    this.setState({ custArray: [...this.state.custArray, CustDetails] })

  }


  AddSelectedPacks = () => {

    let selected = []
    this.state.SelectedArr.map((pack, key) => {
      if (pack.selected === true) {
        selected.push(pack)

      }


    })
    this.setState({ selectedItem: selected }, () => {
      const datetime = moment().add(30, 'minutes').format()

      this.state.selectedItem.map((item) => {
        const ExpressDetails = {
          PackageID: item.PackageId,
          Status: 1,
          UserID: this.state.UserID.UserId,
          FullName: this.state.UserID.FullName,
          PackTime: datetime

        }
        fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ExpressUser', {
          method: 'POST',
          body: JSON.stringify(ExpressDetails),
          headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
          })
        })

        const Package_Update = {
          Status: 5,
          PackageID: item.PackageId
        }

        fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
          method: 'PUT',
          body: JSON.stringify(Package_Update),
          headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
          })
        })

        this.setState({ AlertModal: '???????????? ?????????????? ??- 30 ???????? ' });
        { this.setModalVisible(true) }
        setTimeout(() => {
          this.props.navigation.navigate('ExpressPackages');
        }, 2000);
        //navigation to next component or home
      })

    })


  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }


  render() {

    if (this.state.PackagesList.length !== 0) {


      return (

        <View style={styles.container}>
          <View style={{ height: 70, borderColor: 'black', borderWidth: 1, borderRadius: 12, margin: 10, backgroundColor: '#ffed4b' }}><Text style={{ textAlign: 'center', padding: 15, fontSize: 25, fontWeight: 'bold' }}> Express </Text></View>
          <View style={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'black', height: 500, borderRadius: 10, margin: 10 }}>
            <FlatList
              style={{ maxheight: 550 }}

              data={this.state.PackagesList}
              keyExtractor={item => item.PackageId.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, key }) => (


                <TouchableOpacity onPress={() => this.onPressHandler(item)}>
                  <Card
                    style={
                      item.selected === true
                        ? {
                          padding: 10,
                          marginRight: 20,
                          marginLeft: 20,
                          marginTop: 10,
                          marginBottom: 10,
                          borderRadius: 5,
                          margin: 2,
                          backgroundColor: '#ffed4b',
                          borderWidth: 1.5,
                          borderColor: 'black'
                        }
                        : {
                          padding: 10,
                          margin: 2,
                          marginTop: 10,
                          marginRight: 20,
                          marginLeft: 20,
                          marginBottom: 10,
                          borderRadius: 5,
                          backgroundColor: '#a1a1a1',
                          borderWidth: 0.5,
                          borderColor: 'black',

                        }
                    }>
                    <View style={{ alignItems: 'center', margin: 10 }} >
                      <Text style={{ margin: 5 }}><Text style={{ fontWeight: 'bold' }}>- ???? ?????????? : </Text>{item.PackageId}</Text>
                      <Text style={{ margin: 5 }}><Text style={{ fontWeight: 'bold' }}>- ???????? ?????????? : </Text>{(3000 / 1000 + item.Pweight * 2).toFixed(1) + ' ??? '}</Text>
                      <Text style={{ margin: 5 }}><Text style={{ fontWeight: 'bold' }}>- ???????? : </Text>???? {item.Pweight + ' ??"??'}</Text>
                      <Text style={{ margin: 5 }}><Text style={{ fontWeight: 'bold' }}>- ???????? ?????????? : </Text>{this.state.StationName.replace(/"/gi, '')}</Text>
                      <Text style={{ margin: 5 }}><Text style={{ fontWeight: 'bold' }}>- ?????????? ?????? : </Text>{item.Address}</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#ffed4b', margin: 20, padding: 10, borderWidth: 1, borderColor: 'black', borderRadius: 10 }} onPress={this.AddSelectedPacks}><Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>?????????? ??????????</Text></TouchableOpacity>

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
                  <Text style={styles.textStyle}> ???????? </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>)

    }

    else
      return (<View style={styles.container}><Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 20 }}> ?????? ???????????? </Text></View>)


  }
}

const styles = ({
  container: {
    flex: 1,
    backgroundColor: 'lightyellow',
    borderTopColor: 'black',
    borderTopWidth: 2,
    justifyContent: 'center',

  },
  Cards: {
    flexDirection: 'row',
    borderColor: 'green',
    borderStyle: 'solid',
    direction: 'rtl',
    borderRadius: 10,
    marginBottom: 20,


  },
  titles: {

    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    alignItems: 'center',
    fontSize: 20
  },
  section: {
    marginTop: 15,
    marginBottom: 5
  },
  greeting: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 30,
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
    backgroundColor: "#ffed4b",
    borderColor: 'black',
    borderWidth: 1
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
