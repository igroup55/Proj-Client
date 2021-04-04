import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Header, Image } from 'react-native-elements';

import HomeActivityList from './HomeActivityList';




export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (

      <View style={{backgroundColor:'white'}} > 

        <View>

          {/* <Header
  leftComponent={{ icon: 'menu', color: '#A7D489' }}
 
  rightComponent={{ icon: 'home', color: '#fff' }}
    /> */}
        </View>
        <View >
     
          <HomeActivityList  />

          <Button
            title='הארנק שלי'
            onPress={() => { this.props.navigation.navigate('payments'); }}
            buttonStyle={{width:100,alignSelf:'center',marginBottom:5,borderRadius:6,borderWidth:1.5,borderColor:'black'}}
            titleStyle={{fontWeight:'bold',color:'black'}}/>



        </View>
        <View style={{backgroundColor:'#A7D489' , borderTopRightRadius:20, borderTopLeftRadius:20 , margin:4,marginBottom:0 , borderWidth:1,borderBottomWidth:0 , borderColor:'black'}}>
        <Text style={{ textAlign: 'center', fontSize: 20, padding: 20, borderColor: 'black', fontWeight:'bold' }}>מה הג'סטה הבאה שלך ?</Text>

    

          <Button
            title='שליח רכבת'
            onPress={() => { this.props.navigation.navigate('TrainSelection'); }}
            buttonStyle={{ marginBottom:2,height:60,backgroundColor:'green'}}
          
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
  title:{
    marginBottom:2,
    marginTop:5,
    height:60,
    backgroundColor:'green',
   
  

  }
});