import { StyleSheet, Text, View,ScrollView,Dimensions ,TouchableOpacity} from 'react-native'
import React from 'react'
import { Formik, Field } from 'formik';
import {Font} from '../../assets/styles/Index'
import WFormInput from '../../element/WFormInput';
import { authValidator } from '../../validators'


const { width, height } = Dimensions.get('window');
const Register = ({
    goToLogin,
}) => {
    return (
        <ScrollView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.title_style}>Đăng ký</Text>
                </View>
                <View>
                    <Formik
                        initialValues={{ phone_number: '', password: '' }}
                        validationSchema={authValidator.SignUpSchema}
                        onSubmit={()=>{}}
                    >
                        {({ handleSubmit }) => (
                            <View style={styles.form_group}>
                                <View style={styles.form_input}>
                                    <Field 
                                        name="name"  
                                        title="Họ và tên"
                                        component={WFormInput} 
                                        placeholder={('Nhập')} 
                                    />
                                </View>
                                <View style={styles.form_input}>
                                    <Field 
                                        name="phone_number"  
                                        title="Số điện thoại"
                                        keyboardType="phone-pad" 
                                        component={WFormInput} 
                                        placeholder={('Nhập')} 
                                    />
                                </View>
                                <View style={styles.form_input}>
                                    <Field 
                                        name="email"  
                                        title="Email"
                                        component={WFormInput} 
                                        placeholder={('Nhập')}
                                        type="Email"
                                    />
                                </View>
                                <View style={styles.form_input}>
                                    <Field
                                        name="password"
                                        title="Mật khẩu"
                                        component={WFormInput}
                                        placeholder={('Nhập')}
                                        type="password"
                                    />
                                </View>
                                <View style={styles.form_input}>
                                    <Field
                                        name="re_password"
                                        title="Xác nhận mật khẩu"
                                        component={WFormInput}
                                        placeholder={('Nhập')}
                                        type="password"
                                    />
                                </View>
                                <TouchableOpacity 
                                    onPress={()=>handleSubmit}
                                    style={[styles.btn_login,{
                                        shadowColor: '#0000001F',
                                        shadowOffset: {width: 4, height: 12},
                                        shadowOpacity: 0,
                                        shadowRadius: 0,
                                    }]}
                                >
                                    <Text style={[styles.btn_style,{color:'#FFFFFF'}]}>ĐĂNG KÝ</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                    <View style={styles.footer}>
                        <Text style={styles.footer_content}>Bạn đã có tài khoản? </Text>
                        <Text onPress={()=>goToLogin()} style={styles.footer_register}>Đăng nhập</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
  )
}

export default Register

const styles = StyleSheet.create({
    screen:{
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        width:width,
        height:height*0.85,
    },
    container:{

    },
    title:{
        paddingTop:40,
        paddingLeft:42,
        paddingBottom:24
    },
    title_style:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:24,
        lineHeight:30,
        fontWeight:'700',
        color:'#21232E'
    },
    form_group:{
        width:'100%',
        paddingHorizontal:50
    },  
    form_input:{
        marginBottom:20
    },
    footer:{
        alignItems:'center',
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        marginBottom:64
    },
    footer_content:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:13,
        fontWeight:'400',
        lineHeight:20,
        color:'#36383A'
    },
    footer_register:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:13,
        fontWeight:'700',
        lineHeight:20,
        color:'#0F6AA9',
        textDecorationLine:'underline'
    },
    btn_style:{
        fontFamily:Font.BeVietnamProBold,
        fontWeight:'700',
        fontSize:13,
        lineHeight:22
    },
    btn_login:{
        width:'100%',
        height:40,
        borderRadius:24,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0F6AA9',
        shadowColor: '#0000001F',
        shadowOffset: {width: 4, height: 12},
        shadowOpacity: 0,
        shadowRadius: 0,
        marginBottom:38,
    },
})