import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Font} from '../../assets/styles/Index'
import {formatDate} from '../../services/utils'

const ErrorContent = ({
    data
}) => {
    return (
        <View style={styles.group}>
            <Text style={styles.date}>{formatDate(data.date)}</Text>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.where}>Cơ quan xử lý: {data.handlingAgency}</Text>
        </View>
    )
}

export default ErrorContent

const styles = StyleSheet.create({
    group:{
        width:'100%',
        paddingHorizontal:15,
        paddingVertical:20,
        backgroundColor:'#FFFFFF',
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
    },
    date:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        fontWeight:'400',
        lineHeight:18,
        color:'#394B6A'
    },
    name:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        lineHeight:22,
        color:'#394B6A',
        marginTop:6,
    },
    where:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        fontWeight:'400',
        lineHeight:18,
        marginTop:6,
        color:'#394B6A',
    }
})