import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import {Font} from '../../assets/styles/Index'
import {converLicensePlate, formatDate} from '../../services/utils'

const RegisterHistoryBox = ({
    onPress,
    data
}) => {
    return (
        <TouchableOpacity onPress={()=>onPress()}>
            <View style={styles.history}>
                <Text style={styles.history_content}>Ngày đăng kiểm: {formatDate(data.date)}</Text>
                <View style={styles.history_group}>
                    <Text style={styles.history_group_left}>{converLicensePlate(data.license_plate)}</Text>
                    {
                        data.address ? 
                        (
                            <Text style={styles.history_group_right}>Đăng kiểm hộ</Text>
                        ):(
                            <></>
                        )
                    }
                </View>
                <Text style={styles.history_content}>Hạn đăng kiểm: {formatDate(data.payment_date)}</Text>
                <Text style={styles.history_content}>Hạn phí bảo trì đường bộ: {formatDate(data.plan_date)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default RegisterHistoryBox

const styles = StyleSheet.create({
    history:{
        paddingHorizontal:15,
        paddingVertical:20,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
    },
    history_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:18,
        color:'#394B6A',
        fontWeight:'400',
        marginBottom:6,
    },
    history_group:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:6,
    },
    history_group_left:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        color:'#394B6A',
        marginRight:50,
        flex:1,
    },
    history_group_right:{
        fontFamily:Font.BeVietnamProMedium,
        fontSize:11,
        fontWeight:'500',
        color:'#00A32E',
        lineHeight:16,
        paddingHorizontal:13,
        paddingVertical:4,
        backgroundColor:'#E2FFD9',
        borderRadius:100,
    },
})