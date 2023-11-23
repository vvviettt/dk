import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationService from '../services/NavigationService';
import AuthScreen from '../screen/auth/AuthScreen';
import { NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import {useDispatch, useSelector} from 'react-redux';
import FollowUpCheckinScreen from '../screen/manager/FollowUpCheckinScreen';
import TrackCalenderScreen from '../screen/manager/TrackCalenderScreen';
import RegisteredListForRegistrationScreen from '../screen/manager/RegisteredListForRegistrationScreen';
import PaidRegistrationListScreen from '../screen/manager/PaidRegistrationListScreen';
import ProfileScreen from '../screen/profile/ProfileScreen';
import ChangeProfileScreen from '../screen/profile/ChangeProfileScreen';
import CompleteRegistryListScreen from '../screen/manager/CompleteRegistryListScreen';
import RegistryDetailScreen from '../screen/details/RegistryDetailScreen';
import PaidRegistryDetailScreen from '../screen/details/PaidRegistryDetailScreen';
import CompleteRegistryDetailScreen from '../screen/details/CompleteRegistryDetailScreen';
import * as Notifications from 'expo-notifications';
import {getNotification, haveNotification} from '../store/auth/actions';
import NotificationDetailOneScreen from '../screen/notification/NotificationDetailOneScreen';
import NotificationDetailTwoScreen from '../screen/notification/NotificationDetailTwoScreen';
import ChangePasswordScreen from '../screen/profile/ChangePasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AssigmentNotificationScreen from '../screen/notification/AssigmentNotificationScreen';
import ChangeAssigmentNotificationScreen from '../screen/notification/ChangeAssigmentNotificationScreen';

const Stack = createNativeStackNavigator()
const IndexNavigation = () => {
    const {token} = useSelector(state => state.auth)
    const lastNotificationResponse =Notifications.useLastNotificationResponse();
    const notificationListener = React.useRef();
    const dispatch = useDispatch();

    React.useEffect(()=>{

        notificationListener.current = Notifications.addNotificationReceivedListener(notification  => {
            dispatch(haveNotification())
        });
    },[])

    React.useEffect(() => {
        if (lastNotificationResponse) {
            const detail= lastNotificationResponse.notification.request.content.data.detail
            if (detail.type == 5){
                NavigationService.navigate('NotificationDetailOne',{notiId:detail.notiId})
              }
            if (detail.type == 8){
            NavigationService.navigate('NotificationDetailTwo',{notiId:detail.notiId})
            }
            if (detail.type == 9){
            NavigationService.navigate('AssigmentNotificationScreen',{notiId:detail.notiId})
            }
            if (detail.type == 10){
            NavigationService.navigate('ChangeAssigmentNotificationScreen',{notiId:detail.notiId})
            }
        }
    }, [lastNotificationResponse]);

    React.useEffect(()=>{
        if (token) dispatch(getNotification())
    },[])

    return (
        <NavigationContainer ref={ref => NavigationService.setTopLevelNavigator(ref)}>
            <Stack.Navigator
                initialRouteName={
                    token ? 'BottomNavigation' :'Auth'
                }
            >
                <Stack.Screen 
                    name="Auth" 
                    component={AuthScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="BottomNavigation" 
                    component={BottomNavigation} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="FollowUpCheckin" 
                    component={FollowUpCheckinScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="TrackCalender" 
                    component={TrackCalenderScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="RegisteredListForRegistration" 
                    component={RegisteredListForRegistrationScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="PaidRegistrationList" 
                    component={PaidRegistrationListScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="ChangeProfile" 
                    component={ChangeProfileScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="CompleteRegistryList" 
                    component={CompleteRegistryListScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="RegistryDetail" 
                    component={RegistryDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="PaidRegistryDetail" 
                    component={PaidRegistryDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="CompleteRegistryDetail" 
                    component={CompleteRegistryDetailScreen} 
                    options={{ headerShown: false }}
                />
                 <Stack.Screen 
                    name="NotificationDetailOne" 
                    component={NotificationDetailOneScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="NotificationDetailTwo" 
                    component={NotificationDetailTwoScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="ChangePassword" 
                    component={ChangePasswordScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="AssigmentNotificationScreen" 
                    component={AssigmentNotificationScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="ChangeAssigmentNotificationScreen" 
                    component={ChangeAssigmentNotificationScreen} 
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default IndexNavigation

const styles = StyleSheet.create({})