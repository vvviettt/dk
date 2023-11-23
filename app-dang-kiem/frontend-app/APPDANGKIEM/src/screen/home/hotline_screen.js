import { Linking, StyleSheet, View } from 'react-native'
import React from 'react'
import NavigationService from '../../services/NavigationService'
import HomeService from '../../services/api/home/HomeService'

const HotlineScreen = ({navigation,route}) => {
    React.useEffect(()=>{
        HomeService.get_hotline()
        .then((res) =>{
            if (res.status==1){
                const url=`tel://${res.data.hot_line}`
                Linking.openURL(url)
                NavigationService.reset('BottomNavigation')
            }else{
                throw new Error(res.message)
            }
        })
        .catch((err) =>{
            convertAlert('Thông báo',err.message);
            NavigationService.reset('BottomNavigation')
        })
    },[])
    return (
        <View>
        </View>
    )
}

export default HotlineScreen

const styles = StyleSheet.create({})