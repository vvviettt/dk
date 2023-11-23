import { StyleSheet, Text, View,Image ,TouchableOpacity} from 'react-native'
import React from 'react'
import {converLicensePlate, convertDate, convertPrice, formatDate} from '../../services/utils'
import {Font} from '../../assets/styles/Index'
import moment from 'moment';
import NavigationService from '../../services/NavigationService';
import config from '../../config';
const CarInformationBox = ({
    data,
    style,
    onPress,
    carIndex
}) => {
    const date = new Date()
    const now = moment(date).format('YYYY-MM-DD')
    const getDay = (firstDate , secondDate) =>{
        const first = new Date(firstDate).getTime()
        const second = new Date(secondDate).getTime()
        return (first-second)/86400000
    }
    return (
        <TouchableOpacity onPress={()=>onPress()}>
            <View style={[styles.box,style]} >
                <View style={styles.box_left}>
                    {
                        data.display_image ? 
                        (
                            <Image 
                                source={{ uri:(config.API_BASE_URL+'/'+data.display_image)}}
                                style={styles.image}
                            />
                        ):(
                            <View style={{
                                width:60,
                                height:60,
                                alignItems:'center',
                                justifyContent:'center',
                                borderRadius:6,
                                borderWidth:1,
                                borderColor:'#EFF2F8'
                            }}>
                                <Text style={{
                                    textAlign:'center',
                                    fontFamily:Font.BeVietnamProRegular,
                                    fontSize:13
                                }}>Chưa thêm ảnh</Text>
                            </View>
                        )
                    }
                </View>
                <View style={styles.box_right}>
                    <Text style={styles.license_plates}>{converLicensePlate(data.license_plates)}</Text>
                    <Text style={styles.content_style}>Loại: {data.type}</Text>
                    {
                        data.date ? 
                        <Text style={styles.content_style}>Đăng kiểm gần nhất: {formatDate(data.date)}</Text>
                        : <></>
                    }
                    {
                        data.plan_date ?
                        <Text style={styles.content_style}>Kế hoạch đăng kiểm tiếp theo: {formatDate(data.plan_date)}</Text>
                        :<></>
                    }
                    {
                        now > data.plan_date == true ?
                        (
                            <View style={styles.group}>
                                <Text style={styles.message}>Đã quá hạn đăng kiểm {
                                    getDay(now,data.plan_date )
                                } ngày</Text>
                                <TouchableOpacity style={styles.content_box} onPress={()=>NavigationService.navigate('Registration/Add',{carIndex:carIndex,Id:data.id,license:data.license_plates})}>
                                    <Text style={styles.content_box_style}>Đăng ký đăng kiểm ngay</Text>
                                </TouchableOpacity>
                            </View>
                        ):
                        (
                            <></>
                        )
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(CarInformationBox)

const styles = StyleSheet.create({
    box:{
        width:'100%',
        padding:15,
        backgroundColor:'#FFFFFF',
        borderRadius:6, 
        shadowColor: '#0000000D',
        shadowOffset: {width: 2, height: 8},
        shadowOpacity: 0.1,
        shadowRadius: 0,
        flexDirection:'row',
        elevation:2
    },
    box_left:{
        marginRight:10
    },
    box_right:{
        flex:1,
    },
    image:{
        width:60,
        height:60,
        resizeMode:'cover',
        borderRadius:3,
    },
    license_plates:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:14,
        lineHeight:20,
        color:'#2C3442',
        fontWeight:'500'
    },
    content_style:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        lineHeight:18,
        color:'#2C3442',
        fontWeight:'400',
        marginTop:4
    },
    group:{
        marginTop:4
    },
    content_box:{
        borderRadius:50,
        width:190,
        paddingVertical:5,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#06B217',
    },
    content_box_style:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:13,
        lineHeight:16,
        fontWeight:'500',
        color:'#FFFFFF',
    },
    message:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        fontStyle:'italic',
        fontWeight:'400',
        lineHeight:18,
        color:'#A80000',
        marginBottom:6,
        flex:1
    }
})