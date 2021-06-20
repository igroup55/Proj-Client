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
import Geocoder from 'react-native-geocoding';
import { DrawerContentScrollView } from '@react-navigation/drawer';
// import Polyline from '@mapbox/polyline';


export default class CCExpressRecomendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
        errorMessage:'',
        location:'',      
        latitude: 0,
        longitude:0,
        locations:[],
        UserID:0,
        SelectedStation:0
        

    };
  }
  adressesGeocode= async ()=>{
 for (let index = 0; index < array.length; index++) {
   const element = array[index];
   
 }

      
  }
  async componentDidMount() {
   this.getLatLng();

    
    
    // const {locations: [sampleLocation] } = this.state
       // this.setState({desLastitude: sampleLocation.coords.latitude,
    //                desLongitude: sampleLocation.coords.longitude 
    // },this.mergeCoords)

  }
    getLatLng(){
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
    async getData(){
    try {


      
        console.log("In get ExpressData")
        let jsonValue = await AsyncStorage.getItem('UserId')
        jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
        this.setState({ UserID: UserDetails.UserId },()=>{console.log("ExpressUserID: "+this.state.UserID)})     
 
        let jsonValue2 = await AsyncStorage.getItem('XSstationID')
        jsonValue2 != null ? Station = JSON.parse(jsonValue2) : null;
        this.setState({ SelectedStation: Station },()=>{console.log("stationID: "+Station)})    

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
 async getStationID(){
   try{

   }
   catch(e){

   }
 }
 getAddresses=async()=>{
  
  const ExCustomerList = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Customers?UserID='+this.state.UserID+'&Elat='+this.state.latitude+'&Elng='+this.state.longitude+"&Station="+this.state.SelectedStation;
  const responseExCustomerList = await fetch(ExCustomerList);
  const dataEx = await responseExCustomerList.json()
  this.setState({ locations: dataEx },()=>console.log("my addresses are: "+this.state.locations));
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
    this.setState({errorMessage: 'Permission to access location was denied', });
    }
    let location = await Location.getCurrentPositionAsync({});
    // this.setState({ location });
    console.log(location);
    
    };

    btnReverseGC = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
    this.setState({ errorMessage: 'Permission to access location was denied', });
    }
    let location = await Location.getCurrentPositionAsync({});
    if (location) {
    let reverseGC = await Location.geocodeAsync("בן גוריון 25 זכרון יעקב");
    console.log({ reverseGC });
    console.log('the coords: '+reverseGC[0].latitude + ', '+ reverseGC[0].longitude);
    }else{
    alert('You must push the Location button first in order to get the location before you can get the reverse geocode for the latitude and longitude!');
    }
    };
    
    getRandomColor = () =>
{
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
}
  render() {
 
    let colorlist =[]
    let locations = this.state.locations.map((location, key) => {
      let color = this.getRandomColor();  
      console.log("color: "+color)   
      colorlist.push(color);
      return (<Marker key={key}
        coordinate={{ latitude: location.Latitude, longitude:location.Longitude }}
         title= {location.Address}     
        description={'name: '+location.FullName+ " Phone: "+location.PhoneNumber}
        pinColor={color}
      
      />)

    });
    let locationsText =this.state.locations.map((location, key) => {     
      let count = key+1
      console.log(colorlist[key]);
      return (<Text style={{color:colorlist[key],marginTop:5,marginBottom:5,fontSize:20,fontWeight:'bold'}} key={key}>{count+") "+location.Address} </Text>
     
      )
     
    });

    const { latitude,longitude,coords }=this.state
    return (
       <SafeAreaView>
        <ScrollView>
          <View style={{ borderTopColor: 'black', borderTopWidth: 2 ,backgroundColor:'lightyellow'}} >
           
            <Form style={{ width: 390}}>
             
              <View style={styles.section}>
                <Icon  name="navigate-circle-outline" style={{ alignSelf: 'center', margin: 10 ,fontSize:50  }} />
              </View>

              <View style={styles.container}>
                <MapView showsUserLocation region={{ latitude: this.state.latitude, longitude: this.state.longitude, longitudeDelta:0.0421, latitudeDelta:  0.0922 }} style={{ width: Dimensions.get('window').width, height: 350 }}
                >
                  <Marker
                    coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                    title='המיקום שלי :)'
                    description='אני כאן'
                  //image={require('../assets/icon.png')}
                  
                  />
                  {locations}
                </MapView>
              </View>
              <View style={{ alignItems: 'center' , backgroundColor:'white' , borderRadius:20 , borderWidth:1 , margin:10 , height:150}}>
                {locationsText}
              </View>
              <Button onPress={this.btnLocation} block success style={{ marginRight: 90, marginLeft: 90, marginBottom: 15, marginTop: 10, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} ><Text style={{ fontWeight: 'bold'}}>התחל נסיעה</Text></Button>
               

              {/* <Button onPress={this.navigate} style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 70, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}>  חפש חבילות </Text></Button> */}
              


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
      backgroundColor: 'lightyellow',
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
  