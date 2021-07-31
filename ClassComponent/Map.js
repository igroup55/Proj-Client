import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps'
  ;
import React, { Component } from 'react';


export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <MapView
            style={{ flex: 0.7, width: Dimensions.get('window').width - 30, }}
            region={{
              latitude: 32.157154,
              longitude: 34.843893,
              latitudeDelta: 0.0122,
              longitudeDelta: 0.0121,
            }} >
            <Marker
              coordinate={{
                latitude: 32.15715,
                longitude: 34.843893
              }}
              title='my place:)'
              description='here i am'
            />
          </MapView>
        </View>
      </View>
    );
  }
}

const styles = ({
  container: {
    flex: 1,
    backgroundColor: '#cbe8ba',
    alignItems: 'center',
    justifyContent: 'center',

  },
});