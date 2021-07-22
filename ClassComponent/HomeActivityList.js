import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Image, TouchableOpacity, Pressable, Modal } from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, View, Icon, Button } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native';
import { NavigationHelpersContext } from '@react-navigation/core';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import moment from 'moment';

export default class HomeActivityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActivityList1: [],
      UserID: 0,
      ActivityList2: [],
      ActivityList3: [],
      AlertModal: '',
      modalVisible: false,
      Slatitude: 0,
      Elatitude: 0,
      Slongitude: 0,
      Elongitude: 0,
      stationLat: 0,
      stationLong: 0,
      PackageID: null,
      SLockerID: 0,
      ELockerID: 0,
      StartStationId: 0,
      EndStationId: 0,
      Pweight: 0,
      TDUser: [],
      Status: 0,
      canOpenLocker: 0,
      DeliveryID: null,
      PackagesList: [],
      TDPayment: 0,
      UserCreditOBJ: [],
      PickUpDT: moment().format('YYYY-MM-DD hh:mm:ss a'),
      activityList: false,
      FutureDT: moment().format('YYYY-MM-DD hh:mm:ss a')
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible }, () => this.setState({ activityList: true }, () => this.setState({ activityList: false })));
  }

  async componentDidMount() {
    ////tar2 - url צריך לשנות אחרי שמעדכנים ל tar 1
    { this.getData() }


    // setInterval(()=>{
    //   this.getData()
    //       },10000)
    // 



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
  };

  UNSAFE_componentWillUpdate(props) {


    if (this.state.activityList == true)
      this.getData()

  }





  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;

      this.setState({ UserID: UserDetails.UserId });

      this.getFromServer();
    } catch (e) {
      // error reading value
      this.setState({
        AlertModal:
          <View>
            <Text style={{ textAlign: 'center', margin: 25 }}>Error get Item</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <Text style={styles.textStyle}> סגור </Text>
            </Pressable>
          </View>
      });
      { this.setModalVisible(true) }
    }
  }


  async getFromServer() {

    const ActivityListData = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity?UserID=' + this.state.UserID;
    const responseActivityList = await fetch(ActivityListData);
    const data = await responseActivityList.json()
    this.setState({ ActivityList1: data, })

    const ActivityListDataTD = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity/{ModuleActivityTD}/' + this.state.UserID;
    const responseActivityListTD = await fetch(ActivityListDataTD);
    const dataTD = await responseActivityListTD.json()
    this.setState({ ActivityList2: dataTD })


    console.log(this.state.ActivityList2)
    const ActivityListDataEx = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity/{ModuleActivity}/{Express}/' + this.state.UserID;
    const responseActivityListEx = await fetch(ActivityListDataEx);
    const dataEx = await responseActivityListEx.json()
    this.setState({ ActivityList3: dataEx })
    console.log('Express' + responseActivityListEx)



  }

  navigate = (key) => {
    if (key % 2 === 0)
      console.log(key)
  }



  PackDeposit(key) {

    const Slocker_update = {

      LockerID: this.state.SLockerID,
      PackageID: this.state.ActivityList1[key].PackageID,
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
      PackageID: this.state.ActivityList1[key].PackageID,
      Busy: 1

    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(Elocker_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    { this.UpdatePackageStatus(key) }

  }

  UpdatePackageStatus(key) {

    const Package_update = {

      PackageID: this.state.ActivityList1[key].PackageID,
      Status: 2,
    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
      method: 'PUT',
      body: JSON.stringify(Package_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })
    // this.setModalVisible(true) 
    // this.props.navigation.navigate('Home')
    // this.setState({ AlertModal: 'המשלוח הופקד בהצלחה ' })
    this.setState({
      AlertModal:
        <View>
          <Text style={{ textAlign: 'center', margin: 25, fontWeight: 'bold' }}>
            המשלוח הופקד בהצלחה
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setModalVisible(!this.state.modalVisible)}>
            <Text style={styles.textStyle}> סגור </Text>
          </Pressable>
        </View>
    });
    this.setModalVisible(true)
    // setTimeout(() => {
    //   this.props.navigation.navigate('Home');
    // }, 3000);

  }

  async Deposit(key) {

    //alert('packageID : ' + this.state.ActivityList1[key].PackageID + ' startstation : ' + this.state.ActivityList1[key].StartStation + ' EndStation : ' + this.state.ActivityList1[key].EndStation);


    // const apiPackagePricesUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?PackageId=' + this.state.ActivityList1[key].PackageID;
    // const response = await fetch(apiPackagePricesUrl);
    // const data = await response.json()
    // this.setState({
    //   StartStationId: data[0]["StartStation"],
    //   EndStationId: data[0]["EndStation"],
    //   SLockerID: data[0]["SLockerID"],
    //   ELockerID: data[0]["ELockerID"]
    // })
    // alert(this.state.SLockerID + ' -- ' + this.state.ELockerID)


    const apiCoordsStartStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Stations?stationID=' + this.state.StartStationId;
    const Sresponse = await fetch(apiCoordsStartStationsUrl);
    const Sdata = await Sresponse.json()
    this.setState({
      SLatitude: Sdata[0].Latitude,
      Slongitude: Sdata[0].Longitude
    });

    const NearDistance = 0.1;
    let currentLat = this.state.latitude;
    let currentLong = this.state.longitude;
    let stationLat = this.state.Slatitude;
    let stationLong = this.state.Slongitude;
    let CurrentDistance = 0;
    CurrentDistance = this.computeDistance([currentLat, currentLong], [stationLat, stationLong]);
    console.log("your distance from the station is :" + CurrentDistance + " km");
    if (CurrentDistance >= NearDistance) {
      this.setState({
        AlertModal:

          <View>
            <Text style={{ textAlign: 'center', margin: 25, fontWeight: 'bold' }}>
              אתה נמצא בקרבת הלוקר !!
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <Text style={styles.textStyle}> סגור </Text>
            </Pressable>
          </View>

      });
      { this.setModalVisible(true) }
      this.setState({ canOpenLocker: 1 })
      this.PackDeposit(key);
    }
    else {
      this.setState({
        AlertModal:
          <View>
            <Text style={{ textAlign: 'center', margin: 25, fontWeight: 'bold' }}>
              אינך נמצא בקרבת הלוקר !!
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <Text style={styles.textStyle}> סגור </Text>
            </Pressable>
          </View>
      });
      { this.setModalVisible(true) }
    }
  }

  computeDistance([prevLat, prevLong], [lat, long]) {
    const prevLatInRad = this.toRad(prevLat);
    const prevLongInRad = this.toRad(prevLong);
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




  //-------------------------------------------------------------------------------------------------------------------------------------------//


  async getStationsList() {

    const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Stations';
    const response = await fetch(apiStationsUrl);
    const data = await response.json()
    //this.setState({ StationsList: data }) 
    data.map(StartS => {
      if (this.state.ActivityList2[0].StartStation === StartS.StationName)
        this.setState({ StartStationId: StartS.StationID })
    });


    data.map(EndS => {
      if (this.state.ActivityList2[0].EndStation === EndS.StationName)
        this.setState({ EndStationId: EndS.StationID })
    });

    { this.getTDPackage() }

  }

  async getTDPackage() {

    const apiTDUser1Url = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?UserID=' + this.state.UserID;
    const responseweight = await fetch(apiTDUser1Url);
    const TDArrival1data = await responseweight.json()

    this.setState({
      Pweight: TDArrival1data.Pweight,
      DeliveryID: TDArrival1data.DeliveryID
    })

    const apiTDUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStationId + '&endStation=' + this.state.EndStationId + '&Pweight=' + this.state.Pweight + '&express= false';
    const response = await fetch(apiTDUserUrl);
    const TDArrivaldata = await response.json()

    this.setState({ PackagesList: TDArrivaldata })
    this.setState({ PackageID: TDArrivaldata[0]["PackageId"], StartStationId: TDArrivaldata[0]["StartStation"], EndStationId: TDArrivaldata[0]["EndStation"] })


    const apiGetLocker = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers/{PackageID}?PackageID=' + this.state.PackageID;
    const responseLocker = await fetch(apiGetLocker);
    const TDLocker = await responseLocker.json()

    if (TDLocker[0]["StationID"] === this.state.StartStationId) {
      this.setState({
        SLockerID: TDLocker[0]["LockerID"],
        ELockerID: TDLocker[1]["LockerID"]
      });
    }
    else {
      this.setState({
        SLockerID: TDLocker[1]["LockerID"],
        ELockerID: TDLocker[0]["LockerID"]
      });
    }


    ///current location function
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        Slatitude: position.coords.latitude,
        Elongitude: position.coords.longitude,
        error: null
      });
    },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );

    { this.TDPickUp() }
  }


  async TDPickUp(key) {


    const PossiblePickupUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?StartStation=' + this.state.ActivityList2[0].StartStation + '&EndStation=' + this.state.ActivityList2[0].EndStation + '&UserId=' + this.state.UserID;
    const responseIfPossible = await fetch(PossiblePickupUrl);
    const IsInterested = await responseIfPossible.json()

    const PackagesFoundUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStationId + '&endStation=' + this.state.EndStationId + '&Pweight= -1';
    const response = await fetch(PackagesFoundUrl);
    const data = await response.json()

    const apiTDUser1Url = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?UserID=' + this.state.UserID;
    const responseweight = await fetch(apiTDUser1Url);
    const TDArrival1data = await responseweight.json()
    this.setState({
      Pweight: TDArrival1data.Pweight,
      DeliveryID: TDArrival1data.DeliveryID
    })


    const apiTDUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStationId + '&endStation=' + this.state.EndStationId + '&Pweight=' + this.state.Pweight + '&express= false';
    const response1 = await fetch(apiTDUserUrl);
    const TDArrivaldata = await response1.json()
    this.setState({ StartStationId: TDArrivaldata[0]["StartStation"] })


    const apiCoordsStartStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Stations?stationID=' + this.state.StartStationId;
    const Sresponse = await fetch(apiCoordsStartStationsUrl);
    const Sdata = await Sresponse.json()
    this.setState({
      SLatitude: Sdata[0].Latitude,
      Slongitude: Sdata[0].Longitude
    });

    if (data.length !== 0) {
      if (IsInterested === 0) {
        this.setState({ AlertModal: "אינך מתעניין בחבילה במסלול זה" });
        { this.setModalVisible(true) }
      }
      else {
        this.isNearLocker();
        if (this.state.canOpenLocker === 1) { this.PickUp() }
      }
    }
    else {
      this.setState({ AlertModal: "אין חבילות במסלול שנבחר" });
      { this.setModalVisible(true) }
    }

  }

  isNearLocker() {

    const NearDistance = 0.1;
    let currentLat = this.state.latitude;
    let currentLong = this.state.longitude;
    let stationLat = this.state.Slatitude;
    let stationLong = this.state.Slongitude;
    let CurrentDistance = 0;
    CurrentDistance = this.computeDistance([currentLat, currentLong], [stationLat, stationLong]);
    console.log("your distance from the station is :" + CurrentDistance + " km");
    if (CurrentDistance >= NearDistance) {
      this.setState({ canOpenLocker: 1 })
    }
    else {
      this.setState({
        AlertModal:
          <View>
            <Text style={{ textAlign: 'center', margin: 25, fontWeight: 'bold' }}>
              אינך נמצא בקרבת הלוקר !!
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => this.setModalVisible(!this.state.modalVisible)}>
              <Text style={styles.textStyle}> סגור </Text>
            </Pressable>
          </View>
      });
      { this.setModalVisible(true) }
    }
  }
  //שימוש בנוסחאת האברסין לחישוב מרחק בין 2 נקודות בעלות נקודות אורך ורוחב


  PickUp() {

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

    { this.UpdateTDPackageStatus() }

  }

  UpdateTDPackageStatus() {


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


    this.setState({
      PickUpDT: moment()
        .utcOffset('+05:30')
        .format('YYYY-MM-DD hh:mm:ss a')
    })


    const TDPackage_update = {
      PackageID: this.state.PackageID,
      DeliveryID: this.state.DeliveryID,
      Status: 1,
      PickUpDT: this.state.PickUpDT
    }
    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
      method: 'PUT',
      body: JSON.stringify(TDPackage_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
    if (this.state.PackagesList.length === 1) {

      const TD1Package_update = {
        EndStation: this.state.EndStationId,
        StartStation: this.state.StartStationId,
        Pweight: this.state.Pweight,
        Status: -1
      }
      fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
        method: 'PUT',
        body: JSON.stringify(TD1Package_update),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      })
    }
    else {
      const TD1Package_update = {
        EndStation: this.state.EndStationId,
        StartStation: this.state.StartStationId,
        Pweight: this.state.Pweight,
        Status: 0
      }
      fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
        method: 'PUT',
        body: JSON.stringify(TD1Package_update),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        })
      })
    }
    this.setState({
      AlertModal:
        <View>
          <Text style={{ textAlign: 'center', margin: 25, fontWeight: 'bold' }}>
            החבילה נאספה מהלוקר !!
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setModalVisible(!this.state.modalVisible)}>
            <Text style={styles.textStyle}> סגור </Text>
          </Pressable>
        </View>
    });


    { this.setModalVisible(true) }


  }


  async TDDeposit(Key) {

    // alert('packageID : ' + this.state.ActivityList2[key].PackageID + ' startstation : ' + this.state.ActivityList2[key].StartStation + ' EndStation : ' + this.state.ActivityList2[Key].EndStation);

    const apiPackagePricesUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?PackageId=' + this.state.ActivityList2[0].PackageID;
    const response = await fetch(apiPackagePricesUrl);
    const data = await response.json()
    this.setState({
      StartStationId: data[0]["StartStation"],
      EndStationId: data[0]["EndStation"],
      SLockerID: data[0]["SLockerID"],
      ELockerID: data[0]["ELockerID"],
      Pweight: data[0]["Pweight"],
      PackageID: data[0]["PackageId"]
    })

    const UpdateRating = {
      StartStationId: this.state.StartStation,
      EndStationId: this.state.EndStation,
      Pweight: this.state.Pweight,
      UserID: this.state.UserID,
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

    //this.setState({ AlertModal: 'החבילה הופקדה בהצלחה' });
    //{ this.setModalVisible(true) }

    { this.UpdateTDStatus() }
  }

  async UpdateTDStatus() {



    //console.log(this.state.ActivityList2[0].UserID1)
    const apiTDUser1Url = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser/{GetDeliveryId}?UserId=' + this.state.ActivityList2[0].UserID1;
    const responseweight = await fetch(apiTDUser1Url);
    const TDArrival1data = await responseweight.json()
    console.log(' ----' + TDArrival1data)
    this.setState({
      DeliveryID: TDArrival1data[0].DeliveryID
    })
    console.log(TDArrival1data[0].DeliveryID)

    console.log(this.state.PackageID)

    const TD1Package_update = {
      PackageID: this.state.PackageID,
      DeliveryID: this.state.DeliveryID,
      Status: 2
    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
      method: 'PUT',
      body: JSON.stringify(TD1Package_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
    console.log('bye')


    this.getPrice();

  }


  async getPrice() {

    const apiPackagePricesUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?PackageId=' + this.state.PackageID;
    const response = await fetch(apiPackagePricesUrl);
    const data = await response.json()
    this.setState({ TDPayment: data[0]["Price"] })

    this.getUserCredits()

  }

  async getUserCredits() {
    //קבלת פרטי קרדיטים של משתמש
    const UserID = this.state.UserID;
    const apiUserCreditsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits?UserID=' + UserID;
    const response2 = await fetch(apiUserCreditsUrl);
    const UCdata = await response2.json()
    this.setState({ UserCreditOBJ: UCdata, })
    this.UpdateTDCredits()
  }


  UpdateTDCredits() {


    let FullName = this.state.UserCreditOBJ[0].FullName;
    let selfCredit = this.state.UserCreditOBJ[0].Credit;
    let UserId = this.state.UserID;


    // let systemPayment =Number(selfCredit)-TDpayment;
    let TDGetPayment = Number(selfCredit) + this.state.TDPayment;

    const UserCredits2 = {
      UserId: UserId,
      FullName: FullName,
      Credit: TDGetPayment
    }
    const date = new Date();
    const Transaction = {
      UserID1: 1,
      UserID2: this.state.UserID,
      CreditAmount: this.state.TDPayment,
      TransactionDate: date,
    }


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

      // )
      .then(
        this.setState({
          AlertModal:
            <View>
              <Text style={{ textAlign: 'center', margin: 25, fontWeight: 'bold' }}>
                תודה {this.state.UserCreditOBJ[0].FullName} החבילה הופקדה !
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                <Text style={styles.textStyle}> סגור </Text>
              </Pressable>
            </View>
        }),
        this.setModalVisible(true),
        // setTimeout(() => {
        //   this.props.navigation.navigate('Home');
        // }, 3000),
      )
    this.getFutureDT();
  }


  async getFutureDT() {

    const apiPackaegs = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStationId + '&endStation=' + this.state.EndStationId;
    const response = await fetch(apiPackaegs);
    const PackagesList = await response.json()
    this.setState({
      ExistPackages: PackagesList
    }, () => console.log(PackagesList))



    const api1 = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser/{GetDate}?startStation=' + this.state.StartStationId + '&endStation=' + this.state.EndStationId + '&UserId=' + this.state.UserID + '&PickUpDT=' + this.state.PickUpDT;
    const response1 = await fetch(api1);
    const data = await response1.json();
    //console.log(data+' last : '+data[data.length-1]["PickUpDT"]+' last 1 : '+data[data.length-1].PickUpDT );
    console.log(data)
    this.setState({
      FutureDT: data[data.length - 1].PickUpDT,
    }, () => console.log(this.state.FutureDT));

    if (PackagesList.length != 0 && data != null) {
      this.UpdateDTUser()
    }

  }








  UNSAFE_componentWillReceiveProps(props) {

    if (props.activityList == true)
      this.getData()
  }

  async getLocker(Key) {

    const apiPackagePricesUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?PackageId=' + this.state.ActivityList1[Key].PackageID;
    const response = await fetch(apiPackagePricesUrl);
    const data = await response.json()
    this.setState({
      StartStationId: data[0]["StartStation"],
      EndStationId: data[0]["EndStation"],
      SLockerID: data[0]["SLockerID"],
      ELockerID: data[0]["ELockerID"]
    }, () => this.ShowModal(Key))

  }

  ShowModal(Key) {

    if (this.state.ActivityList1[Key].Status === 1) {
      var statustitle = <Text> ממתין להפקדה </Text>
      var button = <TouchableOpacity onPress={() => { this.Deposit(Key) }} style={[styles.button, styles.buttonClose]}
      >
        <Text style={styles.textStyle} > הפקד </Text>
      </TouchableOpacity>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר מוצא : {this.state.SLockerID}</Text>
    }
    if (this.state.ActivityList1[Key].Status === 2) {
      var statustitle = <Text> הופקד וממתין לאיסוף </Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר מוצא : {this.state.SLockerID}</Text>

    }
    if (this.state.ActivityList1[Key].Status === 3) {
      var statustitle = <Text> בדרך ליעד </Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר מוצא : {this.state.SLockerID}</Text>

    }
    if (this.state.ActivityList1[Key].Status === 4) {
      var statustitle = <Text> החבילה הופקדה ביעד </Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר יעד : {this.state.ELockerID}</Text>

    }

    if (this.state.ActivityList1[Key].Status === 5) {
      var statustitle = <Text> ממתין לאיסוף שליח אקספרס </Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר יעד : {this.state.ELockerID}</Text>
    }
    if (this.state.ActivityList1[Key].Status === 6) {
      var statustitle = <Text> החבילה בדרך ללקוח </Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר יעד : {this.state.ELockerID}</Text>
    }
    if (this.state.ActivityList1[Key].Status === 7) {
      var statustitle = <Text> החבילה נמסרה ללקוח </Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר יעד : {this.state.ELockerID}</Text>
    }

    this.setState({
      AlertModal: (
        <View style={{ flex: 1 }}>
          <Text style={styles.Packdetails}>מספר חבילה : {this.state.ActivityList1[Key].PackageID}</Text>
          <Text style={styles.Packdetails}>תחנת מוצא : {this.state.ActivityList1[Key].StartStation}</Text>
          <Text style={styles.Packdetails}>תחנת יעד : {this.state.ActivityList1[Key].EndStation}</Text>
          {Locker}
          <Text style={styles.Packdetails} > סטטוס : {statustitle}</Text>
          <Text></Text>

          {button}

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => this.setModalVisible(!this.state.modalVisible)}>
            <Text style={styles.textStyle}> סגור </Text>
          </Pressable>
        </View>)
    });
    { this.setModalVisible(true) }
  }



  async getTDLocker(key) {

    if (this.state.ActivityList2[key].Status != 0 && this.state.ActivityList2[key].Status != -1) {
      console.log(this.state.ActivityList2[key])
      const apiPackagePricesUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?PackageId=' + this.state.ActivityList2[key].PackageID;
      const response = await fetch(apiPackagePricesUrl);
      const data = await response.json()
      this.setState({
        StartStationId: data[0]["StartStation"],
        EndStationId: data[0]["EndStation"],
        SLockerID: data[0]["SLockerID"],
        ELockerID: data[0]["ELockerID"],
        Pweight: data[0]["Pweight"],
        PackageID: data[0]["PackageId"]
      }, () => this.ShowTDModal(key))
    }
    else {
      if (this.state.ActivityList2[key].Status != -1) {
        const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Stations';
        const response1 = await fetch(apiStationsUrl);
        const data1 = await response1.json()
        //this.setState({ StationsList: data }) 
        data1.map(StartS => {
          if (this.state.ActivityList2[0].StartStation === StartS.StationName)
            this.setState({ StartStationId: StartS.StationID })
        });
        data1.map(EndS => {
          if (this.state.ActivityList2[0].EndStation === EndS.StationName)
            this.setState({ EndStationId: EndS.StationID })
        });

        const apiTDUser1Url = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?UserID=' + this.state.UserID;
        const responseweight = await fetch(apiTDUser1Url);
        const TDArrival1data = await responseweight.json()

        this.setState({
          Pweight: TDArrival1data.Pweight,
          DeliveryID: TDArrival1data.DeliveryID
        })

        const apiTDUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStationId + '&endStation=' + this.state.EndStationId + '&Pweight=' + this.state.Pweight + '&express= false';
        const response = await fetch(apiTDUserUrl);
        const TDArrivaldata = await response.json()

        this.setState({ PackagesList: TDArrivaldata })
        this.setState({ PackageID: TDArrivaldata[0]["PackageId"], StartStationId: TDArrivaldata[0]["StartStation"], EndStationId: TDArrivaldata[0]["EndStation"] })


        const apiGetLocker = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers/{PackageID}?PackageID=' + this.state.PackageID;
        const responseLocker = await fetch(apiGetLocker);
        const TDLocker = await responseLocker.json()

        console.log(TDLocker[0]["StationID"]);
        if (TDLocker[0]["StationID"] === this.state.StartStationId) {
          console.log('Slocker')
          this.setState({
            SLockerID: TDLocker[0]["LockerID"],
            ELockerID: TDLocker[1]["LockerID"]
          }, () => this.ShowTDModal(key));
        }
        else {
          this.setState({
            SLockerID: TDLocker[1]["LockerID"],
            ELockerID: TDLocker[0]["LockerID"]
          }, () => this.ShowTDModal(key));
        }
      }
      else {
        this.ShowTDModal(key)
      }

    }
  }

  ShowTDModal(key) {

    if (this.state.ActivityList2[key].Status === 0) {
      var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/orange-circle-emoji.png' }} />
      var statustitle = <Text> ממתין לאיסוף </Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר מוצא : {this.state.SLockerID}</Text>
      var Button = <TouchableOpacity onPress={() => { this.getStationsList(key) }} style={[styles.button, styles.buttonClose]}
      >
        <Text style={styles.textStyle} > איסוף </Text>
      </TouchableOpacity>
    }
    if (this.state.ActivityList2[key].Status === 1) {
      var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/yellow-circle-emoji.png' }} />
      var statustitle = <Text> חבילה נאספה </Text>
      var Button = <TouchableOpacity onPress={() => { this.TDDeposit(key) }} style={[styles.button, styles.buttonClose]}
      >
        <Text style={styles.textStyle} > הפקד </Text>
      </TouchableOpacity>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר יעד : {this.state.ELockerID}</Text>
      var PackageId = <Text style={styles.Packdetails}>מספר חבילה : {this.state.ActivityList2[key].PackageID}</Text>
    }
    if (this.state.ActivityList2[key].Status === -1) {
      var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/red-circle-emoji.png' }} />
      var statustitle = <Text> הסתיים </Text>
    }
    if (this.state.ActivityList2[key].Status === 2) {
      var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/green-circle-emoji.png' }} />
      var statustitle = <Text> החבילה הופקדה ביעד </Text>
      var PackageId = <Text style={styles.Packdetails}>מספר חבילה : {this.state.ActivityList2[key].PackageID}</Text>
      var Locker = <Text style={styles.Packdetails}>מספר לוקר יעד : {this.state.ELockerID}</Text>

    }
    var ArrowIcon = <Icon type="FontAwesome" color="#000" name="arrow-left" />
    this.setState({
      AlertModal: (
        <View>
          {PackageId}
          <Text style={styles.Packdetails} >{this.state.ActivityList2[key].StartStation}     {ArrowIcon}     {this.state.ActivityList2[key].EndStation}</Text>
          {Locker}
          <Text style={styles.Packdetails} > סטטוס : {statustitle}</Text>
          <Text></Text>
          <View>

            {Button}

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => this.setModalVisible(!this.state.modalVisible)}
            >
              <Text style={styles.textStyle}> סגור </Text>
            </Pressable>
          </View>
        </View>)
    }, () => console.log('td status : ' + this.state.ActivityList2[key].Status)
    );
    { this.setModalVisible(true) }


  }



  render() {

    let Activities = this.state.ActivityList1.map((Activities, key) => {
      if (Activities.Status === 1) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/red-circle-emoji.png' }} />
      }
      if (Activities.Status === 2) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/orange-circle-emoji.png' }} />
      }
      if (Activities.Status === 3) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/yellow-circle-emoji.png' }} />
      }
      if (Activities.Status === 4) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/green-circle-emoji.png' }} />
      }

      if (Activities.Status === 5) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://i.ibb.co/MRcYq76/green-circle-emoji.png' }} />
      }

      if (Activities.Status === 6) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://i.ibb.co/MRcYq76/green-circle-emoji.png' }} />
      }

      if (Activities.Status === 7) {
        var status = <Image style={{ width: 25, height: 25, marginRight: 20 }} source={{ uri: 'https://icon-library.com/images/icon-checked/icon-checked-8.jpg' }} />
      }

      return (<TouchableOpacity key={key}><ListItem avatar onPress={() => {
        this.getLocker(key)
        // this.setState({
        //   AlertModal: (
        //     <View>
        //       <Text style={[styles.Packdetails, { fontSize: 20 }]}>#{Activities.PackageID}</Text>
        //       <Text style={styles.Packdetails}>תחנת מוצא : {Activities.StartStation}</Text>
        //       <Text style={styles.Packdetails}>תחנת יעד : {Activities.EndStation}</Text>
        //       <Text style={styles.Packdetails}>לוקר מספר: {this.state.SLockerID}</Text>
        //       <Text style={styles.Packdetails} > סטטוס : {statustitle}</Text>
        //       <Text></Text>

        //       {button}

        //       <Pressable
        //         style={[styles.button, styles.buttonClose]}
        //         onPress={() => this.setModalVisible(!this.state.modalVisible)}>
        //         <Text style={styles.textStyle}> סגור </Text>
        //       </Pressable>
        //     </View>)
        // });
        // { this.setModalVisible(true) }
      }} ><Right><Thumbnail style={{ borderWidth: 1, borderColor: 'black' }} source={{ uri: 'https://i.ibb.co/vcgW6dB/Sender-Package.jpg' }} />
        </Right>
        <Body>

          <Text style={{ fontWeight: 'bold' }} note >מוצא :  {Activities.StartStation} </Text>
          <Text></Text>
          <Text style={{ fontWeight: 'bold' }} note >יעד :  {Activities.EndStation} </Text>
          {/* <TouchableOpacity style={{ fontWeight: 'bold' , marginTop:12 , marginBottom:5 , backgroundColor:'lightblue',width:85 , borderRadius:5,borderWidth:1 ,alignSelf:'center' }} ><Text> </Text></TouchableOpacity> */}
        </Body>
        <Left>
          {status}
        </Left>
      </ListItem></TouchableOpacity>)
    });

    let ActivitiesTD = this.state.ActivityList2.map((Activities, key) => {
      if (Activities.Status === 0) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/orange-circle-emoji.png' }} />
        var statustitle = <Text> ממתין לאיסוף </Text>
        var Button = <TouchableOpacity onPress={() => { this.getStationsList(key) }} style={[styles.button, styles.buttonClose]}
        >
          <Text style={styles.textStyle} > איסוף </Text>
        </TouchableOpacity>
      }
      if (Activities.Status === 1) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/yellow-circle-emoji.png' }} />
        var statustitle = <Text> חבילה נאספה </Text>
        var Button = <TouchableOpacity onPress={() => { this.TDDeposit(key) }} style={[styles.button, styles.buttonClose]}
        >
          <Text style={styles.textStyle} > הפקד </Text>
        </TouchableOpacity>
      }
      if (Activities.Status === -1) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/red-circle-emoji.png' }} />
        var statustitle = <Text> הסתיים </Text>
      }
      if (Activities.Status === 2) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/green-circle-emoji.png' }} />
        var statustitle = <Text> החבילה הופקדה ביעד </Text>
      }
      var ArrowIcon = <Icon type="FontAwesome" color="#000" name="arrow-left" />

      return (<TouchableOpacity key={key}><ListItem avatar onPress={() => {
        this.getTDLocker(key)
        // this.setState({
        //   AlertModal: (
        //     <View>
        //       <Text style={styles.Packdetails} >{Activities.StartStation}     {ArrowIcon}     {Activities.EndStation}</Text>
        //       <Text style={styles.Packdetails} > סטטוס : {statustitle}</Text>
        //       <Text></Text>
        //       <View>

        //         {Button}

        //         <Pressable
        //           style={[styles.button, styles.buttonClose]}
        //           onPress={() => this.setModalVisible(!this.state.modalVisible)}
        //         >
        //           <Text style={styles.textStyle}> סגור </Text>
        //         </Pressable>
        //       </View>
        //     </View>)
        // });
        // { this.setModalVisible(true) }
      }}   ><Right><Thumbnail style={{ borderWidth: 1, borderColor: 'black' }} source={{ uri: 'https://i.ibb.co/HHjzgtP/Delivery-TD.jpg' }} />
        </Right>

        <Body>
          <Text style={{ fontWeight: 'bold' }} note >מוצא :  {Activities.StartStation} </Text>
          <Text></Text>
          <Text style={{ fontWeight: 'bold' }} note >יעד :  {Activities.EndStation} </Text>

          {/* <TouchableOpacity style={{ fontWeight: 'bold' , marginTop:12 , marginBottom:5 , backgroundColor:'lightblue',width:120 , borderRadius:5,borderWidth:1 ,alignSelf:'center' }}><Text style={{textAlign:'center',fontWeight:'bold'}} >פרטים</Text></TouchableOpacity> */}

        </Body>
        <Left>
          {status}

        </Left>
      </ListItem></TouchableOpacity>)
    });

    let ActivitiesEx = this.state.ActivityList3.map((Activities, key) => {
      if (Activities.Status === 1) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/orange-circle-emoji.png' }} />
        var statustitle = <Text> ממתין לאיסוף </Text>
        var Button = <TouchableOpacity onPress={() => { this.getStationsList(key) }} style={[styles.button, styles.buttonClose]}
        >
          <Text style={styles.textStyle} > איסוף </Text>
        </TouchableOpacity>
      }
      if (Activities.Status === 2) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/yellow-circle-emoji.png' }} />
        var statustitle = <Text>החבילה בדרך ללקוח </Text>
        var Button = <TouchableOpacity onPress={() => { this.TDDeposit(key) }} style={[styles.button, styles.buttonClose]}
        >
          <Text style={styles.textStyle} > מסירה </Text>
        </TouchableOpacity>
      }
      if (Activities.Status === 3) {
        var status = <Image style={{ width: 30, height: 30, marginRight: 20 }} source={{ uri: 'https://img.icons8.com/emoji/50/000000/green-circle-emoji.png' }} />
        var statustitle = <Text> נמסר ללקוח </Text>
      }

      var ArrowIcon = <Icon type="FontAwesome" color="#000" name="arrow-left" />

      return (<TouchableOpacity key={key}><ListItem avatar onPress={() => {
        this.setState({
          AlertModal: (
            <View>
              <Text style={styles.Packdetails} >{Activities.StartStation}     {ArrowIcon}     {Activities.EndStation}</Text>
              <Text style={styles.Packdetails} > סטטוס : {statustitle}</Text>
              <Text></Text>
              <View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => this.setModalVisible(!this.state.modalVisible)}
                >
                  <Text style={styles.textStyle}> סגור </Text>
                </Pressable>
              </View>
            </View>)
        });
        { this.setModalVisible(true) }
      }}   ><Right>
          <Thumbnail style={{ borderWidth: 1, borderColor: 'black' }} source={{ uri: 'https://i.ibb.co/412FP2r/Delivery-Ex.jpg' }} />

        </Right>

        <Body>
          <Text style={{ fontWeight: 'bold' }} note >מוצא :  {Activities.StartStation} </Text>
          <Text style={{ fontWeight: 'bold' }} note >מחיר : </Text>
          <Text style={{ fontWeight: 'bold' }} note >יעד :  {Activities.EndStation} </Text>

          {/* <TouchableOpacity style={{ fontWeight: 'bold' , marginTop:12 , marginBottom:5 , backgroundColor:'lightblue',width:120 , borderRadius:5,borderWidth:1 ,alignSelf:'center' }}><Text style={{textAlign:'center',fontWeight:'bold'}} >פרטים</Text></TouchableOpacity> */}

        </Body>
        <Left>
          {status}

        </Left>
      </ListItem></TouchableOpacity>)
    });

    return (
      <SafeAreaView>
        <ScrollView style={styles.LastOperations}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {

              this.setModalVisible(!this.state.modalVisible);
            }}
          >
            <View style={styles.centeredView}>

              <View style={styles.modalView}>
                <Icon style={{ marginBottom: 10, marginTop: 0 }} name="cube" />
                <Text style={styles.modalText}>{this.state.AlertModal}</Text>

              </View>
            </View>
          </Modal>
          <Content>

            <List >
              {/* <ActivityIndicator style={{marginTop:150}} size="large" color="#A7D489" /> */}
              <View >

                {this.state.ActivityList1.length > 0 || this.state.ActivityList2.length > 0 || this.state.ActivityList3.length > 0 ? (<View >{ActivitiesTD}{Activities}{ActivitiesEx}</View>) : <Image style={{ width: 200, height: 150, alignSelf: 'center', marginTop: 40 }} source={{ uri: 'https://i.gifer.com/FpSr.gif' }} />}

                {/* {Activities} */}
              </View>

            </List>
          </Content>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  safeview: {
    flex: 1,
  },
  LastOperations: {
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#cbe8ba",
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
    padding: 35,
    alignItems: "center",
    justifyContent: 'center',

    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 25
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 'auto',
    width: 'auto'
  },
  button: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    height: 42,
    width: 200,
    alignSelf: 'center'
  },
  buttonOpen: {
    backgroundColor: "white",
  },
  buttonClose: {
    backgroundColor: "white",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  Packdetails: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 10



  }

});
