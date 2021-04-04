import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity ,Dimensions} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'native-base';
import CCSenderForm from './CCSenderForm';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps'
import * as Location from 'expo-location';

export default class CCLockers extends Component {

  constructor(props) {
    super(props);
    this.state = {

      UserName: null,
      SLockerID: null,
      ELockerID: null,
      PackageID: null,
      StationName: '',
      latitude:0,
      longitude:0,
      stationLat:0,
      stationLong:0,
      error:null,
      canOpenLocker:0
    }
  }

  async componentDidMount() {

    this.getMultiple()
    this.getData()
    ///current location function
    navigator.geolocation.getCurrentPosition(position =>{this.setState({
      latitude:position.coords.latitude,
      longitude:position.coords.longitude,
      error:null
    });
  },
  error => this.setState({error:error.message}),
  {enableHighAccuracy:true,timeout:20000,maximumAge:2000}
  );
  // console.log(this.state.longitude+" , "+this.state.longitude+" , "+this.state.stationLat+" , "+this.state.stationLong);
  }

  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
      this.setState({ UserName: UserDetails.FullName })

    } catch (e) {
      alert('Error get Item')
      // error reading value
    }
  }

  async getMultiple() {


    try {

      let values = await AsyncStorage.multiGet(['PackageID', 'SLockerID', 'StationName', 'ELockerID'])
      let locationValues = await AsyncStorage.multiGet(['stationLat', 'stationLong']);
      this.setState({ SLockerID: values[1][1], PackageID: values[0][1], StationName: values[2][1], ELockerID: values[3][1] })
      this.setState({stationLat:locationValues[0][1]})
      this.setState({stationLong:locationValues[1][1]})

    } catch (e) {
      // read error
    }



    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  }
//Location Distance Calculation Functions

isNearLocker(){
  const NearDistance=0.1;
  let currentLat= this.state.latitude;
  let currentLong= this.state.longitude;
  let stationLat = this.state.stationLat;
  let stationLong = this.state.stationLong;
  let CurrentDistance= 0;
 CurrentDistance= this.computeDistance([currentLat,currentLong],[stationLat,stationLong]);
  console.log("your distance from the station is :"+CurrentDistance + " km");
  if(CurrentDistance >= NearDistance){
    alert("אתה נמצא בקרבת הלוקר !!");
    this.setState({canOpenLocker:1})

  }
  else{
    alert("אינך נמצא בקרבת הלוקר !!");
  }
  

}
//שימוש בנוסחאת האברסין לחישוב מרחק בין 2 נקודות בעלות נקודות אורך ורוחב
computeDistance([prevLat, prevLong], [lat, long]) {
  const prevLatInRad = this.toRad(prevLat);
  const prevLongInRad =this.toRad(prevLong);
  const latInRad = this.toRad(lat);
  const longInRad = this.toRad(long);

  return (
    // In kilometers
   6377.830272 * Math.acos(Math.sin(prevLatInRad) * Math.sin(latInRad) + Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
 
    )
  );
}

 toRad(angle) {
  return (angle * Math.PI) / 180;
}
//---------------------------------------
  PackDeposit() {

    const Slocker_update = {

      LockerID: this.state.SLockerID,
      PackageID: this.state.PackageID,
      Busy: 1,


    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(Slocker_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    const Elocker_update = {

      LockerID: this.state.ELockerID,
      PackageID: this.state.PackageID,
      Busy: 1

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(Elocker_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    {this.UpdatePackageStatus()}

  }

  UpdatePackageStatus (){

    const Package_update = {

     
      PackageID: this.state.PackageID,
      Status:2

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
      method: 'PUT',
      body: JSON.stringify(Package_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    alert('המשלוח הופקד בהצלחה ')
    this.props.navigation.navigate('Home')
  }

  CancelPackage (){

    const Package_cancel = {

     
      PackageID: this.state.PackageID,
      Status:-1

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
      method: 'PUT',
      body: JSON.stringify(Package_cancel),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    const SLocker_cancel = {

     LockerID:this.state.SLockerID ,
      PackageID: -1,
      Busy:0

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(SLocker_cancel),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    const ELocker_cancel = {

      LockerID:this.state.ELockerID ,
       PackageID: -1,
       Busy:0
 
     }
 
     fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
       method: 'PUT',
       body: JSON.stringify(ELocker_cancel),
       headers: new Headers({
         'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
       })
     }).then(
        this.props.navigation.navigate('Home')
     )

     
    


  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://s4.gifyu.com/images/icons8-check-all-unscreen.gif' }}
          style={{ width: 100, height: 100 , marginBottom:20 }}
        />
        <Text style={styles.greeting}>{this.state.UserName},</Text>
        <Text style={styles.greeting}>  המשלוח נוצר בהצלחה </Text>


<View style={{borderWidth:2,backgroundColor:'lightblue' , direction:'rtl' ,padding:20,marginBottom:30,borderRadius:20}}>
        <Text style={styles.titles}>  משלוח מס' :</Text><Text style={styles.titles}> {this.state.PackageID} </Text>
        <Text style={styles.titles} > תחנה : </Text><Text style={styles.titles}> {this.state.StationName} </Text>
  </View>
  {/* {} */}
  {this.state.canOpenLocker===0?(<View>
    <Text style={styles.titles} >בדוק מרחק מהתחנה</Text>
        <Button onPress={()=>{this.isNearLocker()}} block success style={{ marginRight: 90 ,marginLeft:90 ,marginBottom:15 , marginTop:20, paddingHorizontal:70,borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
          <Text style={{ fontWeight: 'bold' }}>בדיקה</Text>
        </Button>
  </View>):(<View><Text style={styles.titles} >- נא לגשת ללוקר מס' {this.state.SLockerID} להפקדה -</Text>
        <Button onPress={()=>{this.PackDeposit()}} block success style={{ marginRight: 90 ,marginLeft:90 ,marginBottom:15 , marginTop:20,borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
          <Text style={{ fontWeight: 'bold' }}>הפקד חבילה</Text>
        </Button></View>)}
  {/* <Text style={styles.titles} >בדוק מרחק מהלוקר</Text>
        <Button onPress={()=>{this.isNearLocker()}} block success style={{ marginRight: 90 ,marginLeft:90 ,marginBottom:15 , marginTop:20, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
          <Text style={{ fontWeight: 'bold' }}>בדיקה</Text>
        </Button> */}
  {/*  */}
        {/* <Text style={styles.titles} >- נא לגשת ללוקר מס' {this.state.SLockerID} להפקדה -</Text>
        <Button onPress={()=>{this.PackDeposit()}} block success style={{ marginRight: 90 ,marginLeft:90 ,marginBottom:15 , marginTop:20, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
          <Text style={{ fontWeight: 'bold' }}>הפקד חבילה</Text>
        </Button> */}

        <Button onPress={()=>{this.CancelPackage()}} block danger style={{ marginRight: 40 ,marginLeft:40, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
          <Text style={{ fontWeight: 'bold' }}>ביטול משלוח</Text>
        </Button>

      </View>
    )
  }
}




const styles = ({
  container: {
    flex: 1,
    backgroundColor: '#cbe8ba',
    alignItems: 'center',
    justifyContent: 'center',

  },
  Value: {
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



});

