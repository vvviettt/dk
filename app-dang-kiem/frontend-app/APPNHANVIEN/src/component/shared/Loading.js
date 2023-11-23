import { StyleSheet, Text, View,ActivityIndicator } from 'react-native'
import React from 'react'

const Loading = ({
    color = '#0F6AA9'
}) => {
    return (
        <View style={styles.loading_screen}>
            <ActivityIndicator 
                size="large" color={color}
            />
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    loading_screen:{
        width:'100%',
        height:200,
        alignItems:'center',
        justifyContent:'center'
    }
})