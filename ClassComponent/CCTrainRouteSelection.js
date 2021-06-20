import React, { Component, useState } from 'react';
import { CheckBox, Container, Header, Content, Form, Item, Input, Label, Picker, Footer, Right, Button, Icon } from 'native-base';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBoxes from './CCCheckBox';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'




export default class CCTrainRouteSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected1: null,
      selected2: null,
      selected3: null,
      date: new Date(),
      StationsList: []
    };

  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
  async componentDidMount() {

    const apiStationsUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Stations';
    const response = await fetch(apiStationsUrl);
    const data = await response.json()
    this.setState({ StationsList: data, })
    console.log(data);
  };
  onValueChange1 = (value) => {
    this.setState({
      selected1: value
    });
    console.log(this.state.selected1);

  }
  onValueChange2 = (value) => {
    this.setState({
      selected2: value
    });
    console.log(this.state.selected2);

  }
  onValueChange3 = (value) => {
    this.setState({
      selected3: value
    });
    console.log(this.state.selected3);
  }


  navigate = () => {

    this.props.navigation.navigate('DeliveryFeed')


  }

  render() {
    const { date } = this.state;
    let stations = this.state.StationsList.map((stations, key) => {
      return (<Picker.Item key={key} label={stations.StationName} value={stations.StationID} />)
    });

    return (
      <SafeAreaView>
        <ScrollView>
          <View >

            <Form style={{ width: 390 }}>
              <View >
                <Icon name="location" style={{ alignSelf: 'center', marginTop: 10 }} />
                <Text style={styles.titles} >תחנת מוצא</Text>
                <Item picker style={styles.InputText}>
                  <Picker
                    mode="dropdown"
                    style={{ textAlign: 'right' }}
                    placeholder="בחר תחנת מוצא"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange1.bind(this)}
                  >

                    <Picker.Item label='בחר תחנת מוצא' value='None' />

                    {stations}


                  </Picker>
                </Item>
              </View>

              <View style={styles.section}>
                <Icon name="flag" style={{ alignSelf: 'center', marginTop: 10 }} />
                <Text style={styles.titles}>תחנת יעד</Text>
                <Item picker style={styles.InputText}>

                  <Picker
                    mode="dropdown"
                    placeholder="בחר תחנת יעד"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.selected2}
                    onValueChange={this.onValueChange2.bind(this)}
                  >
                    <Picker.Item label="בחר תחנת יעד" value="key0" />
                    {stations}
                  </Picker>
                </Item>
              </View>



              <Text style={{ alignSelf: 'center', marginTop: 10, fontWeight: 'bold' }}>בחר תאריך נסיעה</Text>
              {/* <Icon name="calendar"  style={{ alignSelf: 'center', marginTop: 10 }} /> */}

              {/* <DatePicker
        style={{ alignSelf: 'center', marginTop: 10 }}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="DD-MM-YYYY"
        minDate={new Date()}
        maxDate="2021-12-30"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={(date) => {this.setState({date: date}) }}
      /> */}

              <Button onPress={this.navigate} style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 70, borderRadius: 10, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold' }}>  חפש משלוחים </Text></Button>

            </Form>



          </View>
        </ScrollView>
      </SafeAreaView>
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
  InputText: {
    textAlign: 'right',
    borderColor: 'green',
    borderStyle: 'solid',
    backgroundColor: '#cbe8ba',
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10
  },
  titles: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    alignItems: 'center'
  },
  section: {
    marginTop: 15,
    marginBottom: 5
  }

});
