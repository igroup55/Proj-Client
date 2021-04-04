import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
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
      SStationName: '',
      EStationName: '',
      StartStation: null,
      EndStation: null,
      Pweight: null,
      UserId: null,
      DeliveryID: null,
      Pressed: false,
      ButtonStyle:null,
      PackagesList:[],
      latitude:0,
      longitude:0,
      stationLat:0,
      stationLong:0,
      error:null,
      canOpenLocker:0,
      UserCreditOBJ:[],
      TDPayment:25,
      
    }
  }

  async componentDidMount() {

    { this.getData() }

    let values = await AsyncStorage.multiGet(['StartStation', 'EndStation', 'SStationName', 'EStationName', 'Pweight'])
    this.setState({ StartStation: values[0][1], EndStation: values[1][1], SStationName: values[2][1], EStationName: values[3][1], Pweight: values[4][1] })


    { this.getTDPackage() }

  }
  async getTDPackage() {

    const apiTDUser1Url = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?UserID=' + this.state.UserId;
    const responseweight = await fetch(apiTDUser1Url);
    const TDArrival1data = await responseweight.json()
    console.log(TDArrival1data.Pweight)
    this.setState({
      Pweight: TDArrival1data.Pweight,
      DeliveryID: TDArrival1data.DeliveryID
    })

    const apiTDUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight=' + this.state.Pweight;
    const response = await fetch(apiTDUserUrl);
    const TDArrivaldata = await response.json()
    this.setState({PackagesList:TDArrivaldata})
    this.setState({ PackageID: TDArrivaldata[0]["PackageId"], StartStation: TDArrivaldata[0]["StartStation"], EndStation: TDArrivaldata[0]["EndStation"] })

    const apiGetLocker = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers/{PackageID}?PackageID=' + this.state.PackageID;
    const responseLocker = await fetch(apiGetLocker);
    const TDLocker = await responseLocker.json()
    console.log(TDLocker)

    if (TDLocker[0]["StationID"] === this.state.StartStation) {
      this.setState({ SLockerID: TDLocker[0]["LockerID"] });
      this.setState({ ELockerID: TDLocker[1]["LockerID"] });
    }
    else {
      this.setState({ SLockerID: TDLocker[1]["LockerID"] });
      this.setState({ ELockerID: TDLocker[0]["LockerID"] })
    }

    console.log(this.state.SLockerID)
    console.log(this.state.ELockerID)

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
  }


  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
      this.setState({ UserName: UserDetails.FullName })
      this.setState({ UserId: UserDetails.UserId })
      console.log(UserDetails.UserId)
      this.getUserCredits();

    } catch (e) {
      alert('Error get Item')
      // error reading value
    }
  }

  async getUserCredits(){
    //קבלת פרטי קרדיטים של משתמש
      console.log("in usercredits before fetch")
       console.log(this.state.UserId)
       const UserID= this.state.UserId;
        const apiUserCreditsUrl ='http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits?UserID='+UserID;
        const response2 = await fetch(apiUserCreditsUrl);
        const UCdata = await response2.json()
        this.setState({UserCreditOBJ:UCdata,})
        
        console.log("in usercredits after fetch")
    
      }

      ///////////////עדכון טרנזקציות תשלום//////////////////

 UpdateTDCredits(){
  let FullName = this.state.UserCreditOBJ[0].FullName;
  let selfCredit= this.state.UserCreditOBJ[0].Credit;
  let UserId = this.state.UserId;
  let TDpayment=this.state.TDPayment;
  // let systemPayment =Number(selfCredit)-TDpayment;
  let TDGetPayment =Number(selfCredit)+TDpayment;

  // const UserCredits1={
  //   UserId:1,
  //   FullName:"JestApp System",
  //   Credit:systemPayment
  // }
  const UserCredits2={
    UserId:UserId,
    FullName:FullName,
    Credit:TDGetPayment
  }
  const date= new Date();
  const Transaction={
    UserID1:1,
    UserID2:this.state.UserId,
    CreditAmount:TDpayment,
    TransactionDate:date,
  }
  {/*לשים לב שהניתוב הוא ל tar 2 */}
  fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Transaction', {
      method: 'POST',
      body: JSON.stringify(Transaction),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })
      .then(
        fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits', {
          method: 'PUT',
          body: JSON.stringify(UserCredits2),
          headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
          })
        })
      )
      // .then(
      //   fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits', {
      //     method: 'PUT',
      //     body: JSON.stringify(UserCredits2),
      //     headers: new Headers({
      //       'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      //     })
      //   })
      // )
      .then(
     
        alert('תודה '+this.state.UserCreditOBJ[0].FullName +' החבילה הופקדה  !'),
        this.props.navigation.navigate('Home')

      )

}

////////////////////////////////////////////////////////

  PickUp() {
    this.setState({ Pressed: !this.state.Pressed })


    const Slocker_update = {

      LockerID: this.state.SLockerID,
      PackageID: -1,
      Busy: 0,


    }


    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(Slocker_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    // const Elocker_update = {

    //   LockerID: this.state.ELockerID,
    //   PackageID: this.state.PackageID,
    //   Busy: 1

    // }



    // fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
    //   method: 'PUT',
    //   body: JSON.stringify(Elocker_update),
    //   headers: new Headers({
    //     'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
    //   })
    // })

    { this.UpdatePackageStatus() }



  }

  UpdatePackageStatus() {

    const Package_update = {


      PackageID: this.state.PackageID,
      Status: 3

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
      method: 'PUT',
      body: JSON.stringify(Package_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    { this.UpdateTDUserPack() }
  }

  UpdateTDUserPack() {



    const TDPackage_update = {


      PackageID: this.state.PackageID,
      DeliveryID: this.state.DeliveryID,
      Status:1
  
    }

 
  
    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
      method: 'PUT',
      body: JSON.stringify(TDPackage_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
  
      })
    })

 if(this.state.PackagesList.length === 1){

  const TD1Package_update = {
    EndStation:this.state.EndStation,
    StartStation:this.state.StartStation,
    Pweight:this.state.Pweight,
    Status:-1

  }

  fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
    method: 'PUT',
    body: JSON.stringify(TD1Package_update),
    headers: new Headers({
      'Content-type': 'application/json; charset=UTF-8'

    })
  })
 }
 else{
  const TD1Package_update = {
    EndStation:this.state.EndStation,
    StartStation:this.state.StartStation,
    Pweight:this.state.Pweight,
    Status:0

  }

  fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
    method: 'PUT',
    body: JSON.stringify(TD1Package_update),
    headers: new Headers({
      'Content-type': 'application/json; charset=UTF-8'

    })
  })
  alert("החבילה נאספה מהלוקר !!");

 }
  
    
  
  

  }
  

   
 

   Deposit () {

    //this.setState({ Pressed: !this.state.Pressed })

    const UpdateRating = {
      StartStation: this.state.StartStation,
      EndStation: this.state.EndStation ,
      Pweight: this.state.Pweight,
      UserID: this.state.UserId ,
      
          }
      
      
          fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser/{Rating}', {
            method: 'PUT',
            body: JSON.stringify(UpdateRating),
            headers: new Headers({
              'Content-type': 'application/json; charset=UTF-8'
        
            })
          })

    const Package_update = {


      PackageID: this.state.PackageID,
      Status: 4

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
      method: 'PUT',
      body: JSON.stringify(Package_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    alert('החבילה הופקדה בהצלחה')
    this.UpdateTDCredits()

  }




  CancelPackage() {

    const Package_cancel = {


      PackageID: this.state.PackageID,
      Status: -1

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
      method: 'PUT',
      body: JSON.stringify(Package_cancel),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    const SLocker_cancel = {

      LockerID: this.state.SLockerID,
      PackageID: -1,
      Busy: 0

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(SLocker_cancel),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    const ELocker_cancel = {

      LockerID: this.state.ELockerID,
      PackageID: -1,
      Busy: 0

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(ELocker_cancel),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })


    this.props.navigation.navigate('Home');


  }

  render() {

    if (this.state.Pressed === true) {
    var button =  <Button  onPress={() => { this.Deposit() }}  block success style={{ marginRight: 90, marginLeft: 90, marginBottom: 15, marginTop: 20, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
        <Text style={{ fontWeight: 'bold' }}>הפקד חבילה</Text>
      </Button>
     

    }
    else {

    var button =  <Button onPress={() => { this.PickUp() }} block danger style={{ marginRight: 90, marginLeft: 90, marginBottom: 15, marginTop: 20, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
        <Text style={{ fontWeight: 'bold' }}>איסוף חבילה</Text>
      </Button>
     
     
  }
   

    return (
      <View style={styles.container}>
        <Image


          source={{ uri: 'https://s4.gifyu.com/images/icons8-check-all-unscreen.gif' }}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />
        <Text style={styles.greeting}>{this.state.UserName},</Text>
        <Text style={styles.greeting}>  החבילה מחכה לך לאיסוף </Text>


        <View style={{ borderWidth: 2, backgroundColor: 'lightblue', direction: 'rtl', padding: 20, marginBottom: 30, borderRadius: 20 }}>
          <Text style={styles.titles}>  משלוח מס' :</Text><Text style={styles.titles}> {this.state.PackageID} </Text>
          <Text style={styles.titles} > תחנה : </Text><Text style={styles.titles}> {this.state.SStationName} </Text>
        </View>
        <Text style={styles.titles} >- נא לגשת ללוקר מס' {this.state.SLockerID} לאיסוף -</Text>

             {button}

        {/* <Button onPress={()=>{this.CancelPackage()}} block danger style={{ marginRight: 40 ,marginLeft:40, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
          <Text style={{ fontWeight: 'bold' }}>ביטול משלוח</Text>
        </Button> */}

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

