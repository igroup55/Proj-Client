import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';


export default class CCDeliveryExpressFeed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      PackagesList: [],
      StartStation: null,
      EndStation: 0,
      StationName: '',
      StationLat: null,
      StationLong: null,
      selectedItem: [],
      SelectedArr: []


    }
  }

  async componentDidMount() {

    this.getData('start')

    let values = await AsyncStorage.multiGet(['XSStationName', 'XSstationLat', 'XSstationLong'])

    this.setState({ StationName: values[0][1], StationLat: values[1][1], StationLong: values[2][1] })
  }

  onPressHandler(pack) {
 
    let renderData = [...this.state.PackagesList];

    renderData.map((data, key) => {

      if (data.PackageId === pack.PackageId) {

        data.selected = (data.selected == null) ? true : !data.selected;

      
      }

      this.setState({ renderData });
    })
    
    this.setState({SelectedArr : [...renderData]})
  

  }

  async getData (activity) {
    try {
      if (activity === 'start') {
        jsonValue = await AsyncStorage.getItem('XStartStation')
        jsonValue != null ? ExpressStation = JSON.parse(jsonValue) : null;
        this.setState({ StartStation: ExpressStation })
        this.getpackages()
      }


      if (activity === 'selectedpacks') {

        jsonValue = await AsyncStorage.getItem('SelectedPacks')
        jsonValue != null ? ExpressPacks = JSON.parse(jsonValue) : null;
        this.setState({ SelectedArr: ExpressPacks })

      }

    }
    catch (e) {
      // alert('error get item')
      // this.setState({ AlertModal: 'Error get Item' });
      // { this.setModalVisible(true) }
      // error reading value
    }
  }

  storeData = async (key, value) => {

    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(key + ": " + jsonValue);
    }
    catch (e) {
      console.log(e);
    }
  };

  getpackages = async () => {
    let weight = 0
    let express = 'True'

    const apiExpressUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight=' + weight + '&express=' + express;
    const response = await fetch(apiExpressUrl);
    const data = await response.json()
    this.setState({ PackagesList: data })
    console.log(this.state.PackagesList)
  }

  AddSelectedPacks = () => {

let selected = []
    this.state.SelectedArr.map((pack, key) => {
    if(pack.selected === true){
      console.log('SelectedArr : ' +pack.selected)
      // this.setState({ selectedItem: [...this.state.selectedItem, pack] }, () => {console.log(this.state.selectedItem)})
   selected.push(pack)
   
    }
   
    
    })
    console.log(selected)
    this.setState({selectedItem: selected},()=>{console.log(this.state.selectedItem)
    
    
      fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/ExpressUser', {
        method: 'POST',
        body: JSON.stringify(customer_data),
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
        })
      })

    })

    // alert(this.state.SelectedArr);
    //   this.setState({ SelectedArr: [...this.state.SelectedArr, pack] })
    //   else
    //  this.setState = items.filter(item => item !== valueToRemove)
    // this.setState({ SelectedArr: [...this.state.SelectedArr, pack] })

   
  }


  render() {

    if (this.state.PackagesList.length !== 0) {
      return (

        <View><FlatList
          // horizontal={true}
          data={this.state.PackagesList}
          keyExtractor={item => item.PackageId.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.onPressHandler(item)}>
              <Card
                style={
                  item.selected === true
                    ? {
                      padding: 10,
                      margin: 5,
                      borderRadius: 5,
                      backgroundColor: 'green',
                    }
                    : {
                      padding: 10,
                      margin: 5,
                      borderRadius: 5,
                      backgroundColor: '#a1a1a1',
                    }
                }>
                <View >
                  <Text>{item.id}</Text>
                  <Text>מס חבילה : {item.PackageId}</Text>
                  <Text>מחיר משלוח : {item.Price}</Text>
                  <Text>משקל : {item.Pweight}</Text>
                  <Text>תחנת איסוף : {this.state.StationName}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />

          <TouchableOpacity  style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 50,padding:10, borderWidth: 1, borderColor: 'black' }} onPress={this.AddSelectedPacks}><Text style={{textAlign:'center' , fontWeight:'bold' , fontSize:15}}>שריין חבילה</Text></TouchableOpacity>
        </View>)

    }

    else
      return (<Text> No Packages Found </Text>)


  }
}
