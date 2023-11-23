import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationService from '../services/NavigationService';
import AuthScreen from '../screen/auth/AuthScreen';
import { NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';
import SuccessScreen from '../screen/manage/success_screen';
import ProfileScreen from '../screen/profile/profile_screen';
import {useDispatch, useSelector} from 'react-redux';
import TrackCalenderScreen from '../screen/manage/track_calender_screen';
import ChangeProfileScreen from '../screen/profile/profile_update_screen';
import * as Notifications from 'expo-notifications';
import {getNotification, haveNotification} from '../store/auth/actions';
import MapPage from '../screen/map/map_screen';
import CarAddScreen from '../screen/car/car_add_screen';
import CarListScreen from '../screen/car/car_list_screen';
import CarDetailScreen from '../screen/car/car_detail_screen';
import CarUpdateScreen from '../screen/car/car_update_screen';
import RegistrationAdd from '../screen/registration/registration_add_screen';
import RegistrationAddDetailScreen from '../screen/registration/registration_add_detail_screen';
import RegistrationDetailScreen from '../screen/registration/registration_detail_screen';
import RegistrationUpdateScreen from '../screen/registration/registration_update_screen';
import RegistrationListScreen from '../screen/registration/registration_list_screen';
import InfringesSearchScreen from '../screen/infringes/infringes_search_screen';
import InfringesDetailScreen from '../screen/infringes/infringes_detail_screen';
import InfringesCarDetailScreen from '../screen/infringes/infringes_car_detail_screen';
import HistoryListScreen from '../screen/history/history_list_screen';
import HistoryDetailScreen from '../screen/history/history_detail_screen';
import NotificationDeadlineScreen from '../screen/notification/notification_deadline_screen';
import NotificationRegistryScreen from '../screen/notification/notification_registry_screen';
import NotificationInfringesScreen from '../screen/notification/notification_infringes_screen';
import NotificationStatusScreen from '../screen/notification/notification_status_screen';
// import Test from '../screen/map/test';


const Stack = createNativeStackNavigator()
const IndexNavigation = () => {
    const {token} = useSelector(state => state.auth)
    const lastNotificationResponse =Notifications.useLastNotificationResponse();
    const notificationListener = React.useRef();
    const dispatch = useDispatch();
    React.useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification  => {
            dispatch(haveNotification())
        });
        if (lastNotificationResponse) {
            const detail= lastNotificationResponse.notification.request.content.data.detail
            if (detail.type == 1){
                NavigationService.navigate('Notification/Deadline',{notiId:detail.notiId})
            }
            if (detail.type == 2){
                NavigationService.navigate('Notification/Registry',{notiId:detail.notiId})
            }
            // if (detail.type == 3){
            // NavigationService.navigate('NotificationDetailTwo',{notiId:detail.notiId})
            // }
            if (detail.type == 4){
                NavigationService.navigate('Notification/Infringes',{notiId:detail.notiId})
            }
            if (detail.type == 6 || detail.type == 7 ) {
                NavigationService.navigate('Notification/Status',{notiId:detail.notiId})
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
                    options={{ 
                        headerShown: false }}
                />
                <Stack.Screen 
                    name="BottomNavigation" 
                    component={BottomNavigation} 
                    options={{ 
                        headerShown: false 
                    }}
                    initialParams={{}}
                />
                <Stack.Screen 
                    name="Map" 
                    component={MapPage} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Car/Add" 
                    component={CarAddScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Car/List" 
                    component={CarListScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Car/Detail" 
                    component={CarDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Car/Update" 
                    component={CarUpdateScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Registration/Add" 
                    component={RegistrationAdd} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Registration/Add/Detail" 
                    component={RegistrationAddDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Registration/Detail" 
                    component={RegistrationDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Registration/Update" 
                    component={RegistrationUpdateScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Registration/List" 
                    component={RegistrationListScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Infringes/Search" 
                    component={InfringesSearchScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Infringes/Detail" 
                    component={InfringesDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Infringes/Car/Detail" 
                    component={InfringesCarDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="History/List" 
                    component={HistoryListScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="History/Detail" 
                    component={HistoryDetailScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Notification/Registry" 
                    component={NotificationRegistryScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Notification/Deadline" 
                    component={NotificationDeadlineScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Notification/Infringes" 
                    component={NotificationInfringesScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Notification/Status" 
                    component={NotificationStatusScreen} 
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
                    name="Success" 
                    component={SuccessScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="TrackCalender" 
                    component={TrackCalenderScreen} 
                    options={{ headerShown: false }}
                />
                {/* <Stack.Screen 
                    name="Test" 
                    component={Test} 
                    options={{ headerShown: false }}
                /> */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default IndexNavigation

const styles = StyleSheet.create({})