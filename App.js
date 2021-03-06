import { StatusBar } from 'expo-status-bar';
import { Form, Header } from 'native-base';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import CCSenderForm from './ClassComponent/CCSenderForm';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import CCDeliveryFeed1 from './ClassComponent/CCDeliveryFeed1';

import CCLogin from './ClassComponent/CCLogin';
import CCRegister from './ClassComponent/CCRegister';
import CCHome from './ClassComponent/CCHome';
import HomeActivityList from './ClassComponent/HomeActivityList';
import CCLockers from './ClassComponent/CCLockers';
import CCTDLockers from './ClassComponent/CCTDLockers';
import CCDeliveryExpressFeed from './ClassComponent/CCDeliveryExpressFeed';
import CCTrainRouteSelection from './ClassComponent/CCTrainRouteSelection';
import CCExpressRouteSelection from './ClassComponent/CCExpressRouteSelection';
import CCTrainSelection from './ClassComponent/CCTrainSelection';
import CreditPay from './ClassComponent/CreditPay';
import CCExpressFeed from './ClassComponent/CCExpressFeed';
import CCExpressLockers from './ClassComponent/CCExpressLockers';
//המלצה למסלול פיזור
import CCExpressRecomendations from './ClassComponent/CCExpressRecomendations';


const Stack = createStackNavigator();

export default function App() {
  return (

    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={CCLogin} options={{
          title: 'כניסה',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
        <Stack.Screen name="DeliveryFeed" component={CCDeliveryFeed1} options={{
          title: 'בחר קטגוריה של משקל',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
        <Stack.Screen name="NewDelivery" component={CCSenderForm} options={{
          title: 'משלוח חדש       ',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
        <Stack.Screen name="Register" component={CCRegister} options={{
          title: 'הרשמה',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
        <Stack.Screen name="Home" component={CCHome} options={{
          title: '         JestApp',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize:25

          }
        }} />
        <Stack.Screen name="HomeActivityList" component={HomeActivityList} />
        <Stack.Screen name="CCLockers" component={CCLockers} options={{
          title: '',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
        <Stack.Screen name="DeliveryExpress" component={CCDeliveryExpressFeed} 
         options={{
          title: 'חבילות זמינות',
          headerStyle: {
            backgroundColor: '#ffed4b',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }}/>
        <Stack.Screen name="NewTrainRoute" component={CCTrainRouteSelection} />
        <Stack.Screen name="NewExpressRoute" component={CCExpressRouteSelection}  options={{
          title: 'בחר מסלול          ',
          headerStyle: {
            backgroundColor: '#ffed4b',
          },
          
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }}  />
        <Stack.Screen name="TrainSelection" component={CCTrainSelection} options={{
          title: 'בחר מסלול',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
        <Stack.Screen name="TDLockers" component={CCTDLockers} options={{
          title: 'בחר קטגוריה של משקל',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
        <Stack.Screen name="payments" component={CreditPay} options={{
          title: 'ארנק שלי',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />
  <Stack.Screen name="ExpressFeed" component={CCExpressFeed} options={{
          title: 'ExpressFeed',
          headerStyle: {
            backgroundColor: 'green',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />  
        <Stack.Screen name="ExpressRecomendation" component={CCExpressRecomendations} options={{
          title: 'המסלול המומלץ          ',
          headerStyle: {
            backgroundColor: '#ffed4b',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }}  />           

<Stack.Screen name="ExpressPackages" component={CCExpressLockers} options={{
          title: 'משלוחים שלי    ',
          headerStyle: {
            backgroundColor: '#ffed4b',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center'

          }
        }} />        

      </Stack.Navigator>

     

    

    </NavigationContainer>




  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
