import React, { Component, useState } from 'react';
import { CheckBox, Container, Header, Content, Form, Item, Input, Label, Picker, Footer, Right, Button, Icon, DatePicker } from 'native-base';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions, Alert, Image,Linking } from 'react-native';
import CheckBoxes from './CCCheckBox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReactDOM from "react-dom";
import DatePickerExample from './DatePicker';
import Map from './Map';
import MapView, { Polyline } from 'react-native-maps';
import { Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geocoder from 'react-native-geocoding';
import { DrawerContentScrollView } from '@react-navigation/drawer';
// import Polyline from '@mapbox/polyline';
import { NavigationApps, actions, googleMapsTravelModes, mapsTravelModes } from "react-native-navigation-apps";


export default class CCExpressRecomendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      location: '',
      latitude: 0,
      longitude: 0,
      locations: [],
      UserID: 0,
      SelectedStation: 0,
      Polylines: [],
      NavAddress: '',
      NavLat: 0,
      NavLon: 0,
      finished: 0


    };
  }
  adressesGeocode = async () => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];

    }


  }
  haveMoreDeliveries() {
    console.log("shnizel: " + this.state.locations.length)
    if (this.state.locations.length === 0) {
      this.setState({ finished: 1 });
    }
  }
  async componentDidMount() {
    this.getLatLng();



    // const {locations: [sampleLocation] } = this.state
    // this.setState({desLastitude: sampleLocation.coords.latitude,
    //                desLongitude: sampleLocation.coords.longitude 
    // },this.mergeCoords)

  }
  getLatLng() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      });
      this.getData();
    },
      error => this.setState({ errorMessage: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    )
  }
  async getData() {
    try {



      console.log("In get ExpressData")
      let jsonValue = await AsyncStorage.getItem('UserId')
      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
      this.setState({ UserID: UserDetails.UserId }, () => { console.log("ExpressUserID: " + this.state.UserID) })

      let jsonValue2 = await AsyncStorage.getItem('XSstationID')
      jsonValue2 != null ? Station = JSON.parse(jsonValue2) : null;
      this.setState({ SelectedStation: Station }, () => { console.log("stationID: " + Station) })

      // let ExpressTrip = await AsyncStorage.multiGet(['ExUserID', 'XSstationID']);
      // ExpressTrip !=null? ExData=JSON.parse(ExpressTrip):null
      // this.setState({UserID:ExData[0][1],SelectedStation:ExData[1][1]})
      // console.log("my UserID: "+this.state.UserID+", My station is: "+this.state.SelectedStation)
      this.getAddresses();


    }
    catch (e) {
      // alert('error get item')
      // this.setState({ AlertModal: 'Error get Item' });
      // { this.setModalVisible(true) }
      // error reading value
    }


  }
  async getStationID() {
    try {

    }
    catch (e) {

    }
  }
  getAddresses = async () => {

    const ExCustomerList = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Customers?UserID=' + this.state.UserID + '&Elat=' + this.state.latitude + '&Elng=' + this.state.longitude + "&Station=" + this.state.SelectedStation;
    const responseExCustomerList = await fetch(ExCustomerList);
    const dataEx = await responseExCustomerList.json()
    this.setState({ locations: dataEx }, () => console.log("my addresses are: " + this.state.locations));
    let coords = [{ latitude: this.state.latitude, longitude: this.state.longitude }]
    for (let index = 0; index < dataEx.length; index++) {
      let coord = { latitude: dataEx[index].Latitude, longitude: dataEx[index].Longitude }
      coords.push(coord);

    }
    this.setState({ Polylines: coords })
    console.log(this.state.Polylines)
    this.haveMoreDeliveries();
  }

  mergeCoords = () => {
    const {
      latitude,
      longitude,
      desLatitude,
      desLongitude
    } = this.state

    const hasStartAndEnd = latitude !== null && desLatitude !== null

    if (hasStartAndEnd) {
      const concatStart = `${latitude},${longitude}`
      const concatEnd = `${desLatitude},${desLongitude}`
      this.getDirections(concatStart, concatEnd)
    }
  }
  handleSetNavigationPath = (adress, lat, long) => {
    let NavAddress = adress;
    let NavLat = lat;
    let NavLon = long;
    this.setState({ NavAddress: NavAddress, NavLat: NavLat, NavLon: NavLon });
    console.log(this.state.NavLat + "(" + lat + ")" + "," + this.state.NavLon + "(" + long + ")");



    //  this.componentDidMount();
  }
  // async getDirections(startLoc, desLoc) {
  //   try {
  //     const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}`)
  //     const respJson = await resp.json();
  //     const response = respJson.routes[0]
  //     console.log(response)
  //     const distanceTime = response.legs[0]
  //     const distance = distanceTime.distance.text
  //     const time = distanceTime.duration.text
  //     const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
  //     const coords = points.map(point => {
  //       return {
  //         latitude: point[0],
  //         longitude: point[1]
  //       }
  //     })
  //     this.setState({ coords, distance, time })
  //   } catch(error) {
  //     console.log('Error: ', error)
  //   }
  // }

  btnLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ errorMessage: 'Permission to access location was denied', });
    }
    let location = await Location.getCurrentPositionAsync({});
    // this.setState({ location });
    console.log(location);

  };

  _pressCall=(key)=>{
    const url='tel://0'+this.state.locations[key].PhoneNum
    Linking.openURL(url)}


  btnReverseGC = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ errorMessage: 'Permission to access location was denied', });
    }
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
      let reverseGC = await Location.geocodeAsync(this.state.NavAddress);
      console.log({ reverseGC });
      console.log('the coords: ' + reverseGC[0].latitude + ', ' + reverseGC[0].longitude);
    } else {
      alert('You must push the Location button first in order to get the location before you can get the reverse geocode for the latitude and longitude!');
    }
  };
  DepositToCustomerAlert = (key) => {

    console.log(this.state.locations[key]["PhoneNum"]);
    Alert.alert(
      "שם לקוח - " + this.state.locations[key].FullName + "\nמספר טלפון - 0" + this.state.locations[key].PhoneNum,
      "האם אתה מעוניין למסור את החבילה ללקוח בכתובת " + this.state.locations[key].Address + "? ",
      [
        {
          text: "בטל",
          onPress: () => console.log("Cancel Pressed"),
         
        },
        {text:'חייג',
        onPress:()=> this._pressCall(key)
        
      },
        { text: "מסור ללקוח", onPress: () => this.UpdateExpressPackageStatus(key) }
      ]
    );
  }


  UpdateExpressPackageStatus = async (key) => {
    let packageID = this.state.locations[key].PackageId


    let api = "http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ExpressUser/{UpdateStatusDelivered}?PackageId=" + packageID
    await fetch(api, {
      method: 'PUT',
      // body: JSON.stringify(userToken),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })
    console.log("express package:" + packageID + " status have been updated");
    //   //  let locations= this.state.locations.filter(0)
    //   //  this.setState({locations:locations});
    //   const apiSenderId = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages/{MYPackageID}?PackageId='+packageID;
    //  const responseSenderId = await fetch(apiSenderId);
    //  const senderId = await responseSenderId.json();
    //  console.log("the senderId is: "+senderId.UserId);
    //  //senderToken
    //  const apiSenderToken = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Users/{GetSenderToken}?UserId='+senderId.UserId+'&PackageID='+packageID;
    // const responseSenderToken = await fetch(apiSenderToken);
    // const senderToken = await responseSenderToken.json();
    // console.log("the sender token is: "+senderToken.Token)
    //  //sending push notification
    //  let message = {
    //   to: senderToken.Token,
    //   sound: 'default',
    //   title: ' משלוח אקספרס מספר '+packageID+' נמסר ',
    //   body: 'שליח אקספרס העביר את החבילה ללקוח',

    // };

    // await fetch('https://exp.host/--/api/v2/push/send', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Accept-encoding': 'gzip, deflate',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(message),
    // });
    // console.log(message.data)
    this.componentDidMount();
  }

  getRandomColor = () => {
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
  }
  render() {

    let colorlist = []
    let locations = this.state.locations.map((location, key) => {
      let color = this.getRandomColor();
      console.log("color: " + color)
      colorlist.push(color);
      return (<Marker key={key}
        coordinate={{ latitude: location.Latitude, longitude: location.Longitude }}
        title={location.Address}
        description={'name: ' + location.FullName + " Phone: " + location.PhoneNum}
        pinColor={color}
        //  image={require('../assets/Box.png')}

        //onPress={() => this.handleSetNavigationPath(location.Address, location.Latitude, location.Longitude)}
      />)

    });
    let locationsText = this.state.locations.map((location, key) => {
      let count = key + 1

      return (<TouchableOpacity style={{ backgroundColor: 'white', margin: 7, borderRadius: 8, borderWidth: 1, borderColor: 'black' }} onPress={() => { this.DepositToCustomerAlert(key) }} key={key} >

        <Text style={{ color: 'black', marginTop: 10, marginBottom: 5, fontSize: 17, lineHeight: 20, fontWeight: 'bold' }} key={key}>  <View><Text style={{ backgroundColor: colorlist[key], borderRadius: 35, borderWidth: 1, }}>     </Text></View>  {" כתובת " + count + " - " + location.Address}  </Text>
        {/*  */}

      </TouchableOpacity>

      )

    });

    const { latitude, longitude, coords } = this.state
    return (
      <SafeAreaView style={{ borderTopColor: 'black', borderTopWidth: 2, backgroundColor: 'lightyellow', flex: 1 }}>
        <ScrollView>
          <View  >

            {/* <Form style={{ width: 390}}> */}

            <View style={styles.section}>
              <Icon name="navigate-circle-outline" style={{ alignSelf: 'center', margin: 2, fontSize: 50 }} />
            </View>

            <View style={{ borderWidth: 3, borderColor: 'black', margin: 5, width: 355, shadowColor: 'black', shadowOpacity: 1, alignSelf: 'center' }} >
              <MapView showsUserLocation region={{ latitude: this.state.latitude, longitude: this.state.longitude, longitudeDelta: 0.0421, latitudeDelta: 0.0922 }} style={{ width: 350, height: 400, borderRadius: 20, alignSelf: 'center', borderWidth: 1, borderColor: 'black' }}
              >
                <Marker
                  coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                  title='המיקום שלי :)'
                  description='אני כאן'
                //image={require('../assets/icon.png')}

                />
                {locations}
                <Polyline
                  coordinates={this.state.Polylines}
                  strokeColor="#008e92" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={4}

                />
              </MapView>
            </View>



            {/* <Button onPress={this.navigate} style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 70, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}>  חפש חבילות </Text></Button> */}



            {/* </Form> */}



          </View>
          <View style={{ alignItems: 'center', margin: 10, bottom: 5 }}>
            <ScrollView>
              {this.state.finished === 0 ? (locationsText) : (<View><Text style={{ marginTop: 20, fontSize: 20, fontWeight: 'bold' }}>המשלוחים שאספת נמסרו</Text>
                {/* <Icon style={{alignSelf:'center',fontSize:50,color:'green'}} name='checkmark-circle-outline' /> */}
                <Image source={{ uri: 'https://s4.gifyu.com/images/icons8-check-all-unscreen.gif' }} style={{ width: 80, height: 80, alignSelf: 'center', marginBottom: 20 }} />
              </View>)}
            </ScrollView>
          </View>


          {this.state.finished !== 0 ? (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}><Button block style={{ backgroundColor: '#ffed4b', borderWidth: 1, borderColor: 'black', borderRadius: 5, width: 120, marginTop: 5, marginRight: 5 }} onPress={() => { this.props.navigation.navigate('Home') }}>
            <Text style={{ color: 'black', fontWeight: 'bold' }}>חזור למסך הבית</Text>
          </Button>
            <Button block style={{ backgroundColor: 'grey', borderWidth: 1, borderColor: 'black', borderRadius: 5, width: 120, marginTop: 5, marginLeft: 5 }} onPress={() => { this.props.navigation.navigate('NewExpressRoute') }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>בחר תחנה אחרת</Text>
            </Button>

          </View>) : (<View></View>)}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = ({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
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
  , button: {
    backgroundColor: 'green'
  }

});
