
import * as React from 'react';
import { List, Checkbox, Button } from 'react-native-paper';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TextInput, Text, View, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'native-base';


class CCDeliveryFeed1 extends React.Component {

  state = {
    expanded: false,
    StartStation: null,
    EndStation: null,
    PackagesList1: [],
    PackagesList2: [],
    PackagesList3: [],
    PackagesList: [],
    PackageExist: null,
    SStationName: '',
    EStationName: '',
    UserDetail: null,
    TDUserList1: [],
    TDUserList2: [],
    TDUserList3: [],
    TDUserList: [],
    Pweight: null,
    Rating3: 100,
    Rating6: 100,
    Rating10: 100,
    RatingSum: 0,
    latitude: 0,
    longitude: 0,
    SstationLat: 0,
    SstationLong: 0,
    EstationLat: 0,
    EstationLong: 0,
    canOpenLocker: 0,
    error: null,
    AlertModal: '',
    modalVisible: false,
    refresh3: false,
    refresh6: false,
    refresh10: false



  }


  _handlePress = () =>
    this.setState({
      expanded: !this.state.expanded
    });

  async componentDidMount() {
    { this.getData() }



    let values = await AsyncStorage.multiGet(['StartStation', 'EndStation', 'SStationName', 'EStationName'])
    let locationValues = await AsyncStorage.multiGet(['SstationLat', 'SstationLong']);

    this.setState({ StartStation: values[0][1], EndStation: values[1][1], SStationName: values[2][1], EStationName: values[3][1] })
    this.setState({ SstationLat: locationValues[0][1] })
    this.setState({ SstationLong: locationValues[1][1] })

    ///current location function
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      });
    },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    );

    this.getpackages(3.0);
    this.getpackages(6.0);
    this.getpackages(10.0);


  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetail = JSON.parse(jsonValue) : null;
      this.setState({ UserDetail: UserDetail.UserId })


    } catch (e) {
      this.setState({ AlertModal: 'Error get Item' });

      { this.setModalVisible(true) }
      // error reading value
    }
  }

  isNearLocker() {
    const NearDistance = 0.1;
    let currentLat = this.state.latitude;
    let currentLong = this.state.longitude;
    let stationLat = this.state.SstationLat;
    let stationLong = this.state.SstationLong;
    let CurrentDistance = 0;
    CurrentDistance = this.computeDistance([currentLat, currentLong], [stationLat, stationLong]);
    console.log("your distance from the station is :" + CurrentDistance + " km");
    if (CurrentDistance >= NearDistance) {


      this.setState({ canOpenLocker: 1 })

    }
    else {

      this.setState({ AlertModal: "אינך נמצא בקרבת הלוקר !! " });
      { this.setModalVisible(true) }

    }


  }
  //שימוש בנוסחאת האברסין לחישוב מרחק בין 2 נקודות בעלות נקודות אורך ורוחב
  computeDistance([prevLat, prevLong], [lat, long]) {
    const prevLatInRad = this.toRad(prevLat);
    const prevLongInRad = this.toRad(prevLong);
    const latInRad = this.toRad(lat);
    const longInRad = this.toRad(long);

    return (
      // In kilometers
      6377.830272 * Math.acos(Math.sin(prevLatInRad) * Math.sin(latInRad) + Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),

      )
    );
  }

  toRad(angle) {
    return (angle * Math.PI) / 180;
  }
  //---------------------------------------
  // כפתור - אני כאן -
  //   Get Packages By Weight And StationID - GET TO PAckages By Sending Paramter weight and stationID
  //   We Choose One Package From The Response 
  //   Render the Locker ID To User To Take the PAckage From the Locker ( נא לגשת ללוקר מספר *** ולאסוף את החבילה)

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

  AddTDUser(weight) {

    this.setState({ AlertModal: 'קטגוריה סומנה בהצלחה !! ' + "\n" + ' לחץ - אני כאן - בעת ההגעה לתחנת רכבת' }, () => { this.setModalVisible(true) });

    // setTimeout(() => {
    //   this.props.navigation.navigate('Home');
    // }, 2000);




    const TDUsers_data = {

      UserID: this.state.UserDetail,
      Pweight: weight,
      Status: 0,
      StartStation: this.state.StartStation,
      EndStation: this.state.EndStation,
      Rating: this.state.Rating

    }


    fetch('http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser', {
      method: 'POST',
      body: JSON.stringify(TDUsers_data),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {

        },
        (error) => {
          console.log("err post=", error);
        }).then(
          () => {

            if (weight === 3) {
              this.setState({ refresh3: true }, () => this.setState({ refresh3: false }))
            }

            if (weight === 6) {
              this.setState({ refresh6: true }, () => this.setState({ refresh6: false }))
            }

            if (weight === 10) {
              this.setState({ refresh10: true }, () => this.setState({ refresh10: false }))

            }
          }

        );




  }




  async Interested(weight) {



    this.setState({ Pweight: weight })
    const apiTDUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?UserId=' + this.state.UserDetail;
    const response = await fetch(apiTDUserUrl);
    const data = await response.json()
    console.log('Data : ' + data)
    // const GetRating = {

    //   UserID:this.state.UserDetail

    // }

    const GetRatingUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser/{UpdatedRating}/' + this.state.UserDetail;
    const RatingResponse = await fetch(GetRatingUrl);
    const GetRating_Data = await RatingResponse.json()

    if (GetRating_Data[0] === undefined) {
      this.setState({ Rating: 5 })

    }

    else {
      this.setState({ Rating: GetRating_Data[0].Rating })
      console.log(GetRating_Data[0].Rating)
    }



    if (data.UserID === 0) {

      if (weight === 3)
        if (this.state.PackagesList1.length === 0) {

          this.setState({ AlertModal: "No Packages Found" });
          { this.setModalVisible(true) }
        }
        else {
          this.AddTDUser(weight)

        }
      if (weight === 6)
        if (this.state.PackagesList2.length === 0) {
          this.setState({ AlertModal: "No Packages Found" });
          { this.setModalVisible(true) }

        }

        else {
          this.AddTDUser(weight)

        }
      if (weight === 10)
        if (this.state.PackagesList3.length === 0) {
          this.setState({ AlertModal: "No Packages Found" });
          { this.setModalVisible(true) }
        }

        else {

          this.AddTDUser(weight)


        }





    }
    else {

      this.setState({ AlertModal: 'כבר התעניינת בקטגוריה' });

      { this.setModalVisible(true) }

    }

    //   התעניינות--------------------------
    // GET -CHECk if the user is interested in any packages ( the user is limited to 1 till now)
    // POST TO TDUSER ( UserId ,Pweight,Status)

    // איסוף------------

    //   כפתור איסוף
    //   Put to Packages ( Change Status to 3 (נאסף) )
    //   Put to Lockers ( Change Status To 0 ( פנוי))
    //    Put to TDUser ( add PackageID)


  }

  ChanceToPickup() {



    if (this.state.TDUserList.length !== 0) {
      let RatingSum = 0;
      let RatingArr = [];
      this.state.TDUserList.map((interest, key) => {

        RatingArr.push(interest["Rating"] / 10)


      })

      let TDRating = RatingSum / this.state.TDUserList.length;
      TDRating = 10 - TDRating;


      if (this.state.TDUserList[0]["Pweight"] === 3 && this.state.TDUserList1.length !== 0 && this.state.PackagesList1.length <= this.state.TDUserList1.length) {
        var SuccessArr = []
        let Size = this.state.PackagesList1.length
        SuccessArr = this.k_combinations(RatingArr, Size);
        console.log(SuccessArr)
        console.log(SuccessArr[0][0] + ' * ' + SuccessArr[0][1])

        var total = 0;
        var probability = 1;
        for (let i = 0; i < SuccessArr.length; i++) {
          if (this.state.PackagesList1.length !== 1)
            var probability = 1;
          for (let j = 0; j < Size; j++) {
            if (this.state.PackagesList1.length !== 1)
              probability *= SuccessArr[i][j]
            else
              probability = SuccessArr[i][j]

          }
          console.log(probability);
          total += probability
        }
        console.log(this.state.TDUserList1)

        if (this.state.PackagesList1.length === 1 && this.state.TDUserList1.length > 1)
          total = (total / (this.state.TDUserList1.length) * (1 / this.state.TDUserList1.length))
        else
          total = 1 - (total / this.state.TDUserList1.length)
        total = total.toFixed(2);
        console.log('total : ' + (total));
        this.setState({ Rating3: total * 100 })

      }

      if (this.state.TDUserList[0]["Pweight"] === 6 && this.state.TDUserList2.length !== 0 && this.state.PackagesList2.length <= this.state.TDUserList2.length) {

        var SuccessArr = []
        let Size = this.state.PackagesList2.length
        SuccessArr = this.k_combinations(RatingArr, Size);
        console.log(SuccessArr)
        console.log(SuccessArr[0][0] + ' * ' + SuccessArr[0][1])

        var total = 0;
        var probability = 1;
        for (let i = 0; i < SuccessArr.length; i++) {
          if (this.state.PackagesList2.length !== 1)
            var probability = 1;
          for (let j = 0; j < Size; j++) {
            if (this.state.PackagesList2.length !== 1)
              probability *= SuccessArr[i][j]
            else
              probability = SuccessArr[i][j]

          }
          console.log(probability);
          total += probability
        }
        console.log(this.state.TDUserList2)

        if (this.state.PackagesList2.length === 1 && this.state.TDUserList2.length > 1)
          total = (total / (this.state.TDUserList2.length) * (1 / this.state.TDUserList2.length))
        else
          total = 1 - (total / this.state.TDUserList2.length)
        total = total.toFixed(2);
        console.log('total : ' + (total));
        this.setState({ Rating6: total * 100 })

      }

      if (this.state.TDUserList[0]["Pweight"] === 10 && this.state.TDUserList3.length !== 0 && this.state.PackagesList3.length <= this.state.TDUserList3.length) {
        var SuccessArr = []
        let Size = this.state.PackagesList3.length
        SuccessArr = this.k_combinations(RatingArr, Size);
        console.log(SuccessArr)
        console.log(SuccessArr[0][0] + ' * ' + SuccessArr[0][1])

        var total = 0;
        var probability = 1;
        for (let i = 0; i < SuccessArr.length; i++) {
          if (this.state.PackagesList3.length !== 1)
            var probability = 1;
          for (let j = 0; j < Size; j++) {
            if (this.state.PackagesList3.length !== 1)
              probability *= SuccessArr[i][j]
            else
              probability = SuccessArr[i][j]

          }
          console.log(probability);
          total += probability
        }
        console.log(this.state.TDUserList3)

        if (this.state.PackagesList3.length === 1 && this.state.TDUserList3.length > 1)
          total = (total / (this.state.TDUserList3.length) * (1 / this.state.TDUserList3.length))
        else
          total = 1 - (total / this.state.TDUserList3.length)
        total = total.toFixed(2);
        console.log('total : ' + (total));
        this.setState({ Rating10: total * 100 })

      }

    }


  }

  UNSAFE_componentWillUpdate() {

    if (this.state.refresh3 === true) {

      this.GetTDUser(3)
    }

    if (this.state.refresh6 === true) {

      this.GetTDUser(6)
    }

    if (this.state.refresh10 === true) {

      this.GetTDUser(10)

    }
  }

  async GetTDUser(weight) {

    const apiUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight=' + weight;
    const response = await fetch(apiUserUrl);
    const TDdata = await response.json()

    this.setState({ TDUserList: TDdata })

    if (weight === 3)
      this.setState({ TDUserList1: [] });

    if (weight === 6)
      this.setState({ TDUserList2: [] });

    if (weight === 10)
      this.setState({ TDUserList3: [] });


    if (this.state.TDUserList !== []) {


      this.state.TDUserList.map((interest, key) => {


        if (interest["Pweight"] === 3) {
          this.setState({ TDUserList1: [...this.state.TDUserList1, interest] })
        }
        if (interest["Pweight"] === 6) {
          this.setState({ TDUserList2: [...this.state.TDUserList2, interest] })
        }
        if (interest["Pweight"] === 10) {
          this.setState({ TDUserList3: [...this.state.TDUserList3, interest] })
        }
      }

      );
    }

    { this.ChanceToPickup() }

  }

  k_combinations(set, k) {
    var i, j, combs, head, tailcombs;


    // There is no way to take e.g. sets of 5 elements from
    // a set of 4.
    if (k > set.length || k <= 0) {
      return [];
    }

    // K-sized set has only one K-sized subset.
    if (k == set.length) {
      return [set];
    }

    // There is N 1-sized subsets in a N-sized set.
    if (k == 1) {
      combs = [];
      for (i = 0; i < set.length; i++) {
        combs.push([set[i]]);
      }
      return combs;
    }
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
      // head is a list that includes only our current element.
      head = set.slice(i, i + 1);
      // We take smaller combinations from the subsequent elements
      tailcombs = this.k_combinations(set.slice(i + 1), k - 1);
      // For each (k-1)-combination we join it with the current
      // and store it to the set of k-combinations.
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  }


  async getpackages(weight) {

    let Pweight = weight
    let express = 'False'

    //tar2 - url צריך לשנות אחרי שמעדכנים ל tar 1
    const apiUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight=' + weight + '&express=' + express;
    const response = await fetch(apiUserUrl);
    const data = await response.json()
    this.setState({ PackagesList: data })


    if (weight === 3)
      this.setState({ PackagesList1: [] });

    if (weight === 6)
      this.setState({ PackagesList2: [] });

    if (weight === 10)
      this.setState({ PackagesList3: [] });

    this.state.PackagesList.map((pack, key) => {



      if (pack["PackageId"] !== 0) {



        if (pack["Pweight"] === 3) {
          this.setState({ PackagesList1: [...this.state.PackagesList1, pack] })
        }
        if (pack["Pweight"] === 6) {
          this.setState({ PackagesList2: [...this.state.PackagesList2, pack] })
        }
        if (pack["Pweight"] === 10) {
          this.setState({ PackagesList3: [...this.state.PackagesList3, pack] })
        }

      }

    }

    );

    console.log(this.state.PackagesList3)

    this.setState({ expanded: !this.state.expanded })
    { this.GetTDUser(Pweight) }
  }

  async CheckInserests() {

    const PossiblePickupUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/TDUser?StartStation=' + this.state.StartStation + '&EndStation=' + this.state.EndStation + '&UserId=' + this.state.UserDetail;
    const responseIfPossible = await fetch(PossiblePickupUrl);
    const IsInterested = await responseIfPossible.json()

    const PackagesFoundUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight= -1';
    const response = await fetch(PackagesFoundUrl);
    const data = await response.json()
    console.log(data)

    if (data.length !== 0) {

      if (IsInterested === 0) {
        this.setState({ AlertModal: "אינך מתעניין בחבילה במסלול זה" });
        { this.setModalVisible(true) }
      }
      else {
        this.isNearLocker();
        if (this.state.canOpenLocker === 1) {

          this.props.navigation.navigate('TDLockers')
        }
      }

    }
    else {

      this.setState({ AlertModal: "אין חבילות במסלול שנבחר" });
      { this.setModalVisible(true) }

    }

  }

  render() {


    var SStation = this.state.SStationName.replace(/"/gi, '')
    var EStation = this.state.EStationName.replace(/"/gi, '')

    //חבילות עד 3 ק"ג
    if (this.state.PackagesList1.length != 0) {
      var PackagesNum1 = 'חבילות זמינות :' + this.state.PackagesList1.length
      if (this.state.TDUserList1.length != 0)
        var InterestedUsers1 = 'מתעניינים : ' + this.state.TDUserList1.length
      else
        var InterestedUsers1 = 'אין מתעניינים בקטגוריה זו'

    }

    else {
      var PackagesNum1 = 'אין חבילות זמינות כרגע'
      var InterestedUsers1 = ''
    }

    //חבילות עד 6 ק"ג
    if (this.state.PackagesList2.length != 0) {
      var PackagesNum2 = 'חבילות זמינות :' + this.state.PackagesList2.length
      if (this.state.TDUserList2.length != 0)
        var InterestedUsers2 = 'מתעניינים : ' + this.state.TDUserList2.length
      else
        var InterestedUsers2 = 'אין מתעניינים בקטגוריה זו'

    }

    else {
      var PackagesNum2 = 'אין חבילות זמינות כרגע'
      var InterestedUsers2 = ''
    }

    //חבילות עד 10 ק"ג
    if (this.state.PackagesList3.length != 0) {
      var PackagesNum3 = 'חבילות זמינות :' + this.state.PackagesList3.length
      if (this.state.TDUserList3.length != 0)
        var InterestedUsers3 = 'מתעניינים : ' + this.state.TDUserList3.length
      else
        var InterestedUsers3 = 'אין מתעניינים בקטגוריה זו'

    }

    else {
      var PackagesNum3 = 'אין חבילות זמינות כרגע'
      var InterestedUsers3 = ''
    }

    var ArrowIcon = <Icon type="FontAwesome" color="#000" name="arrow-left" />

    return (
      <ScrollView >
        <SafeAreaView>
        <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!this.state.modalVisible);
          }}
        >
          <View style={styles.centeredView}>

            <View style={styles.modalView}>
              <Icon style={{ marginBottom: 20, marginTop: 0 }} name="cube" />
              <Text style={styles.modalText}>{this.state.AlertModal}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
              >
                <Text style={styles.textStyle}> סגור </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <List.Section >
          <List.Subheader style={{ textAlign: 'center', fontSize: 20, color: 'black', fontWeight: 'bold', borderColor: 'black', borderWidth: 1, backgroundColor: '#cbe8ba', borderRadius: 10, marginRight: 10, marginLeft: 10, marginTop: 20, marginBottom: 30 }} > {SStation}  {ArrowIcon}  {EStation} </List.Subheader>
          <List.Accordion
            title={' חבילות עד 3 ק"ג ' + ' - ( ' + this.state.PackagesList1.length + ' )'}
            left={props => <List.Icon {...props} icon="cube" />}
            titleStyle={styles.AccordionTitle}
            onPress={() => { this.getpackages(3.0) }}
            style={styles.AccordionList}

          >

            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={PackagesNum1} />
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={InterestedUsers1} />
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={'הסיכוי לאסוף חבילה : ' + ' % ' + this.state.Rating3} />

            <Button onPress={() => { this.Interested(3) }} style={styles.AccordionButton}><Text style={styles.ButtonText}>סמן קטגוריה               </Text></Button>
          </List.Accordion>

          <List.Accordion
            title={' חבילות 3 עד 6 ק"ג ' + ' - ( ' + this.state.PackagesList2.length + ' )'}
            left={props => <List.Icon {...props} icon="cube" />}
            style={styles.AccordionList}
            onPress={() => { this.getpackages(6.0) }}
            titleStyle={styles.AccordionTitle}
          >
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={PackagesNum2} />
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={InterestedUsers2} />
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={'הסיכוי לאסוף חבילה : ' + ' % ' + this.state.Rating6} />
            <Button onPress={() => { this.Interested(6) }} style={styles.AccordionButton}><Text style={styles.ButtonText}>סמן קטגוריה               </Text></Button>
          </List.Accordion>
          <List.Accordion
            title={' חבילות 6 עד 10 ק"ג ' + ' - ( ' + this.state.PackagesList3.length + ' )'}
            left={props => <List.Icon {...props} icon="cube" />}
            onPress={() => { this.getpackages(10.0) }}
            titleStyle={styles.AccordionTitle}
            style={styles.AccordionList}

          >
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={PackagesNum3} />
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={InterestedUsers3} />
            <List.Item style={styles.AccordionBody} titleStyle={styles.ItemTitle} title={'הסיכוי לאסוף חבילה : ' + ' % ' + this.state.Rating10} />
            <Button onPress={() => { this.Interested(10) }} style={styles.AccordionButton}><Text style={styles.ButtonText}>סמן קטגוריה               </Text></Button>
          </List.Accordion>

          <Button onPress={() => { this.CheckInserests() }} style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 50, borderRadius: 7, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold', color: 'black' }}>  אני כאן  </Text></Button>

        </List.Section>
        </View>
        </SafeAreaView>
      </ScrollView>

    );


  }
}

const styles = ({
  container:{

  },
  AccordionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,




  },
  AccordionButton: {
    backgroundColor: 'green',
    color: 'black',
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
 


  },
  ItemTitle: {
    fontWeight: 'bold',
    justifyContent: 'center',
    margin: 0,


  },
  AccordionList: {
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: '#cbe8ba',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderWidth: 1,
    borderColor: 'black',

  },
  ButtonText: {
    color: 'black',
    fontWeight: 'bold',


  },
  centeredView: {

    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,

  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#cbe8ba",
  },
  buttonClose: {
    backgroundColor: "#cbe8ba",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  AccordionBody: {
    backgroundColor: 'white',
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    borderRightColor: 'black',
    borderRightWidth: 1,
    borderLeftColor: 'black',
    borderLeftWidth: 1
  }



});


export default CCDeliveryFeed1;