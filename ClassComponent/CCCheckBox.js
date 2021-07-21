import React, { useState } from "react";
import { CheckBox, Text, StyleSheet, View } from "react-native";
import { Container, Header, Content, Form, Item, Input, Label, Picker, Footer, Right, Button, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const CheckBoxes = () => {

  var Address = ''

  const [isSelected, setSelection] = useState(false);
  this.storeData('Express?',isSelected)
  
  return (
    <View style={styles.section}>
      <Icon style={{ alignSelf: 'center' }} name="home" />
      <Text style={styles.titles}>משלוח עד הבית ?</Text>
      <View style={{ alignSelf: 'center' }}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
        />
      </View>

      <Text>
        {isSelected ? (<View style={styles.section}>
          <View  >
            <Item>
              <Label>כתובת</Label>
              <Input style={styles.InputText}
                placeholderTextColor="grey"
                placeholder="כתובת"
                returnKeyType="next"
                onChangeText={val => {Address= val }}
                onBlur = {(e) => this.storeData('Address',Address)}
              />
              </Item>
              <Text style={{color:'grey'}}> עיר , שם רחוב , מספר בית*</Text>
          </View>
        </View>) : null}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  section: {
    marginTop: 15,
    marginBottom: 5,


  },
  titles: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    alignItems: 'center'
  },
  InputText: {
    textAlign: 'right',
    borderColor: 'green',
    borderStyle: 'solid',
    backgroundColor: '#cbe8ba',
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    alignSelf: 'center',
    width: 365
  },
});

export default CheckBoxes;