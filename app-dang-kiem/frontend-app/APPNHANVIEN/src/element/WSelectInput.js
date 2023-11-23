import { StyleSheet, Text, View, Image } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import React from 'react'
import {Font} from '../assets/styles/Index'

const WSelectInput = ({
    dataSelect,
    label,
    select_style,
    onSelect,
    defaultValueByIndex,
    defaultValue,
    messageIfDataNull,
    messageIfDataEmpty,
    value
}) => {
    return (
        <View style={[styles.select_input,select_style]}>
            <Text style={styles.label}>{label}</Text>
            {
                dataSelect ?
                (
                    <SelectDropdown
                        search={true}
                        renderSearchInputLeftIcon={()=>(
                            <Image 
                                source={require('../assets/icons/SearchIcon.png')}
                                style={{
                                    width:14,
                                    height:14,
                                }}    
                            />
                        )}
                        searchPlaceHolder='Tìm kiếm'
                        searchInputStyle={{
                            
                        }}
                        defaultValueByIndex={defaultValueByIndex}
                        defaultValue={defaultValue}
                        data={dataSelect}
                        onSelect={(selectedItem, index) => {
                            onSelect(selectedItem.id)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.name
                        }}
                        buttonStyle={styles.form_style}
                        buttonTextStyle={styles.input_text_style}
                        defaultButtonText="-Chọn-"
                        dropdownIconPosition='right'
                        dropdownStyle={styles.dropdownStyle}
                        rowStyle={styles.rowStyle}
                        rowTextStyle={styles.rowTextStyle}
                        renderCustomizedRowChild={(selectedItem, index)=>{
                            return(
                                <Text style={[
                                    styles.rowTextStyle,{
                                        color: value == selectedItem.id ? '#BF0000' : '#394B6A'
                                    }
                                ]}>{selectedItem.name}</Text>
                            )
                        }}
                        selectedRowTextStyle={styles.selectedRowTextStyle}
                    />
                ):(
                    <View style={styles.message}>
                        <Text style={styles.messageIfDataNull}>{messageIfDataNull}</Text>
                    </View>
                )
            }
        </View>
    )
}

export default WSelectInput

const styles = StyleSheet.create({
    select_input:{
        width:'100%'
    },
    label:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase'
    },
    form_style:{
        width:'100%',
        backgroundColor:'#FFFFFF',
        paddingHorizontal:0,
        height:'auto',
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
    },
    input_text_style:{
        textAlign:'left',
        marginHorizontal:0,
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:14,
        lineHeight:22,
        fontWeight:'600',
    },
    dropdownStyle:{
        borderRadius:6,
    },
    rowStyle:{
        paddingHorizontal:30,
        height:null,
        paddingVertical:15
    },
    rowTextStyle:{
        textAlign:'left',
        marginHorizontal:0,
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:14,
        lineHeight:22,
        fontWeight:'600',
    },
    selectedRowTextStyle:{
        color:'#BF0000'
    },
    messageIfDataNull:{
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
    },
    message:{
        fontFamily:Font.BeVietnamProRegular,
        color:'#394B6A',
        fontSize:14,
        lineHeight:22,
        fontWeight:'400',
    }
})