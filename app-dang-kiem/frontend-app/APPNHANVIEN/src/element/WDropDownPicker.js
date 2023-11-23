import { StyleSheet, Text, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import React from 'react'
import {Font} from '../assets/styles/Index';

const WDropDownPicker = ({
    title, 
    data,  
    value,  
    setValue,   
    setOpen,
    open,
    name,
    code,
    placeholder,
    dropStyle,
    messageIfDataEmpty
}) => {
    return (
        <View style={[styles.select_input,dropStyle]} >
            <Text style={styles.title}>{title}</Text>
                <DropDownPicker
                    schema={{
                        label: name,
                        value: code,
                    }}
                    style={styles.drop_down}
                    containerStyle={styles.containerStyle}
                    open={open}
                    value={value}
                    items={data}
                    setOpen={setOpen}
                    setValue={setValue}
                    placeholder={placeholder}
                    hideSelectedItemIcon={true}
                    dropDownContainerStyle={{
                        borderColor:'#E6E6E6'
                    }}
                    listMode="SCROLLVIEW"
                    ListEmptyComponent={({
                        listMessageContainerStyle, listMessageTextStyle, ActivityIndicatorComponent, loading, message
                    }) => (
                        <View style={listMessageContainerStyle}>
                        {loading ? (
                            <ActivityIndicatorComponent />
                        ) : (
                            <Text style={listMessageTextStyle}>
                                {messageIfDataEmpty}
                            </Text>
                        )}
                        </View>
                    )}
                />
        </View>
    )
}

export default WDropDownPicker

const styles = StyleSheet.create({
    select_input:{
        width:'100%'
    },
    title:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase'
    },
    drop_down:{
        borderWidth:0,
        borderRadius:0,
        paddingHorizontal:0,
        paddingVertical:0,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
    },
    containerStyle:{

    }
})