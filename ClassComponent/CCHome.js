import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, SafeAreaView, StyleSheet, Pressable, Modal } from 'react-native';
import { Button, Header, Image, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeActivityList from './HomeActivityList';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AlertModal: '',
      modalVisible: false,
      notification: {},
      token:'',
      UserId:null,
activityList:false
    };
  }
  async componentDidMount() {


    registerForPushNotificationsAsync()
    .then((token) => {
    this.setState({ token:token });
    
    console.log("my token is: "+ this.state.token)
    this.UpdateUserToken();
    this.props.navigation.addListener('focus',()=> this.setState({activityList:true}),()=> this.setState({activityList:false}))

    });
    this.getData();

    
  }
    _handleNotification = (notification) => {
    this.setState({ notification: notification });
    alert(notification);
    };

  
  
    sendPushNotification =async()=> {
      let message = {
        to: this.state.token,
        sound: 'default',
        title: 'Push my notification',
        body: 'tamir sent you a message!',
        data: { someData: {name:'tamir',day: new Date()} },
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      console.log(message.data)
    }
      
    async getData () {
      try {
        jsonValue = await AsyncStorage.getItem('UserId')
        jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
        console.log(UserDetails)
        this.setState({ UserId: UserDetails.UserId })
  
      } catch (e) {
        this.setState({ AlertModal: 'Error get Item' });
        { this.setModalVisible(true) }
        // error reading value
      }
    }
    
    
UpdateUserToken=async()=>{
  let userId= this.state.UserId;
  let token = this.state.token;
  console.log('in update')
  console.log('userid : ' + userId)
  console.log('token : ' + token)
  userToken={
    userId:userId,
    token:token,
  }
  let api = "http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Users/{UpdateUserToken}?userId="+userId+"&token="+token
await    fetch(api, {
  method: 'PUT',
  // body: JSON.stringify(userToken),
  headers: new Headers({
    'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
  })
})
console.log("token have been updated!!!!!!!!!");
}
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (

      <View style={{ backgroundColor: 'white' }} >

        <View>
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
                  onPress={() => this.setModalVisible(true)}
                >
                  <Text style={styles.textStyle}> סגור </Text>
                </Pressable>
              </View>
            </View>
          </Modal>

        </View>
        <View style={{ borderTopColor: 'black', borderTopWidth: 2 }} >
          <View ><Text style={styles.ActivityHeader}> פעולות אחרונות </Text></View>
        
            <View style={{ maxHeight: 250 }}>
              <HomeActivityList activityList={this.state.activityList} />
            </View>
       
          <Button
            title='הארנק שלי'
            onPress={() => { this.props.navigation.navigate('payments'); }}
            buttonStyle={{ width: 100, alignSelf: 'center', margin: 10, borderRadius: 6, borderWidth: 1.5, borderColor: 'black' }}
            titleStyle={{ fontWeight: 'bold', color: 'black' }} />

        </View>
        <View style={{ backgroundColor: '#A7D489', borderTopRightRadius: 20, borderTopLeftRadius: 20, margin: 4, marginBottom: 0, borderWidth: 1, borderBottomWidth: 0, borderColor: 'black' }}>
          <Text style={{ textAlign: 'center', fontSize: 20, padding: 20, borderColor: 'black', fontWeight: 'bold' }}>מה הג'סטה הבאה שלך ?</Text>

          <Button
            title='שליח רכבת'
            onPress={() => { this.props.navigation.navigate('TrainSelection'); }}
            buttonStyle={{ marginBottom: 2, height: 60, backgroundColor: 'green' }}

          />

          <Button
            title='שולח חבילה'
            onPress={() => { this.props.navigation.navigate('NewDelivery'); }}
            buttonStyle={styles.title}
          />

          <Button
            title='שליח אקספרס'
            onPress={() => { this.props.navigation.navigate('NewExpressRoute'); }}
            buttonStyle={styles.title}

          />

{/* <Button
          title='ניסיון פוש נוט'
          onPress={()=>{this.sendPushNotification()}}
          buttonStyle={styles.title}

        /> */}


        </View>
        <Image
          source={{ uri: 'https://i.pinimg.com/originals/e0/f4/80/e0f480f3cfdae579699f62a70c57d891.jpg' }}
          style={{ width: 400, height: 300, justifyContent: 'center', alignItems: 'center', }}
        />

      </View>

    );
  }
}
const styles = StyleSheet.create({
  safeview: {
    flex: 1,
  },
  LastOperations: {
    maxHeight: 10,
  },
  title: {
    marginBottom: 2,
    marginTop: 5,
    height: 60,
    backgroundColor: 'green',
  },
  ActivityHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
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