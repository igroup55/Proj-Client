import React, { Component } from 'react'
import {  View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Body, Left, Right, Text} from 'native-base';
import { Button } from 'react-native-paper';

export default class CCExpressLockers extends Component {

    constructor(props) {
        super(props);
        this.state={
UserDetails : null,
Packages : [],
SelectedStation: ''

        }
    }

    async componentDidMount() {

        this.getData()

    
       

    }

    async getData () {
        try {
        
            jsonValue = await AsyncStorage.getItem('UserId')
            jsonValue != null ? User = JSON.parse(jsonValue) : null;
            this.setState({ UserDetails: User },()=>{console.log(this.state.UserDetails.UserId) , this.getfromserver()})
           
            jsonValue = await AsyncStorage.getItem('XSStationName')
            jsonValue != null ? Station = JSON.parse(jsonValue) : null;
            this.setState({ SelectedStation: Station },()=>console.log(this.state.SelectedStation))
           
          
            
            
        }
        catch (e) {
          // alert('error get item')
          // this.setState({ AlertModal: 'Error get Item' });
          // { this.setModalVisible(true) }
          // error reading value
        }

      
      }

      getfromserver = async () =>{

   

            const ActivityListDataEx = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ModuleActivity/{ModuleActivity}/{Express}/' + this.state.UserDetails.UserId;
            const responseActivityListEx = await fetch(ActivityListDataEx);
            const dataEx = await responseActivityListEx.json()
            this.setState({ Packages: dataEx },()=>console.log(this.state.Packages))
            


           

     }
    
    render() {

      let Check = this.state.Packages.map((pack,key)=>{
if(pack.StartStation === this.state.SelectedStation){

    if(pack.Status == 1){

        return(<View style={{margin : 20 , borderColor:'black',borderWidth:1,borderRadius:10,backgroundColor:'white'}} key={key}>
         
           <View style={{padding:5, borderBottomColor:'black',borderBottomWidth:1,marginRight:0,marginLeft:0}}>
        <Text style={{fontSize:14}}><Text style={{fontWeight:'bold',fontSize:14}}> מס' חבילה : </Text>{pack.PackageID}</Text>
        <Text  style={{fontSize:14}}><Text style={{fontWeight:'bold',fontSize:14}}> תחנת איסוף : </Text>{pack.StartStation}</Text>
        <Text  style={{fontSize:14}}><Text style={{fontWeight:'bold',fontSize:14}}> לוקר איסוף : </Text>{pack.UserID2}</Text>
        <Text  style={{fontSize:14}}><Text style={{fontWeight:'bold',fontSize:14}}> כתובת יעד : </Text>{pack.EndStation}</Text>
        </View>
        <View style={{backgroundColor:'#ffed4b',borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
            <Button labelStyle={{color:'black',fontWeight:'bold'}}>איסוף</Button>
            </View>
        </View>)

    }
    if(pack.Status == 2){

        let User = pack.PackageID
        return(<View key={key}><Text>{User} Done</Text></View>)
    
    }
}
// else{

// }

    

         })
        return (
            <View style={{backgroundColor:'lightyellow',flex:1}}>
                <View style={{borderWidth:1,borderColor:'black',marginRight:70,marginLeft:70,marginBottom:20,marginTop:40,borderRadius:10,backgroundColor:'#ffed4b'}}>
            <Button labelStyle={{color:'black',fontWeight:'bold'}} icon={'plus'} onPress={()=>this.props.navigation.navigate('DeliveryExpress')}>שריין חבילה</Button>
            </View>
            {Check}
           </View>
        )
    }
}
