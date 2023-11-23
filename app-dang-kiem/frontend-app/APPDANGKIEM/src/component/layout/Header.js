import { StyleSheet, Text, View ,TouchableOpacity,Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
import {Font} from '../../assets/styles/Index';

const Header = ({
    onGoBack,
    title,
    showBtnGoback=true
}) => {
    return (
        <LinearGradient 
            colors={[ '#2489CF','#0F6AA9']}
            style={styles.header}
        >   
            <View style={styles.group}>
                {
                    showBtnGoback ? (
                        <TouchableOpacity 
                            style={styles.btn}
                            onPress={()=>onGoBack()}
                        >
                            <Image 
                                source={require('../../assets/icons/GoBackIcon.png')}
                                style={{
                                    height:12,
                                    width:7.05
                                }}
                            />
                        </TouchableOpacity>
                    ):
                    (<View style={styles.btn}/>)
                }
                <View style={styles.title}>
                    <Text style={styles.title_style}>{title}</Text>
                </View>
                <View style={styles.btn}/>
            </View>
        </LinearGradient>
    )
}

export default Header

const styles = StyleSheet.create({
    header:{
        width:'100%',
        height:100,
        shadowColor: '#0000000D',
        shadowOffset: {width: 4, height: 12},
        shadowOpacity: 0,
        shadowRadius: 0,
        flexDirection:'column',
        justifyContent:'flex-end'
    },
    group:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        paddingBottom:16,
        justifyContent:'space-between'
    },
    btn:{
        width:40,
        height:50,
        alignItems:'center',
        justifyContent:'center'
    },
    title:{
        flex:1,
        alignItems:'center',
    },
    title_style:{
        color:'#FFFFFF',
        fontFamily:Font.BeVietnamProBold,
        fontSize:17,
        fontWeight:'600',
        lineHeight:24,
        textTransform:'uppercase',
        textAlign:'center'
    }
})