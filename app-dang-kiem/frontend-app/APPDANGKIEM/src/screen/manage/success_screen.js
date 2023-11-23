import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import {Font} from '../../assets/styles/Index'
import NavigationService from '../../services/NavigationService'
import { CommonActions } from '@react-navigation/native';
import {converLicensePlate} from '../../services/utils';

const SuccessScreen = ({navigation,route}) => {
    const {isValid,licensePlates} = route.params
    return (
        <View style={styles.screen}>
            <Image 
                source={require('../../assets/images/SuccessImage.png')}
                style={{
                    width:153.14,
                    height:147.65,
                }}
            />
            <Text style={styles.success}>Thành công</Text>
            {
                isValid == true ? (
                    <Text style={styles.title}>Hệ thống chưa có dữ liệu lỗi vi phạm của phương tiện {converLicensePlate(licensePlates)}</Text>
                ):(
                    <>
                        <View style={styles.bar_long} />
                        <View style={styles.bar_long} />
                        <View style={styles.bar_long} />
                        <View style={styles.bar_short} />
                    </>
                )
            }
            <TouchableOpacity style={styles.btn} onPress={
                ()=>navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        { name: 'BottomNavigation' },
                        {
                          name: 'Registration/List',
                        },
                      ],
                    })
                )}>
                <Text style={styles.btn_text}>Về danh sách</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SuccessScreen

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#F7FAFF',
        paddingHorizontal:50,
    },
    success:{
        fontFamily:Font.RobotoBold,
        fontSize:20,
        fontWeight:'700',
        lineHeight:30,
        marginTop:15,
    },
    title:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:13,
        fontWeight:'400',
        lineHeight:18,
        marginBottom:30,
        marginTop:15,
        textAlign:'center'
    },
    bar_long:{
        width:185,
        height:18,
        borderRadius:2,
        backgroundColor:'#D8E2F1',
        marginBottom:12
    },
    bar_short:{
        width:135,
        height:18,
        borderRadius:2,
        backgroundColor:'#D8E2F1',
        marginBottom:30
    },
    btn:{
        width:165,
        height:44,
        borderRadius:6,
        backgroundColor:'#0F6AA9',
        alignItems:'center',
        justifyContent:'center',
    },
    btn_text:{
        fontFamily:Font.RobotoBold,
        fontSize:13,
        fontWeight:'700',
        lineHeight:22,
        color:'#FFFFFF',
        textTransform:'uppercase',
        
    }
})