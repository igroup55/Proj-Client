import React, { Component, useState } from 'react';
import { CheckBox, Container, Header, Content, Form, Item, Input, Label, Picker, Footer, Right, Button, Icon } from 'native-base';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, Text, View, Image, Modal, Pressable } from 'react-native';
import CheckBoxes from './CCCheckBox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ReactDOM from "react-dom";
import AsyncStorage from '@react-native-async-storage/async-storage';

//עלות שריון לוקר
const LockerCost = 25;
//////////////////////////
export default class CCSenderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: null,
      selected2: null,
      selected3: null,
      StationsList: [],
      CustPNum: '',
      Error_CustPNum: null,
      CustName: '',
      Error_CustName: null,
      SStationName: '',
      EStationName: '',
      PackageID: null,
      SEmptyLocker: null,
      EEmptyLocker: null,
      UserId: null,
      Address: '',
      UserCreditOBJ: [],
      AlertModal: '',
      modalVisible: false

    };

  }

  async componentDidMount() {

    { this.getData() }

  };
  async getStationsList() {
    //tar 2 stations צריך להחליף בסוף******************************
    const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Stations';
    const response = await fetch(apiStationsUrl);
    const data = await response.json()

    this.setState({ StationsList: data })
  }
  async getUserCredits() {
    //קבלת פרטי קרדיטים של משתמש


    const UserID = this.state.UserId;
    const apiUserCreditsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits?UserID=' + UserID;
    const response2 = await fetch(apiUserCreditsUrl);
    const UCdata = await response2.json()
    this.setState({ UserCreditOBJ: UCdata, })



  }
  onValueChange1 = (value) => {
    this.setState({
      selected1: value
    });

  }

  onValueChange2 = (value) => {
    this.setState({
      selected2: value
    });
  }
  onValueChange3 = (value) => {
    this.setState({
      selected3: value
    });
  }
  onChangeText = (key, value) => {
    this.setState({ [key]: value })

  }

  async AddCust() {


    const customer_data = {

      Address: this.state.Address,
      PackageID: this.state.PackageID,
      FullName: this.state.CustName,
      PhoneNum: this.state.CustPNum,


    }


    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Customers', {
      method: 'POST',
      body: JSON.stringify(customer_data),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })


  }

  UpdateLocker() {

    const Slocker_update = {

      LockerID: this.state.SEmptyLocker[0]["LockerID"],
      PackageID: null,
      Busy: 1

    }



    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(Slocker_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })

    const Elocker_update = {

      LockerID: this.state.EEmptyLocker[0]["LockerID"],
      PackageID: null,
      Busy: 1

    }



    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers', {
      method: 'PUT',
      body: JSON.stringify(Elocker_update),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })


  }

  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
      this.setState({ UserId: UserDetails.UserId })
      const UserId = UserDetails.UserId
      this.getStationsList();
      this.getUserCredits();


    } catch (e) {
      this.setState({ AlertModal: 'Error get item' });
      { this.setModalVisible(true) }
      // error reading value
    }
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

  GetStationName() {

    this.state.StationsList.map((stations, key) => {

      if (stations.StationID === this.state.selected1) {
        this.storeData('StationName', stations.StationName)
        this.storeData('stationLat', stations.Latitude)
        this.storeData('stationLong', stations.Longitude)
      }
    })

  }
  ///////////////עדכון טרנזקציות תשלום//////////////////

  UpdateSenderCredits() {
    let FullName = this.state.UserCreditOBJ[0].FullName;
    let selfCredit = this.state.UserCreditOBJ[0].Credit;
    let UserId = this.state.UserId
    let afterUpdate = Number(selfCredit) - LockerCost;
    const UserCredits = {
      UserId: UserId,
      FullName: FullName,
      Credit: afterUpdate
    }
    const date = new Date();
    const Transaction = {
      UserID1: this.state.UserId,
      UserID2: 1,
      CreditAmount: LockerCost,
      TransactionDate: date,
    }
    {/*לשים לב שהניתוב הוא ל tar 2 */ }
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
          body: JSON.stringify(UserCredits),
          headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
          })
        })
      )
      .then(
        this.setState({ AlertModal: 'המשלוח נקלט בהצלחה' }),
        this.setModalVisible(true),
        this.props.navigation.navigate('CCLockers'),
      )

  }

  validate() {

    { this.ValidateCust() }
    { this.validatePnum() }

    this.getCreditById();

  }

  ValidateCust() {
    let rjx = /^[A-Za-z\u0590-\u05fe]+$/;
    let isNameValid = rjx.test(this.state.CustName);
    console.log("name is valid?: " + isNameValid);
    if (!isNameValid) {
      this.setState({ Error_CustName: "שדה זה הינו חובה" })
    }
    else {
      this.setState({ Error_CustName: "" })

    }
  }

  validatePnum() {
    let rjx = /[0-9]{10}/;
    let isPhoneValid = rjx.test(this.state.CustPNum);
    console.log("phone is valid?: " + isPhoneValid);
    if (!isPhoneValid) {
      this.setState({ Error_CustPNum: "שדה זה הינו חובה" })
    }
    else {
      this.setState({ Error_CustPNum: "" })
    }



  }

  async getCreditById() {




    const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits?UserID=' + this.state.UserId;
    const response = await fetch(apiStationsUrl);
    const data = await response.json()
    this.setState({ UserCreditOBJ: data, })
    console.log('Credit :' + data[0].Credit);
    if (this.state.Error_CustName !== "שדה זה הינו חובה" && this.state.Error_CustPNum !== "שדה זה הינו חובה")
      if (data[0].Credit < 25) {
        this.props.navigation.navigate('payments');
        this.setState({ AlertModal: 'אין לך מספיק קרדיטים' });
        { this.setModalVisible(true) }
      }
      else {

        if (this.state.selected1 !== null && this.state.selected2 !== null) {

          this.addPack()
        }
        else {

          this.setState({ AlertModal: 'תחנת מוצא או יעד אינה תקינה' });
          { this.setModalVisible(true) }
        }

      }




  }
  ////////////////////////////////////////////////////////
  async addPack() {



    // ----------------------------------------------------------------------------------------------------------------
    // Search For empty lockers ( לוקרים פנויים )
    // ----------------------------------------------------------------------------------------------------------------

    let StartStation = this.state.selected1;
    const apiLockersUrl1 = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers?StationID=' + StartStation;
    const response1 = await fetch(apiLockersUrl1);
    const Start = await response1.json()
    this.setState({ SEmptyLocker: Start })

    console.log('Start:' + Start)



    let EndStation = this.state.selected2;
    const apiLockersUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Lockers?StationID=' + EndStation;
    const response = await fetch(apiLockersUrl);
    const End = await response.json()

    this.setState({ EEmptyLocker: End })
    console.log('End :' + End)


    if (this.state.selected1 !== this.state.selected2) {

      if (this.state.SEmptyLocker.length !== 0 && this.state.SEmptyLocker.length !== 0) {


        const package_data = {

          StartStation: this.state.selected1,
          EndStation: this.state.selected2,
          Pweight: this.state.selected3,
          UserId: this.state.UserId,
          Status: 1

        }


        fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
          method: 'POST',
          body: JSON.stringify(package_data),
          headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
          })
        })
          .then(res => {


            return res.json()
          })
          .then(
            (result) => {

              this.setState({ PackageID: result })

              this.AddCust()
              this.UpdateLocker()
              this.storeData('PackageID', result)
              this.GetStationName()
              this.storeData('SLockerID', this.state.SEmptyLocker[0]["LockerID"])
              this.storeData('ELockerID', this.state.EEmptyLocker[0]["LockerID"])

              this.UpdateSenderCredits();

            },
            (error) => {
              console.log("err post=", error);
            }).then(



            );


      }

      else {

        this.setState({ AlertModal: 'אין לוקרים פנויים כעת , נא לנסות מאוחר יותר' });
        { this.setModalVisible(true) }
        
        //       ------------------------------------------------------------------------------------
        // המשך לאפשרות העלאת המשלוח ושליחת הודעה קופצת לשולח בעת שמתפנה לוקר 
        //       -----------------------------------------------------------------------------------
        // const package_data = {

        //   StartStation: this.state.selected1,
        //   EndStation: this.state.selected2,
        //   Pweight: this.state.selected3,
        //   UserId: this.state.UserId,
        //   Status: 0
        // }

        // fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages', {
        //   method: 'POST',
        //   body: JSON.stringify(package_data),
        //   headers: new Headers({
        //     'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        //   })
        // })
        //   .then(res => {

        //     return res.json()
        //   })
        //   .then(
        //     (result) => {

        //       this.setState({ PackageID: result })

        //       this.AddCust()
        //       this.props.navigation.navigate('CCLockers');

        //     },
        //     (error) => {
        //       console.log("err post=", error);
        //     }).then(
        //      );
      }
    }

    else {
      this.setState({ AlertModal: 'אי אפשר לבצע משלוח מתחנת מוצא ליעד זהים' });
      { this.setModalVisible(true) }
    }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render() {
    let stations = this.state.StationsList.map((stations, key) => {
      return (<Picker.Item key={key} label={stations.StationName} value={stations.StationID} />)
    });

    return (

      <SafeAreaView>
        <ScrollView>
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
          <View>
            <Header style={{ backgroundColor: 'green', borderBottomWidth: 2, borderColor: 'black', borderBottomColor: 'black' }}><Text style={{ fontSize: 30, fontWeight: 'bold', backgroundColor: 'green' }}> JestApp</Text></Header>

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
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange1.bind(this)}

                  >
                    <Picker.Item label='בחר תחנת מוצא' value={null} />
                    {stations}
                  </Picker>
                </Item>
              </View>

              <View style={styles.section}>
                <Text> {this.state.SStationName}</Text>
                <Icon name="flag" style={{ alignSelf: 'center', marginTop: 10 }} />
                <Text style={styles.titles}>תחנת יעד</Text>
                <Item picker style={styles.InputText}>

                  <Picker
                    mode="dropdown"
                    placeholder="בחר תחנת יעד"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.selected2}
                    onValueChange={this.onValueChange2.bind(this)}
                  >
                    <Picker.Item label="בחר תחנת יעד" value={null} />
                    {stations}
                  </Picker>
                </Item>
              </View>

              <CheckBoxes />
              <Icon name="person" style={{ alignSelf: 'center', marginTop: 10 }} />
              <Text style={styles.titles}> פרטי לקוח קצה </Text>



              <Item>
                <Input style={styles.InputText}
                  placeholderTextColor="grey"
                  placeholder="שם מלא"
                  returnKeyType='next'
                  keyboardType='default'

                  onChangeText={val => this.setState({ CustName: val })}
                />
              </Item>
              <View><Text style={styles.FormErrorText}>{this.state.Error_CustName}</Text></View>

              <Item>
                <Input style={styles.InputText}
                  placeholderTextColor="grey"
                  placeholder="טלפון"
                  returnKeyType="next"
                  keyboardType='numeric'
                  onChangeText={val => this.setState({ CustPNum: val })}
                />
              </Item>
              <View><Text style={styles.FormErrorText}>{this.state.Error_CustPNum}</Text></View>
              <View style={styles.section}>
                <Image


                  source={{ uri: 'https://i.ibb.co/nrkbr12/icons8-weight-kg-24.png' }}
                  style={{ width: 24, height: 24, alignSelf: 'center', marginTop: 10 }}
                />


                <Text style={styles.titles}> משקל חבילה </Text>
                <Item picker style={styles.InputText}>
                  <Picker
                    mode="dropdown"
                    style={{ width: undefined, textAlign: 'right', borderColor: 'black', borderWidth: 2 }}
                    placeholder="בחר משקל חבילה"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"

                    selectedValue={this.state.selected3}
                    onValueChange={this.onValueChange3.bind(this)}
                  >
                    <Picker.Item label=" בחר משקל חבילה" value="10" />
                    <Picker.Item label=" מ 0 עד 3 קג " value="3" />
                    <Picker.Item label=" מ 3 עד 6 קג" value="6" />
                    <Picker.Item label="מ 6 עד 10 קג" value="10" />
                  </Picker>
                </Item>
              </View>

              {/* <View  style={styles.section}>
              <Icon name="person" style={{ alignSelf: 'center', marginTop: 10 }} />
                <Text style={styles.titles}> פרטי לקוח קצה </Text>
                <Item floatingLabel style={styles.InputText}>
                  <Label ></Label>
                  <Input />
                </Item></View> */}

              <Button onPress={() => { this.validate() }} style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 70, marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}>  צור כרטיס משלוח  </Text></Button>

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
  FormErrorText: {
    fontSize: 12,
    color: 'red'
  },

  InputText: {
    textAlign: 'right',
    borderColor: 'green',
    borderStyle: 'solid',
    backgroundColor: '#cbe8ba',
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10

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
