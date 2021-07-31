import React, { Component } from 'react'
import { View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Body, Icon, Left, Right, Text } from 'native-base';
import { Button } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { getDistance } from 'geolib';
import { Modal } from 'react-native';
import { Pressable } from 'react-native';

export default class CCExpressLockers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      UserDetails: null,
      Packages: [],
      SelectedStation: '',
      latitude: 0,
      longitude: 0,
      error: null,
      stationLat: 0,
      stationLong: 0,
      AlertModal: '',
      modalVisible: false,
      refresh: false,
      LockerId: 0

    }
  }

  async componentDidMount() {

    this.getData()

    this.props.navigation.addListener('focus', () => this.setState({ refresh: true }, () => this.setState({ refresh: false })))


  }
  UNSAFE_componentWillUpdate() {
    if (this.state.refresh == true)
      this.getData()
  }


  // UNSAFE_componentWillReceiveProps(props) {

  //  // if(this.state.refresh == false)
  //   this.getData()

  // }

  async getData() {
    try {

      jsonValue = await AsyncStorage.getItem('UserId')
      jsonValue != null ? User = JSON.parse(jsonValue) : null;
      this.setState({ UserDetails: User }, () => { this.getfromserver() })

      jsonValue = await AsyncStorage.getItem('XSStationName')
      jsonValue != null ? Station = JSON.parse(jsonValue) : null;
      this.setState({ SelectedStation: Station })

      let locationValues = await AsyncStorage.multiGet(['XSstationLat', 'XSstationLong']);

      this.setState({ stationLat: locationValues[0][1] })
      this.setState({ stationLong: locationValues[1][1] })

    }
    catch (e) {

    }


  }

  getfromserver = async () => {



    const ActivityListDataEx = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity/{ModuleActivity}/{Express}/' + this.state.UserDetails.UserId;
    const responseActivityListEx = await fetch(ActivityListDataEx);
    const dataEx = await responseActivityListEx.json()
    this.setState({ Packages: dataEx })

  }

  isNearLocker() {

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


    const NearDistance = 0.1;
    let currentLat = this.state.latitude;
    let currentLong = this.state.longitude;
    let stationLat = this.state.stationLat;
    let stationLong = this.state.stationLong;
    let CurrentDistance = 0;
    CurrentDistance = getDistance({ latitude: currentLat, longitude: currentLong }, { latitude: stationLat, longitude: stationLong })

    if (CurrentDistance >= NearDistance) {
      this.PickUp()


    }
    else {
      this.setState({ AlertModal: 'אינך נמצא בקרבת הלוקר !!' });
      { this.setModalVisible(true) }
    }

  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  PickUp() {

    this.state.Packages.map((pack, key) => {
      if (pack.StartStation === this.state.SelectedStation) {
        if (pack.Status == 1) {

          const UpdateEx = {
            PackageID: pack.PackageID,
            Status: 2

          }
          fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ExpressUser', {
            method: 'PUT',
            body: JSON.stringify(UpdateEx),
            headers: new Headers({
              'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
            })
          })
        }

        this.getLocker(pack.PackageID)
      }

    })
  }


  async getLocker(pack) {

    const apiPackagePricesUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?PackageId=' + pack;
    const response = await fetch(apiPackagePricesUrl);
    const data = await response.json()
    this.setState({ LockerId: data[0]["ELockerID"] })


    this.UpdateLocker();
  }

  async UpdateLocker() {

    const Slocker_update = {

      LockerID: this.state.LockerId,
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

    this.props.navigation.navigate('ExpressRecomendation');

  }



  render() {


    var cnt = 0;
    let Check = this.state.Packages.map((pack, key) => {


      if (pack.StartStation === this.state.SelectedStation) {

        if (pack.Status === 1) {

          return (<View style={{ margin: 20, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }} key={key}>

            <View style={{ padding: 5, borderBottomColor: 'black', borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 14, padding: 10 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> מס' חבילה : </Text>{pack.PackageID}</Text>
              <Text style={{ fontSize: 14, padding: 10 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> תחנת איסוף : </Text>{pack.StartStation}</Text>
              <Text style={{ fontSize: 14, padding: 10 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> לוקר איסוף : </Text>{pack.UserID2}</Text>
            </View>
            <View style={{ backgroundColor: '#ffed4b', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
              <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>{pack.EndStation}</Text>
            </View>
          </View>)

        }
        if (pack.Status === 2) {


          return (<View style={{ margin: 20, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }} key={key}>

            <View style={{ padding: 15, borderBottomColor: 'black', borderBottomWidth: 1, marginRight: 0, marginLeft: 0 }}>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> מס' חבילה : </Text>{pack.PackageID}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> תחנת איסוף : </Text>{pack.StartStation}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> לוקר איסוף : </Text>{pack.UserID2}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> כתובת יעד : </Text>{pack.EndStation}</Text>
            </View>
            <View style={{ backgroundColor: 'grey', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
              <Button disabled={true} labelStyle={{ color: 'black', fontWeight: 'bold' }}> נאספה </Button>
            </View>
          </View>)

        }
        if (pack.Status === 3) {


          return (<View style={{ margin: 20, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }} key={key}>

            <View style={{ padding: 15, borderBottomColor: 'black', borderBottomWidth: 1, marginRight: 0, marginLeft: 0 }}>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> מס' חבילה : </Text>{pack.PackageID}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> תחנת איסוף : </Text>{pack.StartStation}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> לוקר איסוף : </Text>{pack.UserID2}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> כתובת יעד : </Text>{pack.EndStation}</Text>
            </View>
            <View style={{ backgroundColor: 'grey', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
              <Button disabled={true} labelStyle={{ color: 'black', fontWeight: 'bold' }}> נמסר </Button>
            </View>
          </View>)

        }
        if (pack.Status === -1) {


          return (<View style={{ margin: 20, borderColor: 'black', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }} key={key}>

            <View style={{ padding: 15, borderBottomColor: 'black', borderBottomWidth: 1, marginRight: 0, marginLeft: 0 }}>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> מס' חבילה : </Text>{pack.PackageID}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> תחנת איסוף : </Text>{pack.StartStation}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> לוקר איסוף : </Text>{pack.UserID2}</Text>
              <Text style={{ fontSize: 14, padding: 5 }}><Text style={{ fontWeight: 'bold', fontSize: 14 }}> כתובת יעד : </Text>{pack.EndStation}</Text>
            </View>
            <View style={{ backgroundColor: 'grey', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
              <Button disabled={true} labelStyle={{ color: 'black', fontWeight: 'bold' }}> בוטל </Button>
            </View>
          </View>)

        }
      }
      else {
        cnt += 1

      }
    })
    if (cnt === this.state.Packages.length) {
      var pickupButton = <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>אין חבילות</Text>
    }
    else {

      var pickupButton = <View style={{ borderWidth: 1, borderColor: 'black', marginRight: 80, marginLeft: 80, marginBottom: 20, marginTop: 10, borderRadius: 10, backgroundColor: '#ffed4b' }}>

        <Button labelStyle={{ color: 'black', fontWeight: 'bold' }} onPress={() => this.isNearLocker()}> איסוף הכל </Button>
      </View>
    }
    return (

      <View style={{ backgroundColor: 'lightyellow', flex: 1, borderTopColor: 'black', borderTopWidth: 2 }}>
        <ScrollView>
          <View style={{ borderWidth: 1, borderColor: 'black', marginRight: 70, marginLeft: 70, marginBottom: 20, marginTop: 40, borderRadius: 10, backgroundColor: '#ffed4b' }}>
            <Button labelStyle={{ color: 'black', fontWeight: 'bold' }} icon={'plus'} onPress={() => this.props.navigation.navigate('DeliveryExpress')}>שריין חבילה</Button>
          </View>
          {Check}
          {pickupButton}


        </ScrollView>
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
      </View>
    )
  }
}

const styles = ({
  container: {
    flex: 1,
    backgroundColor: 'lightyellow',

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


});
