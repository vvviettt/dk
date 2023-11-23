import { StyleSheet, Text, View,TextInput } from 'react-native'
import React from 'react'
import {Font} from '../assets/styles/Index'

const WTextInput = ({
    text,
    setText,
    label,
    group_style,
    ...props
}) => {
    return (
        <View style={[styles.text_input,group_style]}>
            <Text style={styles.label_style}>{label}</Text>
            <TextInput
                value={text}
                onChangeText={(text) =>{setText(text)}}
                style={styles.input_style}
                placeholder="Nhập"
                placeholderTextColor={'#757F8E'}
                {...props}
            />
        </View>
    )
}

export default React.memo(WTextInput)

const styles = StyleSheet.create({
    text_input:{
        
    },
    label_style:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase',
        opacity:0.7,
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
    }
})