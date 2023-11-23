import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {convertPrice} from '../../services/utils'
import {Font} from '../../assets/styles/Index'

const FeeContent = ({
    title,
    price,
    style
}) => {
    return (
        <View style={[styles.fee_group_row,style]}>
            <Text style={styles.fee_title}>{title}</Text>
            <Text style={styles.fee_content}>{convertPrice(price)} đ</Text>
        </View>
    )
}

export default React.memo(FeeContent)

const styles = StyleSheet.create({
    fee_group_row:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:30
    },
    fee_title:{
        fontFamily:Font.BeVietnamProRegular,
        fontWeight:'400',
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        width:'68%',
        textAlign:'left'
    },
    fee_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontWeight:'400',
        fontSize:13,
        lineHeight:18,
        color:'#2C3442',
        width:'28%',
        textAlign:'right'
    },
})