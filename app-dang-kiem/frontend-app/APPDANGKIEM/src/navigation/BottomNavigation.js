import { StyleSheet, Text, View,Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import HomepageScreen from '../screen/home/home_screen';
import {Font} from '../assets/styles/Index';
import HotlineScreen from '../screen/home/hotline_screen';
import { Badge } from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {notHaveNotification} from '../store/auth/actions';
import authService from '../services/api/auth/AuthService';
import {convertAlert} from '../component/shared/ConvertAlert';
import NotificationListScreen from '../screen/notification/notification_list_screen';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({navigation,route}) => {
    const {isNotification} = route.params
    const [notification,setNotification] = React.useState(false);
    const {haveNotification} = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const tabBarIconOptions = (icon,IconWidth,Iconheight,focused,badge)=> {
        return(
            <View style={focused && styles.iconProvider}>
                <View style={focused && styles.icon}>
                    <Image source={icon} style={ {
                        tintColor:focused?'#0F6AA9':'black',
                        width: IconWidth,
                        height:Iconheight
                    }}/>
                    {
                        (badge) ? (
                            <Badge 
                                visible={notification}
                                size={8}
                                style={{
                                    position:'absolute',
                                    left:10
                                }}
                            />
                        ):(
                            <></>
                        )
                    }
                </View>
            </View>
        )
    }
    
    const tabBarLabelOption = (title,focused)=>
        (
            <Text style={{
                fontFamily: Font.BeVietnamProMedium,
                fontSize:12,
                fontWeight:'400',
                color:focused?'#0F6AA9':'#394B6A',
            }}>{title}</Text>
        )

    const onPressNotification = () =>{
        setNotification(false)
        dispatch(notHaveNotification())
        authService.updateNotification()
            .then((res)=>{
                if (res.status ==1 ){

                }else throw new Error(res.message)
            })
            .catch((err)=>{
                convertAlert('Thông báo',err.message)
            })
    }
    

    React.useEffect(() => {
        setNotification(haveNotification)
    }, [haveNotification]);
    return (
        <Tab.Navigator 
            initialRouteName = {
                isNotification == true  ? 'Notification' :'Homepage'
            }
        >
            <Tab.Screen name='Homepage' component={HomepageScreen} options={{
                tabBarStyle:{},
                tabBarIcon: ({focused}) =>tabBarIconOptions(
                    require('../assets/icons/HomeIcon.png'),18,19,focused
                ),
                tabBarLabel:({focused}) =>tabBarLabelOption('TRANG CHỦ',focused),
                headerShown:false,

            }}/>
            <Tab.Screen name='Notification' component={NotificationListScreen} options={{
                tabBarIcon: ({focused}) =>tabBarIconOptions(
                    require('../assets/icons/NotificationIcon.png'),19,19,focused,true
            ),
                tabBarLabel:({focused}) =>tabBarLabelOption('THÔNG BÁO',focused),
                headerShown:false
            }}
                listeners={{
                    tabPress: ()=>{onPressNotification()}
                }}
            />
            <Tab.Screen name='Hotline' component={HotlineScreen} options={{
                tabBarIcon: ({focused}) =>tabBarIconOptions(
                    require('../assets/icons/PhoneCallIcon.png'),20,20,focused
                ),
                tabBarLabel:({focused}) =>tabBarLabelOption('GỌI HOTLINE',focused),
                headerShown:false
            }}
            />
        </Tab.Navigator>
    )
}

export default BottomNavigation

const styles = StyleSheet.create({})