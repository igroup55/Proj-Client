import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Image, TouchableOpacity, Pressable, Modal } from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, View, Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native';

export default class HomeActivityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActivityList1: [],
      UserID: 0,
      ActivityList2: [],
      AlertModal: '',
      modalVisible: false,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  async componentDidMount() {
    ////tar2 - url צריך לשנות אחרי שמעדכנים ל tar 1
    { this.getData() }

  };
  async getFromServer() {
    const UserId = this.state.UserID;
    console.log(this.state.UserID);
    const ActivityListData = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity?UserID=' + UserId;
    const responseActivityList = await fetch(ActivityListData);
    const data = await responseActivityList.json()
    this.setState({ ActivityList1: data, })
    console.log(data);

    const ActivityListDataTD = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity/{ModuleActivityTD}/' + UserId;
    const responseActivityListTD = await fetch(ActivityListDataTD);
    const dataTD = await responseActivityListTD.json()
    this.setState({ ActivityList2: dataTD })
    console.log(dataTD)
  }

  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;

      this.setState({ UserID: UserDetails.UserId });

      console.log("im at HomeActivityList");
      console.log(UserDetails.UserId);
      this.getFromServer();
    } catch (e) {
      // error reading value
      this.setState({ AlertModal: 'Error get Item' });
      { this.setModalVisible(true) }
    }
  }


  render() {
    let Activities = this.state.ActivityList1.map((Activities, key) => {
      if (Activities.Status === 1) {
        var status = <Image style={{ width: 30, height: 30 , marginRight:20}} source={{ uri: 'https://img.icons8.com/emoji/50/000000/red-circle-emoji.png' }} />
      }
      if (Activities.Status === 2) {
        var status = <Image style={{ width: 30, height: 30 , marginRight:20}} source={{ uri: 'https://img.icons8.com/emoji/50/000000/orange-circle-emoji.png' }} />
      }
      if (Activities.Status === 3) {
        var status = <Image style={{ width: 30, height: 30 , marginRight:20}} source={{ uri: 'https://img.icons8.com/emoji/50/000000/yellow-circle-emoji.png' }} />
      }
      if (Activities.Status === 4) {
        var status = <Image style={{ width: 30, height: 30 , marginRight:20}} source={{ uri: 'https://img.icons8.com/emoji/50/000000/green-circle-emoji.png' }} />
      
      }

       return (<ListItem avatar key={key} ><Right><Thumbnail style={{ borderWidth: 1, borderColor: 'black' }} source={{ uri: 'https://i.ibb.co/vcgW6dB/Sender-Package.jpg' }} />
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
      </ListItem>)
    });

    let ActivitiesTD = this.state.ActivityList2.map((Activities, key) => {
      if (Activities.Status === 0) {
        var status = <Image style={{ width: 30, height: 30 , marginRight:20}} source={{ uri: 'https://img.icons8.com/emoji/50/000000/orange-circle-emoji.png' }} />


      }
      if (Activities.Status === 1) {
        var status = <Image style={{ width: 30, height: 30 , marginRight:20}} source={{ uri: 'https://img.icons8.com/emoji/50/000000/green-circle-emoji.png' }} />
   
      }
      if (Activities.Status === -1) {
        var status = <Image style={{ width: 30, height: 30 , marginRight:20}} source={{ uri: 'https://img.icons8.com/emoji/50/000000/red-circle-emoji.png' }} />
      }
    
      return (<ListItem avatar key={key}  ><Right><Thumbnail style={{ borderWidth: 1, borderColor: 'black' }} source={{ uri: 'https://i.ibb.co/HHjzgtP/Delivery-TD.jpg' }} />
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
      </ListItem>)
    });
    return (
      <SafeAreaView>
        <ScrollView style={styles.LastOperations}>
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
          <Content>

            <List >
              {/* <ActivityIndicator style={{marginTop:150}} size="large" color="#A7D489" /> */}
              <View >

                {this.state.ActivityList1.length > 0 || this.state.ActivityList2.length > 0 ? (<View >{ActivitiesTD}{Activities}</View>) : <Image style={{ width: 200, height: 150, alignSelf: 'center', marginTop: 40 }} source={{ uri: 'https://i.gifer.com/FpSr.gif' }} />}

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
