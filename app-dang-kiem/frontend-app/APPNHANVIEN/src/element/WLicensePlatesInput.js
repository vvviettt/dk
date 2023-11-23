import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Font} from '../assets/styles/Index'
import {TextInputMask} from 'react-native-masked-text'

const WLicensePlatesInput = ({
    text,
    setText,
    label,
    group_style,
}) => {
    function check(text){
        if (isNaN(text[3]))
        return true
        else return false
    }
    return (
        <View style={[styles.text_input,group_style]}>
            <Text style={styles.label_style}>{label}</Text>
            <TextInputMask
                type={'custom'}
                options={{
                  /**
                   * mask: (String | required | default '')
                   * the mask pattern
                   * 9 - accept digit.
                   * A - accept alpha.
                   * S - accept alphanumeric.
                   * * - accept all, EXCEPT white space.
                  */
                  mask: check(text) ?  '99AS - 99999999999999' : '99A - 999999999999999',
                  
                }}
                autoCapitalize = {"characters"}
                value={text}
                style={styles.input_style}
                onChangeText={text => {
                    setText(text)
                }}
                placeholder='Ví dụ: 43D - 24232'
            />
        </View>
    )
}

export default WLicensePlatesInput

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
    }
})