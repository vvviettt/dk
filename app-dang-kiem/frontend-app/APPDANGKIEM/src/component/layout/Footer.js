import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { Button } from 'react-native-paper';
import React from 'react'
import {Font} from '../../assets/styles/Index';

const Footer = ({
    haveButtonCancel=false,
    buttonOkContent,
    buttonCancleContent,
    onClickButtonOk,
    onClickButtonCancle,
    loading = false,
    disabled = false,
    footer_style,
    ...props
}) => {
    return (
        <View style={[styles.footer,footer_style]}>
            {
                haveButtonCancel == true ?
                (
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{width:'48%'}}>
                            <TouchableOpacity style={[styles.footer_btn,{
                                backgroundColor:'#FFFFFF',
                                borderWidth:1,
                                borderStyle:'solid',
                                borderColor:'#E3EAF0'
                            }]} onPress={()=>onClickButtonCancle()}>
                                <Button
                                    {...props}
                                    mode="text"
                                    button
                                    color={"#2C3442"}
                                    >
                                        {buttonCancleContent? buttonCancleContent : 'HỦY'}
                                </Button>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:'48%'}}>
                            <TouchableOpacity disabled={disabled} style={styles.footer_btn} onPress={()=>onClickButtonOk()}>
                                <Button
                                    {...props}
                                    mode="text"
                                    button
                                    loading={loading}
                                    color={"white"}
                                    >
                                    
                                        {buttonOkContent}
                                </Button>
                            </TouchableOpacity>
                        </View>
                    </View>
                ):
                (
                    <TouchableOpacity disabled={disabled} style={styles.footer_btn} onPress={()=>onClickButtonOk()}>
                        <Button
                            {...props}
                            mode="text"
                            button
                            loading={loading}
                            color={"white"}
                            >
                            
                                {buttonOkContent}
                        </Button>
                    </TouchableOpacity>
                )
            }
        </View>
    )
}

export default Footer

const styles = StyleSheet.create({
    footer:{
        height:76,
        width:'100%',
        backgroundColor:'#eef2ff',
        paddingTop:8,
        paddingHorizontal:15,
    },
    footer_btn:{
        width:'100%',
        height:44,
        borderRadius:6,
        backgroundColor:'#0F6AA9',
        alignItems:'center',
        justifyContent:'center'
    },
    footer_text:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:13,
        lineHeight:22,
        color:'#FFFFFF',
        textTransform:'uppercase'
    }
})