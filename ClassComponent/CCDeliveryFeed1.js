
import * as React from 'react';
import { List, Checkbox, Button } from 'react-native-paper';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

  }

  async getData() {
    try {
      jsonValue = await AsyncStorage.getItem('UserId')

      jsonValue != null ? UserDetail = JSON.parse(jsonValue) : null;
      this.setState({ UserDetail: UserDetail.UserId })

    } catch (e) {
      alert('Error get Item')
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
      alert("אתה נמצא בקרבת הלוקר !!");
      this.setState({ canOpenLocker: 1 })

    }
    else {
      alert("אינך נמצא בקרבת הלוקר !! ");

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



    alert('קטגוריה סומנה בהצלחה !! ' + ' לחץ - אני כאן - בעת ההגעה לתחנת רכבת ')



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
        if (this.state.PackagesList1.length === 0)
          alert('No Packages Found')
        else { this.AddTDUser(weight) }
      if (weight === 6)
        if (this.state.PackagesList2.length === 0)
          alert('No Packages Found')
        else { this.AddTDUser(weight) }
      if (weight === 10)
        if (this.state.PackagesList3.length === 0)
          alert('No Packages Found')
        else { this.AddTDUser(weight) }


    }
    else {
      alert('כבר התעניינת בקטגוריה')


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
      this.state.TDUserList.map((interest, key) => {

        RatingSum += interest["Rating"];

      })

      let TDRating = RatingSum / this.state.TDUserList.length;
      TDRating = 10 - TDRating;



      if (this.state.TDUserList[0]["Pweight"] === 3 && this.state.TDUserList1.length !== 0 && this.state.PackagesList1.length <= this.state.TDUserList1.length) {

        let CategoryRating = TDRating * (this.state.PackagesList1.length / this.state.TDUserList1.length)
        console.log(TDRating + '*' + this.state.PackagesList1.length + '/' + this.state.TDUserList1.length)
        this.setState({ Rating3: CategoryRating * 10 })
      }

      if (this.state.TDUserList[0]["Pweight"] === 6 && this.state.TDUserList2.length !== 0 && this.state.PackagesList2.length <= this.state.TDUserList2.length) {

        let CategoryRating = TDRating * (this.state.PackagesList2.length / this.state.TDUserList2.length)
        console.log(TDRating + '*' + this.state.PackagesList2.length + '/' + this.state.TDUserList2.length)
        this.setState({ Rating6: CategoryRating * 10 })


      }

      if (this.state.TDUserList[0]["Pweight"] === 10 && this.state.TDUserList3.length !== 0 && this.state.PackagesList3.length <= this.state.TDUserList3.length) {
        let CategoryRating = TDRating * (this.state.PackagesList3.length / this.state.TDUserList3.length)
        this.setState({ Rating10: CategoryRating * 10 })
      }




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

  async getpackages(weight) {

    let Pweight = weight


    //tar2 - url צריך לשנות אחרי שמעדכנים ל tar 1
    const apiUserUrl = 'http://proj.ruppin.ac.il/igroup55/test2/tar1/api/Packages?startStation=' + this.state.StartStation + '&endStation=' + this.state.EndStation + '&Pweight=' + weight;
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

        alert('אינך מתעניין בחבילה במסלול זה')

      }
      else {
        this.isNearLocker();
        if (this.state.canOpenLocker === 1) {
          
          this.props.navigation.navigate('TDLockers')
        }
        else {

        }
      }

    }
    else {

      alert('אין חבילות במסלול שנבחר')
    }






  }

  render() {


    return (
      <ScrollView>
        <List.Section title={this.state.SStationName + '    ---->   ' + this.state.EStationName} titleStyle={{ fontSize: 15, textAlign: 'center', }}  >
          <List.Accordion
            title=' חבילות עד 3 ק"ג'
            left={props => <List.Icon {...props} icon="cube" />}
            titleStyle={styles.AccordionTitle}
            onPress={() => { this.getpackages(3.0) }}
            style={styles.AccordionList}

          >

            <List.Item titleStyle={styles.ItemTitle} title={'חבילות זמינות :' + this.state.PackagesList1.length} />
            <List.Item titleStyle={styles.ItemTitle} title={'מתעניינים : ' + this.state.TDUserList1.length} />
            <List.Item titleStyle={styles.ItemTitle} title={'הסיכוי לאסוף חבילה : ' + ' % ' + this.state.Rating3} />

            <Button onPress={() => { this.Interested(3) }} style={styles.AccordionButton}><Text style={styles.ButtonText}>סמן קטגוריה</Text></Button>
          </List.Accordion>

          <List.Accordion
            title=' חבילות בין 3 ל 6 ק"ג'
            left={props => <List.Icon {...props} icon="cube" />}
            style={styles.AccordionList}
            onPress={() => { this.getpackages(6.0) }}
            titleStyle={styles.AccordionTitle}
          >
            <List.Item titleStyle={styles.ItemTitle} title={'חבילות זמינות :' + this.state.PackagesList2.length} />
            <List.Item titleStyle={styles.ItemTitle} title={'מתעניינים : ' + this.state.TDUserList2.length} />
            <List.Item titleStyle={styles.ItemTitle} title={'הסיכוי לאסוף חבילה : ' + ' % ' + this.state.Rating6} />
            <Button onPress={() => { this.Interested(6) }} style={styles.AccordionButton}><Text style={styles.ButtonText}>סמן קטגוריה</Text></Button>
          </List.Accordion>
          <List.Accordion
            title=' חבילות בין 6 ל 10 ק"ג'
            left={props => <List.Icon {...props} icon="cube" />}
            onPress={() => { this.getpackages(10.0) }}
            titleStyle={styles.AccordionTitle}
            style={styles.AccordionList}

          >
            <List.Item titleStyle={styles.ItemTitle} title={'חבילות זמינות :' + this.state.PackagesList3.length} />
            <List.Item titleStyle={styles.ItemTitle} title={'מתעניינים : ' + this.state.TDUserList3.length} />
            <List.Item titleStyle={styles.ItemTitle} title={'הסיכוי לאסוף חבילה : ' + ' % ' + this.state.Rating10} />
            <Button onPress={() => { this.Interested(10) }} style={styles.AccordionButton}><Text style={styles.ButtonText}>סמן קטגוריה</Text></Button>
          </List.Accordion>

          <Button onPress={() => { this.CheckInserests() }} style={{ alignSelf: 'center', backgroundColor: 'green', marginTop: 50, borderRadius: 7, borderWidth: 1, borderColor: 'black' }}><Text style={{ fontWeight: 'bold', color: 'black' }}>  אני כאן  </Text></Button>

        </List.Section>
      </ScrollView>

    );


  }
}

const styles = ({
  AccordionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'green'


  },
  AccordionButton: {
    backgroundColor: '#cbe8ba',
    textAlign: 'center'




  },
  ItemTitle: {
    fontWeight: 'bold'
  },
  AccordionList: {
    marginBottom: 8,


  },
  ButtonText: {
    color: 'black',
    fontWeight: 'bold',



  }

});


export default CCDeliveryFeed1;