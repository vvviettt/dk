import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'
import {Font} from '../../assets/styles/Index'

const RuleContent = ({
    content
}) => {
    return (
        <View style={styles.rule_group_row}>
            <Image 
                source={require('../../assets/icons/CheckIcon.png')} 
                style={styles.icon_check_style}
            />
            <Text style={styles.rule_content_style}>{content}</Text>
        </View>
    )
}

export default React.memo(RuleContent)

const styles = StyleSheet.create({
    rule_group_row:{
        flexDirection:'row',
        marginBottom:12,
    },
    icon_check_style:{
        marginTop:5,
        width:14,
        height:14,
        marginRight:10
    },
    rule_content_style:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:20,
        flex:1,
        color:'#2C3442',
    },
})