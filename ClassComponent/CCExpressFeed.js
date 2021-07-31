import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Icon, Button } from 'native-base';
import Constants from 'expo-constants';

const Data = [
  {
    id: 1,
    first_name: 'Sile',
  },
  {
    id: 2,
    first_name: 'Clementia',
  },
  {
    id: 3,
    first_name: 'Brita',
  },
  {
    id: 4,
    first_name: 'Duke',
  },
  {
    id: 5,
    first_name: 'Hedvig',
  },
  {
    id: 6,
    first_name: 'Paulie',
  },
  {
    id: 7,
    first_name: 'Munmro',
  },
  {
    id: 8,
    first_name: 'Dyanna',
  },
  {
    id: 9,
    first_name: 'Shanta',
  },
  {
    id: 10,
    first_name: 'Bambi',
  },
];

import { Card } from 'react-native-paper';

export default class ExpressFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      renderData:Data
    };
  } 

  onPressHandler(id) {
    let renderData=[...this.state.renderData];
    for(let data of renderData){
      if(data.id==id){
        data.selected=(data.selected==null)?true:!data.selected;
        break;
      }
    }
    this.setState({renderData});
  }

  render() {
    
    return (
      <View>
        <FlatList
          //horizontal={true}
          data={this.state.renderData}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.onPressHandler(item.id)}>
              <Card
                style={
                  item.selected==true
                    ? {
                        padding: 10,
                      
                        margin:5,
                        borderRadius: 5,
                        backgroundColor: 'green',
                      }
                    : {
                        padding: 10,
                        margin:5,
                        borderRadius: 5,
                        backgroundColor: '#a1a1a1',
                      }
                }>
                    <View >
                <Text >{item.first_name}</Text>
                
                   <Text>מס חבילה :</Text>
                   <Text>מס חבילה :</Text>
                   <Text>מס חבילה :</Text>
                   <Text>מס חבילה :</Text>
                   </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
