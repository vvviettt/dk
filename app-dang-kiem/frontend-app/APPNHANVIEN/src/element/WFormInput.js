import React from 'react'
import { View, Text ,TextInput, StyleSheet} from 'react-native';
import { ErrorMessage } from 'formik';
import {Font} from '../assets/styles/Index';
import { Ionicons } from '@expo/vector-icons';

const WFormInput = ({ field, form, ...props }) => {
    const [passwordVisible, setPasswordVisible] = React.useState(true);
    if(props.type ==='password') 
    return (
        <View style={styles.group}>
            <View style={styles.boxInput}>
                <Text style={styles.textLabel}>
                {props.title}
                </Text>
                    <TextInput
                        value={field.value}
                        secureTextEntry={passwordVisible}
                        onChangeText={form.handleChange(field.name)}
                        onBlur={form.handleBlur(field.name)}
                        {...props}
                        style={{ ...styles.inputType,...styles.inputContainer}}
                    />
                <Ionicons 
                    name={passwordVisible? 'eye' : 'eye-off'} size={20} 
                    onPress={()=>{setPasswordVisible(!passwordVisible)}} color='#7F85A2'
                    style={styles.icon_style}
                />
            </View>
            <View style={styles.error_message}>
                <ErrorMessage style={{color:'#ED1C24'}} name={field.name} component={Text} />
            </View>
        </View>
    )
    return (
        <View style={styles.group}>
            <View style={styles.boxInput}>
                <Text style={styles.textLabel}>
                    {props.title}
                </Text>
                    <TextInput
                        value={field.value}
                        onChangeText={form.handleChange(field.name)}
                        onBlur={form.handleBlur(field.name)}
                        {...props}
                        style={{...styles.inputType,...styles.inputContainer}}
                    />
            </View>
            <View style={styles.error_message}>
                <ErrorMessage  style={{color:'#ED1C24'}} name={field.name} component={Text} />
            </View>
        </View>
    );
}

export default WFormInput

const styles = StyleSheet.create({
    group:{
        width:'100%'
    },
    inputType:{
        fontWeight:'400',
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        lineHeight:22,
        color:'#757F8E',
    },
    boxInput:{
        marginBottom:-5
    },
    textLabel:{
        fontFamily:Font.BeVietnamProMedium,
        fontWeight:'500',
        fontSize:13,
        color:'#36383A',
        lineHeight: 20,
        marginBottom:6,
    },
    inputContainer:{
        height:40,
        width:'100%',
        borderRadius:24,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#C4CDD4',
        backgroundColor:'#FFFFFF',
        justifyContent:'center',
        paddingHorizontal:20,
    },
    icon_style:{
        position:'absolute',
        right:20,
        top:35
    },
    error_message:{
        marginTop:5,
        marginLeft:10
    }
})