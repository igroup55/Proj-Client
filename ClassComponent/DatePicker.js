import React, { Component } from 'react';
import { Container, Header, Content, DatePicker, Text } from 'native-base';

export default class DatePickerExample extends Component {
  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
    this.setDate = this.setDate.bind(this);
  }
  
  render() {
    return (
      <Text></Text>
    );
  }
}