import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image, Modal, Pressable } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Icon, Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native';
import moment from 'moment';

export default class CreditPay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PayTDForm: 0,
      BuycreditsForm: 0,
      UserID: 0,
      UserCreditOBJ: [],
      TransactionsList: [],
      FormCreditAmount: 0,
      FormCardOwner: '',
      FormCardNumber: 0,
      FormCVV: 0,
      FormYYYY: 0,
      FormMM: 0,
      CE_FormCreditAmount: 0,
      CE_FormCardOwner: 0,
      CE_FormCardNumber: 0,
      CE_FormCVV: 0,
      AlertModal: '',
      modalVisible: false,




    };
  }

  validatePayment() {
    let FormCreditAmount = this.state.FormCreditAmount;
    let FormCardOwner = this.state.FormCardOwner;
    let FormCardNumber = this.state.FormCardNumber;
    let FormCVV = this.state.FormCVV;

    if (FormCreditAmount < 25) {
      this.setState({ AlertModal: ' לא ניתן לקנות פחות מ 25 קרידיטים' });
      { this.setModalVisible(true) }
    }
    else {
      if (FormCardOwner === "") {
        this.setState({ AlertModal: 'לא רשמת שם בעל כרטיס' });
        { this.setModalVisible(true) }
      }
      else {
        if (FormCardNumber.length < 10) {
          this.setState({ AlertModal: 'מספר כרטיס צריך להכיל לפחות 10 ספרות' });
          { this.setModalVisible(true) }
        }
        else {
          if (FormCVV.length < 3 || FormCVV === 0) {
            this.setState({ AlertModal: 'CVV לא תקין ' });
            { this.setModalVisible(true) }
          }
          else {
            this.UpdateUserCredits();
          }
        }
      }
    }

  }

  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
      console.log("im at CreditPay");
      this.setState({ UserID: UserDetails.UserId });
      console.log(UserDetails.UserId);
      this.getDataFromServer();
    } catch (e) {
      this.setState({ AlertModal: 'Error get Item' });
      { this.setModalVisible(true) }
    }
  }



  async getDataFromServer() {
    const UserID = this.state.UserID;

    const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits?UserID=' + UserID;
    const response = await fetch(apiStationsUrl);
    const data = await response.json()
    this.setState({ UserCreditOBJ: data, })

    const apiStationsUrl2 = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Transaction?UserID=' + UserID;
    const response2 = await fetch(apiStationsUrl2);
    const Transactionsdata = await response2.json()
    this.setState({ TransactionsList: Transactionsdata, })

  }
  async componentDidMount() {
    this.getData();

  }

  BuycreditsForm() {
    this.setState({ PayTDForm: 0 })
    this.setState({ BuycreditsForm: 1 })
  }
  PayTD() {
    this.setState({ BuycreditsForm: 0 })
    this.setState({ PayTDForm: 1 })
  }
  UpdateUserCredits() {
    let FullName = this.state.UserCreditOBJ[0].FullName;
    let selfCredit = this.state.UserCreditOBJ[0].Credit;
    let UserId = this.state.UserID
    let afterUpdate = Number(selfCredit) + Number(this.state.FormCreditAmount);
    const UserCredits = {
      UserId: UserId,
      FullName: FullName,
      Credit: afterUpdate
    }

    const date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const Transaction = {
      UserID1: this.state.UserID,
      UserID2: this.state.UserID,
      CreditAmount: this.state.FormCreditAmount,
      TransactionDate: month + '-' + day + '-' + year
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

        this.setState({ AlertModal: ' תודה ' + this.state.UserCreditOBJ[0].FullName + ' הקנייה בוצעה בהצלחה  !' }),
        this.setModalVisible(true)
      )

  }


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render() {
    let UserCredit = this.state.UserCreditOBJ.map((UserCredit, key) => {
      return (<View key={key}>
        <Text style={styles.titles}>{UserCredit.FullName}, שלום </Text>
        <Text style={styles.titles}>היתרה שלך : {UserCredit.Credit} קרדיטים </Text>
      </View>)
    });
    let TransactionsList = this.state.TransactionsList.map((Transaction, key) => {
      return (
        <ListItem avatar key={key}><Right>{Transaction.UserID1 === this.state.UserID ? (<Thumbnail source={{ uri: 'https://www.pinclipart.com/picdir/middle/43-433525_plus-and-minus-icons-red-minus-sign-png.png' }} />) :
          <Thumbnail source={{ uri: 'https://www.pngfind.com/pngs/m/44-440660_doctor-plus-logo-png-green-plus-transparent-png.png' }} />}
        </Right>
          <Body style={{ direction: 'rtl', textAlign: 'left' }}>
            <Text >מספר עסקה: {Transaction.TranstactionID}</Text>
            <Text style={{ marginTop: 5 }} note >סכום עסקה: {Transaction.CreditAmount} קרדיטים</Text>
            <Text style={{ marginTop: 5 }} note >תאריך עסקה: {moment(Transaction.TransactionDate).format('YYYY-MM-DD')} </Text>

          </Body>

        </ListItem>)

    });


    return (

      <View style={styles.container2}>
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



        <View style={{ borderWidth: 2, backgroundColor: 'lightblue', textAlign: 'center', direction: 'rtl', borderRadius: 20, margin: 15 }}>
          {UserCredit}
        </View>

        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>

          <Button onPress={() => { this.BuycreditsForm() }} block success style={{ paddingHorizontal: 30, marginRight: 20, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>קנה קרדיטים</Text>
          </Button>
          <Button onPress={() => { this.PayTD() }} block primary style={{ paddingHorizontal: 30, marginRight: 20, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>פירוט עסקאות</Text>
          </Button>

        </View>
        {this.state.BuycreditsForm === 1 ? (
          <View >
            <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 30, backgroundColor: 'green', borderRadius: 20, borderWidth: 1 }} onPress={() => { this.setState({ BuycreditsForm: 0,FormCreditAmount:0 }) }}><Icon name="close" /></TouchableOpacity>
            <View style={{ alignItems: 'center', backgroundColor: 'white', borderRadius: 20, borderWidth: 1, margin: 20, height: 250 }}>

              <TextInput style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="כמות קרדיטים"
                keyboardType="numeric"
                placeholderTextColor="green"
                autoCapitalize="none"
                onChangeText={val => this.setState({ FormCreditAmount: val })}
              />
              <TextInput style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="שם בעל הכרטיס"
                placeholderTextColor="green"
                autoCapitalize="none"
                onChangeText={val => this.setState({ FormCardOwner: val })}
              />
              <TextInput style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="מספר כרטיס אשראי"
                keyboardType="numeric"
                placeholderTextColor="green"
                autoCapitalize="none"
                onChangeText={val => this.setState({ FormCardNumber: val })}
              />
              <TextInput style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="קוד אימות(CVV)"
                placeholderTextColor="green"
                keyboardType="numeric"
                autoCapitalize="none"
                maxLength={3}
                onChangeText={val => this.setState({ FormCVV: val })}

              />
             
            </View>

            <View>
              <Text style={styles.titles1} > סך הכל לתשלום: {this.state.FormCreditAmount} ש"ח</Text>
            </View>
            <View>
              <Button onPress={() => { this.validatePayment() }} block success style={{ paddingHorizontal: 30, paddingVertical: 30, marginTop: 10, borderColor: 'black', borderWidth: 2, borderRadius: 8, justifyContent: 'center', marginLeft: 25, marginRight: 25 }} >
                <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>אישור תשלום</Text>
              </Button>
            </View>
          </View>
        ) : <View>

        </View>}

        {this.state.PayTDForm === 1 ? (

          <View>
            <TouchableOpacity style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 30, backgroundColor: 'green', borderRadius: 20, borderWidth: 1 }} onPress={() => { this.setState({ PayTDForm: 0 }) }}><Icon name="close" /></TouchableOpacity>

            <View style={{ backgroundColor: 'white', margin: 10, direction: 'rtl', borderRadius: 8, borderWidth: 1, maxHeight: 460 }} >

              <View>
                <SafeAreaView>
                  <ScrollView >
                    <Content>
                      <List>
                        {TransactionsList}
                      </List>
                    </Content>
                  </ScrollView>
                </SafeAreaView>
              </View>
            </View>
          </View>


        ) : null}

        {/* <View style={styles.container}>

         </View> */}
        {this.state.PayDeliveries}
      </View>
    );
  }
}

const styles = ({
  container: {
    flex: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 500,
    marginTop: 30



  },
  container3: {
    flex: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 500,
    marginTop: 30,



  },
  input: {
    margin: 10,
    height: 40,
    borderColor: 'lightgrey',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    width: 200,
    textAlign:'right'

  },
  input2: {
    margin: 10,
    height: 40,
    borderColor: 'lightgrey',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    width: 50

  },

  container2: {
    flex: 1,
    backgroundColor: '#cbe8ba',



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
  titles1: {
    direction: 'rtl',
    marginLeft: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    alignItems: 'center',
    fontSize: 16
  },
  titles2: {
    direction: 'rtl',
    marginLeft: 20,
    color: 'green',
    marginTop: 10,
    alignItems: 'center',
    fontSize: 14
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
