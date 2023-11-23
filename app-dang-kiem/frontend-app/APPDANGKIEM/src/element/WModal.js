import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import {Modal, Portal} from 'react-native-paper';
import {Font} from '../assets/styles/Index';

const WModal = ({
    modalVisible,
    closeModal,
    handleConfirm,
    modalContent,
    component
}) => {
    return (
        <Portal>
            <Modal
                style={{
                    marginHorizontal:30,
                    flex:1,
                    justifyContent:'center',
                }}
                visible={modalVisible}
                onDismiss={closeModal}
            >
                <View style={styles.modal}>
                    {
                        component ? 
                        (
                            {...component}
                        ):(
                            <View style={styles.modal_content}>
                                <Text style={styles.modal_content_style}>{modalContent}</Text>
                            </View>
                        )
                    }
                    <View style={styles.btn_group}>
                        <TouchableOpacity style={[styles.btn_style,{
                            borderRightColor:'#E1E9F6',
                            borderRightWidth:1,
                            borderStyle:'solid',
                        }]} onPress={closeModal}>
                            <Text style={[styles.btn_text,{color:'#394B6A',}]}>Không</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn_style} onPress={handleConfirm}>
                            <Text style={[styles.btn_text,{color:'#0F6AA9',}]}>Có</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            
                
            </Modal>
        </Portal>
    )
}

export default WModal

const styles = StyleSheet.create({
    modal:{
        backgroundColor:'#FFFFFF',
        borderRadius:6,
    },
    modal_content:{
        padding:22
    },
    modal_content_style:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:14,
        fontWeight:'400',
        lineHeight:22,
        textAlign:'center',
        color:'#2C3442',
    },
    btn_group:{
        flexDirection:'row',
        borderTopColor:'#E1E9F6',
        borderTopWidth:1,
        borderStyle:'solid',
    },
    btn_style:{
        width:'50%',
        paddingVertical:12,
    },
    btn_text:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:13,
        fontWeight:'600',
        lineHeight:22,
        textAlign:'center',
        textTransform:'uppercase'
    }
})