import React, { Component } from 'react';
import {StyleSheet} from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, View,  } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeActivityList extends Component {
  constructor(props){
    super(props);
    this.state = {
      ActivityList1:[],
      UserID:0,
      ActivityList2:[]
    };
  }
  async componentDidMount () {
    ////tar2 - url צריך לשנות אחרי שמעדכנים ל tar 1
     {this.getData()}
    
   };
   async getFromServer(){
    const UserId= this.state.UserID;
    console.log(this.state.UserID);
      const ActivityListData ='http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity?UserID='+UserId;
      const responseActivityList = await fetch(ActivityListData);
      const data = await responseActivityList.json()
      this.setState({ActivityList1:data,})
      console.log(data);
      
      const ActivityListDataTD ='http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity/{ModuleActivityTD}/'+UserId;
      const responseActivityListTD = await fetch(ActivityListDataTD);
      const dataTD = await responseActivityListTD.json()
      this.setState({ActivityList2:dataTD})
      console.log(dataTD)
   }

   async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetails = JSON.parse(jsonValue) : null;
      
      this.setState({ UserID:UserDetails.UserId });
     
      console.log("im at HomeActivityList");
      console.log(UserDetails.UserId);
      this.getFromServer();
    } catch (e) {
      alert('Error get Item')
      // error reading value
    }
  }


  render() {
    let Activities = this.state.ActivityList1.map((Activities,key) =>{
      
     return(<ListItem avatar key={key} ><Right><Thumbnail style={{borderWidth:1 , borderColor:'black' }} source={{uri:'https://i.ibb.co/vcgW6dB/Sender-Package.jpg'}}/>
      </Right>
      <Body>
       <Text> </Text>
        <Text style={{fontWeight:'bold'}} note >מוצא :  {Activities.StartStation} </Text>
        <Text style={{fontWeight:'bold'}} note >יעד :  {Activities.EndStation} </Text>
      </Body>
      <Left>
        <Text style={{fontWeight:'bold'}} note> סטטוס : {Activities.Status}    </Text>
      </Left>
       </ListItem>)
    });

    let ActivitiesTD = this.state.ActivityList2.map((Activities,key) =>{
      return(<ListItem avatar key={key}  ><Right><Thumbnail style={{borderWidth:1 , borderColor:'black' }} source={{uri:'https://i.ibb.co/HHjzgtP/Delivery-TD.jpg'}}/>
       </Right>
       <Body>
        <Text> </Text>
         <Text style={{fontWeight:'bold'}} note >מוצא :  {Activities.StartStation} </Text>
         <Text style={{fontWeight:'bold'}} note >יעד :  {Activities.EndStation} </Text>
       </Body>
       <Left>
         <Text style={{fontWeight:'bold'}} note> סטטוס : {Activities.Status}    </Text>
       </Left>
        </ListItem>)
     });
    return (
      <ScrollView style={styles.LastOperations}>
      <Container style={styles.LastOperations}>
       
        <Content>
          
          <List >
          {/* <ActivityIndicator style={{marginTop:150}} size="large" color="#A7D489" /> */}
            <View >

            {this.state.ActivityList1.length > 0 || this.state.ActivityList2.length > 0 ?(<View >{ActivitiesTD}{Activities}</View>): <Image style={{width:200,height:150,alignSelf:'center',marginTop:40}} source={{ uri: 'https://i.gifer.com/FpSr.gif'}} />}

              {/* {Activities} */}
            </View>
           
          </List>
        </Content>
      </Container>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
    safeview: {
      flex: 1,
    },
    LastOperations:{
     
    
     marginBottom:10,
   
    
     
    }
  });
