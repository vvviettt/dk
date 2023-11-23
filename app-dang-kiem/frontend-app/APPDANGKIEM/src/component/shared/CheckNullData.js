import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {TextStyle} from '../../assets/styles/TextStyle'

const CheckNullData = ({
    data,
    children
}) => {
    return (
        <>
            {
                data ? (
                    children
                ):(
                    <Text style={TextStyle.null_data}>Không có dữ liệu</Text>
                )
            }
        </>
    )
}

export default CheckNullData

const styles = StyleSheet.create({})