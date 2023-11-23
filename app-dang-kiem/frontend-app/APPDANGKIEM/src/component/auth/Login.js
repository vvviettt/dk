import { StyleSheet, Text, View,ScrollView,Dimensions ,TouchableOpacity} from 'react-native'
import React from 'react'
import { Formik, Field } from 'formik';
import {Font} from '../../assets/styles/Index'
import WFormInput from '../../element/WFormInput';
import { authValidator } from '../../validators'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '../../store/auth';
import {Button} from 'react-native-paper';


const { width, height } = Dimensions.get('window');
const Login = ({
    goToRegister,
}) => {
    const [disabled, setDisabled] = React.useState(false)
    const dispatch = useDispatch();
    const deviceToken = AsyncStorage.getItem("push_token");
    const { msgError = '', loading = false} = useSelector(state => state.auth)
    const handleLogin = async data => {
        setDisabled(true)
        const token = await deviceToken
        console.log(token);
        const data_sent = {
          ...data,
          deviceToken : token ,
        }
        console.log(data_sent);
        dispatch(login(data_sent))
        setDisabled(false)
    };
    return (
        <ScrollView style={styles.screen}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.title_style}>Đăng nhập</Text>
                </View>
                <View>
                    <Formik
                        initialValues={{ phone_number: '', password: '' }}
                        validationSchema={authValidator.LoginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ handleSubmit }) => (
                            <View style={styles.form_group}>
                                <View style={styles.form_input}>
                                    <Field 
                                        name="phone_number"  
                                        title="Điện thoại"
                                        keyboardType="phone-pad" 
                                        component={WFormInput} 
                                        placeholder={('Nhập')} 
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
                                <TouchableOpacity 
                                    onPress={handleSubmit}
                                    // disabled={disabled}
                                    disabled={loading}
                                >
                                    <Button
                                        mode="contained"
                                        button
                                        disabled={loading}
                                        loading={loading}
                                        style={[styles.btn_login,{
                                            shadowColor: '#0000001F',
                                            shadowOffset: {width: 4, height: 12},
                                            shadowOpacity: 0,
                                            shadowRadius: 0,
                                        }]}
                                    >
                                        <Text style={[styles.btn_style,{color:'#FFFFFF'}]}>ĐĂNG NHẬP</Text>
                                    </Button>
                                </TouchableOpacity>
                                <View style={styles.forgotPass}>
                                    <Text style={styles.textForgot} onPress={()=>{}}>Quên mật khẩu ?</Text>
                                </View>
                            </View>
                        )}
                    </Formik>
                    <View style={styles.footer}>
                        <Text style={styles.footer_content}>Bạn chưa có tài khoản? </Text>
                        <Text onPress={()=>goToRegister()} style={styles.footer_register}>Đăng ký</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
  )
}

export default Login

const styles = StyleSheet.create({
    screen:{
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        width:width,
        flex:1,
    },
    container:{
        paddingBottom:50
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
        marginBottom:24
    },
    footer:{
        alignItems:'center',
        flexDirection:'row',
        width:'100%',
        justifyContent:'center'
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
        marginBottom:30,
    },
})