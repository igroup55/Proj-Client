import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export default async function registerForPushNotificationsAsync() {

    let token = await Notifications.getExpoPushTokenAsync();
 
    return (
        token
     
    );
}