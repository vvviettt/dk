import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Searchbar} from 'react-native-paper';

const WSearchInput = ({
    placeholder
}) => {
    return (
        <Searchbar
            placeholder={placeholder}
            onChangeText={(text)=>searchFilterFunction(text)}
            value={search}
            style={{
                marginLeft:5,
                height:40,
                width:'100%',
                backgroundColor:'#ECF2EE',
                flexDirection:'row-reverse'
            }}
            inputStyle={{
                left:40
            }}
            clearIcon={{
                
            }}
            iconColor='#838384'
        />
    )
}

export default WSearchInput

const styles = StyleSheet.create({})