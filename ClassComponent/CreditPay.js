import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Image } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Icon, Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';


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





    };
  }

  validatePayment() {
    let FormCreditAmount = this.state.FormCreditAmount;
    let FormCardOwner = this.state.FormCardOwner;
    let FormCardNumber = this.state.FormCardNumber;
    let FormCVV = this.state.FormCVV;

    console.log('Amount : ' + FormCreditAmount)
    console.log('Owner : ' + FormCardOwner)
    console.log('CardNumber: ' + FormCardNumber)
    console.log('CVV : ' + FormCVV)
    // || FormCreditAmount===0
    // FormCreditAmount < 25 ? (this.setState({CE_FormCreditAmount:0})):this.setState({CE_FormCreditAmount:1})
    // FormCardOwner === "" ? (this.setState({CE_FormCardOwner:0})) : this.setState({CE_FormCardOwner:1})
    // this.state.FormCardNumber.length < 10 ? (this.setState({CE_FormCardNumber:0})) : this.setState({CE_FormCardNumber:1})
    // FormCVV.length < 3 ? (this.setState({CE_FormCVV:0})) : this.setState({CE_FormCVV:1})

    // let OK = this.state.CE_FormCreditAmount + this.state.CE_FormCardOwner + this.state.CE_FormCardNumber + this.state.CE_FormCVV
    // console.log(this.state.CE_FormCreditAmount)

    if (FormCreditAmount < 25) {
      alert(" לא ניתן לקנות פחות מ 25 קרידיטים ")
    }
    else{
      if (FormCardOwner === "") {
        alert('לא רשמת שם בעל כרטיס')
      }
      else{
        if (FormCardNumber.length < 10) {
          alert('מספר כרטיס צריך להכיל לפחות 10 ספרות')
        }
        else{
          if (FormCVV.length < 3 || FormCVV === 0 ) {
            alert('CVV לא תקין ')
          }
          else{
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
      alert('Error get Item')
      // error reading value
    }
  }

  

  async getDataFromServer() {
    console.log("userID is: " + this.state.UserID)
    const UserID = this.state.UserID;

    const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/UserCredits?UserID=' + UserID;
    const response = await fetch(apiStationsUrl);
    const data = await response.json()
    this.setState({ UserCreditOBJ: data, })
    console.log('Credit :'+data[0].Credit);
   


    const apiStationsUrl2 = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Transaction?UserID=' + UserID;
    const response2 = await fetch(apiStationsUrl2);
    const Transactionsdata = await response2.json()
    this.setState({ TransactionsList: Transactionsdata, })
    console.log(Transactionsdata);

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
        alert(' תודה ' + this.state.UserCreditOBJ[0].FullName + ' הקנייה בוצעה בהצלחה  !'),


      )

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
            <Text style={{ marginTop: 5 }} note >תאריך עסקה: {Transaction.TransactionDate} </Text>

          </Body>

        </ListItem>)

    });


    return (

      <View style={styles.container2}>
        <View style={{  borderWidth: 2, backgroundColor: 'lightblue', textAlign: 'center', direction: 'rtl', borderRadius: 20, margin:15 }}>
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
        {this.state.BuycreditsForm === 1 ? (<View >
          <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { this.setState({ BuycreditsForm: 0 }) }}><Icon name="close" style={{ marginRight: 90, marginTop: 10 }} /></TouchableOpacity>
              <Text style={styles.titles, { marginRight: 100, marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>רכישת קרדיטים</Text>
            </View>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="כמות קרדיטים"
              keyboardType="numeric"
              placeholderTextColor="green"
              autoCapitalize="none"
              onChangeText={val => this.setState({ FormCreditAmount: val })}
            />
            {/* <TextInput style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="מספר ת.ז/ח.פ"
                    keyboardType="numeric"
                    placeholderTextColor="green"
                    autoCapitalize="none"
                    onChangeText={val => this.setState({ email: val })}
                /> */}
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
            {/* <View style={{flexDirection:'row'}}>
                <Text style={styles.titles2}>תוקף כרטיס</Text>
                <TextInput style={styles.input2}
                    underlineColorAndroid="transparent"
                    placeholder="YYYY"
                    placeholderTextColor="green"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onChangeText={val => this.setState({ email: val })}
                />
                <TextInput style={styles.input2}
                    underlineColorAndroid="transparent"
                    placeholder="MM"
                    placeholderTextColor="green"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onChangeText={val => this.setState({ email: val })}
                />
              </View> */}
          </View>

          <View>
            <Text style={styles.titles1} > סך הכל לתשלום: {this.state.FormCreditAmount} ש"ח</Text>
          </View>
          <View>
            <Button onPress={() => { this.validatePayment() }} block success style={{ paddingHorizontal: 30, paddingVertical: 30, marginRight: 20, marginTop: 10, borderColor: 'black', borderWidth: 2, borderRadius: 8 }} >
              <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>אישור תשלום</Text>
            </Button>
          </View>
        </View>
        ) : <View>

        </View>}

        {this.state.PayTDForm === 1 ? (


          <View>

            <View style={styles.container3}>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => { this.setState({ PayTDForm: 0 }) }}><Icon name="close" style={{ marginRight: 90, marginTop: 10 }} /></TouchableOpacity>
                <Text style={styles.titles, { marginRight: 100, marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>עסקאות</Text>
              </View>


              <ScrollView >
                <Container>
                  <Content>
                    <List>
                      {TransactionsList}
                    </List>
                  </Content>
                </Container>
              </ScrollView>


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
    width: 200

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




});
