import React, { Component } from 'react';
import {StyleSheet} from 'react-native'
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text,  } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator,Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeActivityList extends Component {
  constructor(props){
    super(props);
    this.state = {
      ActivityList:[],
      UserID:0,
    };
  }
  async componentDidMount () {
    ////tar2 - url צריך לשנות אחרי שמעדכנים ל tar 1
     {this.getData()}
    
   };
   async getFromServer(){
    const UserId= this.state.UserID;
    console.log(this.state.UserID);
      const apiStationsUrl ='http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity?UserID='+UserId;
      const response = await fetch(apiStationsUrl);
      const data = await response.json()
      this.setState({ActivityList:data,})
      console.log(data);
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
    let Activities = this.state.ActivityList.map((Activities,key) =>{
      return(<ListItem avatar key={key}><Right><Thumbnail source={{uri:'https://blog.cpanel.com/wp-content/uploads/2019/08/user-01.png'}}/>
      </Right>
      <Body>
       <Text> </Text>
        <Text style={{fontWeight:'bold'}} note > תחנת מוצא : {Activities.StartStation} </Text>
        <Text style={{fontWeight:'bold'}} note > תחנת יעד: {Activities.EndStation} </Text>
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
            <TouchableOpacity>
            {this.state.ActivityList.length>0?(Activities): <Image style={{width:200,height:150,alignSelf:'center',marginTop:40}} source={{ uri: 'https://i.gifer.com/FpSr.gif'}} />}
              {/* {Activities} */}
            </TouchableOpacity>
           
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
     maxHeight:250,
     borderTopWidth:1,
     marginBottom:10,
   
    
     
    }
  });
  const operation ={
   
  };