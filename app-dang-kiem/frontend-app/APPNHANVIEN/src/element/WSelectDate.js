import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native'
import React from 'react'
import {Font} from '../assets/styles/Index'
import {TextInputMask} from 'react-native-masked-text'

const WSelectDate = ({
    date,
    label,
    select_style,
    setDate,
    onPressIconCalender,
    onBlur
}) => {
    return (
        <View style={[styles.text_input,select_style]}>
            <Text style={styles.label_style}>{label}</Text>
            <View>
                <TextInputMask
                    onBlur={()=>onBlur()}
                    value={date}
                    type={'datetime'}
                    options={{
                        format: 'DD/MM/YYYY'
                    }}
                    onChangeText={text => {
                        setDate(text)
                    }}
                    style={styles.input_style}
                    placeholder='dd/mm/yyyy'
                />
            </View>
            <TouchableOpacity style={styles.icon_position} onPress={()=>onPressIconCalender()}>
                <Image 
                    source={require('../assets/icons/CalenderIcon.png')}
                    style={styles.icon_style}
                />
            </TouchableOpacity>
        </View>
    )
}
export default WSelectDate

const styles = StyleSheet.create({
    text_input:{
        
    },
    label_style:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase'
    },
    input_style:{
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        color:'#2C3442'
    },
    icon_position:{
        position:'absolute',
        bottom:0,
        right:-10,
        padding:10
    },
    icon_style:{
        width:14,
        height:14,
    }
})