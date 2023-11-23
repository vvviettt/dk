import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {converLicensePlate, formatDate} from '../../services/utils'
import {Font} from '../../assets/styles/Index'

const RegisForRegistrationBox = ({
    data,
    onPressSuccess,
    onPressUnsuccess,
    type,
    ...props
}) => {
    return (
        <TouchableOpacity {...props}>
            <View style={styles.regis}>
                <View style={styles.regis_group}>
                    <Text style={styles.regis_text}>{formatDate(data.date)}</Text>
                    {
                        type == 0 ? (
                            <TouchableOpacity onPress={()=>onPressSuccess()} style={styles.regis_btn_success}>
                                <Text style={[styles.regis_btn_text,{
                                    color:'#FFFFFF'
                                }]}>Đã thu tiền</Text>
                            </TouchableOpacity>
                        ):(
                            <></>
                        )
                    }
                    {
                        type == 1 ? (
                            <View style={{
                                flexDirection:'row',
                            }}>
                                <TouchableOpacity onPress={()=>onPressSuccess()} style={styles.regis_btn_success}>
                                    <Text style={[styles.regis_btn_text,{
                                        color:'#FFFFFF'
                                    }]}>Đạt KĐ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>onPressUnsuccess()} style={styles.regis_btn_unsuccess}>
                                    <Text style={[styles.regis_btn_text,{
                                        color:'#FFFFFF'
                                    }]}>Không đạt KĐ</Text>
                                </TouchableOpacity>
                            </View>
                        ):(
                            <></>
                        )
                    }
                    {
                        type == 2 ? (
                            <>
                                {
                                    data.status == 2 ? (
                                        <Text style={styles.regis_cancel}>Không đạt</Text>
                                    ):(
                                        <></>
                                    )
                                }
                                {
                                    data.status == 1 ? (
                                        <Text style={styles.regis_complete}>Đạt</Text>
                                    ):(
                                        <></>
                                    )
                                }
                            </>
                        ):(
                            <></>
                        )
                    }
                </View>
                <Text style={styles.regis_licensePlate}>{converLicensePlate(data.license_plate).toUpperCase()}</Text>
                <Text style={styles.regis_text}>Chủ phương tiện: {data.owner_name}</Text>
                <Text style={styles.regis_text}>Số điện thoại: {data.owner_phone}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default RegisForRegistrationBox

const styles = StyleSheet.create({
    regis:{
        paddingVertical:20,
        paddingHorizontal:15,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
    },
    regis_text:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#394B6A',
        opacity:0.8,
        marginBottom:6,
    },
    regis_licensePlate:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        lineHeight:22,
        color:'#2C3442',
        marginBottom:6,
    },
    regis_group:{
        flexDirection:'row',
        justifyContent:'space-between',
    },  
    regis_btn_success:{
        paddingHorizontal:18,
        paddingVertical:4,
        backgroundColor:'#0F6AA9',
        borderRadius:3,
    },
    regis_btn_unsuccess:{
        paddingHorizontal:18,
        paddingVertical:4,
        backgroundColor:'#8D91A1',
        borderRadius:3,
        marginLeft:5,
    },
    regis_btn_text:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:12,
        lineHeight:22,
    },
    regis_cancel:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        fontWeight:'500',
        color:'#8B2929',
        paddingHorizontal:20,
        paddingVertical:4,
        backgroundColor:'#F1D5D5',
        borderRadius:100,
    },
    regis_complete:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        lineHeight:16,
        fontWeight:'500',
        color:'#008334',
        paddingHorizontal:38,
        paddingVertical:4,
        backgroundColor:'#BCEBCF',
        borderRadius:100,
    }
})