import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class CCDeliveryExpressFeed extends Component {

  constructor(props) {
    super(props);
    state = {
PackagesList : []

    }
  }
  
componentDidMount(){

  this.getpackages()
}
   getpackages = async () => {

    const apiExpressUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight=' + weight + '&express='+express;
    const response = await fetch(apiExpressUrl);
    const data = await response.json()
    this.setState({ PackagesList: data })


    }




  render() {

    
   let ExpressFeed = this.state.PackagesList.map((pack, key) => {
    
 return (<Text> {pack.StartStation} </Text>)
    
    })
    
  
    return (
      <View>
        <Text> {ExpressFeed} </Text>
      </View>
    )
  }
}
