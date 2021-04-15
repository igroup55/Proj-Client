import React, { Component } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Text, View, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Modal, Pressable } from 'react-native';
import { Icon, Button, Thumbnail } from 'native-base';
import { Header, Image } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'



export default class RegisterForm extends Component {
  state = {
    fullName: '',
    password: '',
    email: '',
    phone_number: '',
    ID: '',
    birthdate: new Date(),
    ProfilePic: '',
    fullName_Error: '',
    password_Error: '',
    email_Error: '',
    phone_number_Error: '',
    ID_Error: '',
    ProfilePic_Error: '',
    NameOK: 0,
    IDOK: 0,
    EmailOK: 0,
    PassWordOK: 0,
    PhoneOK: 0,
    canAddUser: 0,
    UsersArr: [],
    AlertModal: '',
    modalVisible: false

  }
  componentDidMount() {

  }

  // {/*לשים לב להחליף ניתוב מTAR2*/}
  AddUserToUserCredits() {
    const UserCredits = {
      UserId: this.state.ID,
      FullName: this.state.fullName,
      Credit: 0
    }
    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar2/api/UserCredits?', {
      method: 'POST',
      body: JSON.stringify(UserCredits),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    }).then("inserted Successfully to UserCredits")

  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }



  async CheckExistUser() {

    const apiUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Users/{CheckExistUser}/' + this.state.ID;
    const response = await fetch(apiUserUrl);
    const data = await response.json();
    this.setState({ UsersArr: data })
    if (this.state.UsersArr.length === 0) {
      this.AddUser();
    }
    else {

      this.setState({ AlertModal: 'משתמש רשום' });
      { this.setModalVisible(true) }

    }

  }





  AddUser = () => {


    const User = {
      Fullname: this.state.fullName,
      EmailAddress: this.state.email,
      password: this.state.password,
      PhoneNum: this.state.phone_number,
      UserId: this.state.ID,
      ProfilePic: this.state.ProfilePic,
      BirthDate: this.state.birthdate
    }

    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Users', {
      method: 'POST',
      body: JSON.stringify(User),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })
      .then(res => {

        return res.json()
      })
      .then(
        (result) => {
          console.log("fetch POST= ", result);
          this.AddUserToUserCredits();

        },
        (error) => {
          console.log("err post=", error);
        });
  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }
  validateName() {
    let rjx = /^[a-z\u0590-\u05fe]+$/i;
    let isNameValid = rjx.test(this.state.fullName);
    console.log("name is valid?: " + isNameValid);
    if (!isNameValid) {
      this.setState({ fullName_Error: "a-z או A-Z שם צריך להכיל אותיות מ א'-ת' או מ " });
    }
    else {
      this.setState({ fullName_Error: "" })
    }
  }
  validateEmail() {
    let rjx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
    let isEmailValid = rjx.test(this.state.email);
    console.log("email is valid?: " + isEmailValid);
    if (!isEmailValid) {
      this.setState({ email_Error: "text@domain.com הפורמפט לכתובת מייל הוא " });
    }
    else {
      this.setState({ email_Error: "" })
    }
  }
  validatePassword() {
    let rjx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;
    let isPasswordValid = rjx.test(this.state.password);
    console.log("passwordisValid?: " + isPasswordValid);
    if (!isPasswordValid) {
      this.setState({ password_Error: "סיסמא צריכה להכיל מינימום 8 אותיות לפחות אות קטנה אות גדולה ומספר באנגלית" });
    }
    else {
      this.setState({ password_Error: "" })
    }
  }
  validatePhone() {
    let rjx = /[0-9]{10}/;
    let isPhoneValid = rjx.test(this.state.phone_number);
    console.log("phone is valid?: " + isPhoneValid);
    if (!isPhoneValid) {
      this.setState({ phone_number_Error: "מספר טלפון הוא בעל 10 ספרות" });
    }
    else {
      this.setState({ phone_number_Error: "" })
    }
  }
  validateID() {
    let rjx = /[0-9]{9}/;
    let isIDValid = rjx.test(this.state.ID);
    console.log("id is valid?: " + isIDValid);
    if (!isIDValid) {
      this.setState({ ID_Error: "מספר מזהה הוא בעל 9 ספרות" });
    }
    else {
      this.setState({ ID_Error: "" })
    }
  }
  validateInPuts() {
    console.log("validateInputs")

    this.validateName();
    this.validateEmail();
    this.validatePassword();
    this.validatePhone();
    this.validateID();


  }
  validate = () => {
    console.log("------------------starting validate")
    this.validateInPuts();
    console.log("after iputs")

    // let fullName_Error= "";
    // let password_Error= "";
    // let email_Error = "";
    // let phone_number_Error= "";
    // let ID_Error="";
    // let ProfilePic_Error="";
    let OK = 0
    // this.validateName();
    // this.validateEmail();
    // this.validatePassword();
    // this.validatePhone();
    // this.validateID();
    if (this.state.ID_Error === "") {
      this.setState({ IDOK: 1 });
      OK += 1;
      // return false;
    }
    if (this.state.phone_number_Error === "") {
      this.setState({ PhoneOK: 1 });
      // return false;
      OK += 1;
    }
    if (this.state.email_Error === "") {
      this.setState({ EmailOK: 1 });
      // return false;
      OK += 1;
    }
    if (this.state.fullName_Error === "") {
      this.setState({ NameOK: 1 });
      // return false;
      OK += 1;
    }
    // if(this.state.ProfilePic_Error===""){
    //   this.setState({ProfilePic_Error});
    //   return false;
    // }
    if (this.state.password_Error === "") {
      this.setState({ PassWordOK: 1 });
      // return false;
      OK += 1;
    }
    if (OK === 5) {
      this.setState({ canAddUser: 1 });
      return true;
    }
    //  if(OK<5){
    //     OK=0
    //     this.setState({IDOK:0});
    //     this.setState({PhoneOK:0});
    //     this.setState({EmailOK:0});
    //     this.setState({NameOK:0});
    //     this.setState({PassWordOK:0});
    //     return false
    //   }

  }
  signUp = async () => {
    const user = { Fullname: this.state.fullName, Password: this.state.password, EmailAddress: this.state.email, PhoneNum: this.state.phone_number, UserId: this.state.ID, ProfilePic: this.state.ProfilePic }

    // here place your signup logic
    const isValid = this.validate();


    { this.CheckExistUser() }

  }
  // { this.props.navigation.navigate('Register'); }

  btnOpenGalery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      //allowsEditing: true,
      //aspect: [4, 3],
    });
    if (!result.cancelled) {
      this.setState({ ProfilePic: result.uri });
    }
  };

  render() {

    return (
      <ScrollView>
        <View>

          <View>
            <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', marginBottom: 30 }}>ברוך הבא ל JESTAPP</Text>
            <Thumbnail source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl97_NDIiRpKTDKaKSDtnGPZbLMRl-A8EWIw&usqp=CAU' }}
              style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
            />

          </View>
          <View>
            <View style={styles.container}>

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

              <TextInput
                style={styles.input}
                placeholder='שם מלא'
                autoCapitalize="none"
                placeholderTextColor='white'
                onChangeText={val => this.onChangeText('fullName', val)}
              />
              <View><Text style={styles.FormErrorText}>{this.state.fullName_Error}</Text></View>
              <TextInput
                style={styles.input}
                placeholder='אימייל'
                autoCapitalize="none"
                placeholderTextColor='white'
                onChangeText={val => this.onChangeText('email', val)}
              />
              <View><Text style={styles.FormErrorText}>{this.state.email_Error}</Text></View>
              <TextInput
                style={styles.input}
                placeholder='סיסמא'
                secureTextEntry={true}
                autoCapitalize="none"
                placeholderTextColor='white'
                onChangeText={val => this.onChangeText('password', val)}
              />
              <View><Text style={styles.FormErrorText}>{this.state.password_Error}</Text></View>
              <TextInput
                style={styles.input}
                placeholder='מספר טלפון'
                keyboardType="numeric"
                maxLength={10}
                autoCapitalize="none"
                placeholderTextColor='white'
                onChangeText={val => this.onChangeText('phone_number', val)}
              />
              <View><Text style={styles.FormErrorText}>{this.state.phone_number_Error}</Text></View>
              <TextInput
                style={styles.input}
                placeholder='ת.ז/ ח.פ'
                maxLength={9}
                keyboardType="numeric"
                autoCapitalize="none"
                placeholderTextColor='white'
                onChangeText={val => { this.onChangeText('ID', val); this.setState({ ID_Error: '' }) }}
              /><View><Text style={styles.FormErrorText}>{this.state.ID_Error}</Text></View>
              {/* <View>
        <DatePicker
        style={{ alignSelf: 'center', marginTop: 5 }}
        date={this.state.date}
        mode="date"
        placeholder="תאריך לידה"
        format="DD-MM-YYYY"
        minDate="1950-01-30"
        maxDate={new Date()}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({birthdate: date}) }}
      />
        </View> */}
              <View style={{ alignSelf: 'center', marginBottom: 20 }}
              >
                <Button onPress={this.btnOpenGalery.bind(this)} style={{ alignSelf: 'center', backgroundColor: '#A7D489', borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}>  תמונת פרופיל </Text>
                  <Icon name="image" style={{ alignSelf: 'center', }} />
                </Button>

              </View>
              <View>
                <Button onPress={this.signUp} style={{ alignSelf: 'center', backgroundColor: '#A7D489', marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}> הרשם עכשיו </Text>
                  <Icon name="train" style={{ alignSelf: 'center', }} />
                </Button>

              </View>

            </View>
          </View>

        </View>
      </ScrollView>

    )
  }

}
const styles = StyleSheet.create({
  input: {
    textAlign: 'center',
    width: 300,
    height: 55,
    backgroundColor: '#A7D489',
    margin: 5,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  FormErrorText: {
    fontSize: 12,
    color: 'red'
  },
  gallery: {
    width: 80,
    textAlign: 'center',
    height: 68,
    marginRight: 50,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    backgroundColor: '#A7D489',
  },

  container: {
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
