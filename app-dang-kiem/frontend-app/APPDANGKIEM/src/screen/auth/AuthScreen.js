import { StyleSheet, Text, View ,Dimensions,TouchableOpacity,Image,KeyboardAvoidingView} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'
import {Font} from '../../assets/styles/Index';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Login from '../../component/auth/Login';
import Register from '../../component/auth/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {clearToken} from '../../store/auth/actions';
// import useKeyboardHeight from 'react-native-use-keyboard-height';


const { width, height } = Dimensions.get('window');
const AuthScreen = () => {
    const show = React.useRef();
    const [showContent,setShowContent] = React.useState('');
    const dispatch = useDispatch();
    // const keyboardHeight = useKeyboardHeight();
    const [toggle,setToggle] = React.useState()
    const showLoginForm = ()=>{
        setShowContent('login')
        setToggle(!toggle)
    }
    const showRegisterForm = ()=>{
        setShowContent('register')
        setToggle(!toggle)
    }
    const onGoBackToLogin = () =>{
        show.current.hide();
        setShowContent('login')
        setToggle(!toggle)
    }
    const onGoBackToRegister = () =>{
        show.current.hide();
        setShowContent('register')
        setToggle(!toggle)
    }

    React.useEffect(()=>{
        return ()=> show.current.show();
    },[toggle])

    React.useEffect(()=>{
        dispatch(clearToken());
    },[])
    return (           
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{flex:1}}
        >
            <View style={{flex:1}}>
                <LinearGradient 
                    colors={[ '#1C1F2366','#0A254E']}
                    style={styles.container}
                />   
                <Image 
                    style={styles.img_back}
                    source={require('../../assets/images/Background_Image.png')}
                /> 
                <View style={styles.group}>
                    <View style={styles.title}>
                        <Text style={styles.title_top}>Ứng dụng Đăng kiểm xe</Text>
                        <Text style={styles.title_bot}>Đăng ký đăng kiểm xe mọi lúc mọi nơi</Text>
                    </View>
                    <View style={styles.btn_group}>
                        <TouchableOpacity 
                            style={styles.btn_login}
                            onPress={()=>showLoginForm()}
                        >
                            <Text style={[styles.btn_style,{color:'#FFFFFF'}]}>ĐĂNG NHẬP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.btn_register}
                            onPress={()=>showRegisterForm()}
                        >
                            <Text style={[styles.btn_style,{color:'#3C61EA'}]}>ĐĂNG KÝ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <SlidingUpPanel 
                    ref={show}
                    draggableRange={{top: height*0.65, bottom: 0}}
                    height={height*0.65}
                    allowMomentum={true}
                    allowDragging={false}
                    avoidKeyboard={true}
                    backdropStyle={{
                        backgroundColor:null,
                    }}
                >
                    {   
                        showContent== 'login' ?
                            <Login goToRegister={()=>onGoBackToRegister()}/>
                            :
                            <Register goToLogin={()=>onGoBackToLogin()}/>
                    }
                </SlidingUpPanel>
            </View>
        </KeyboardAvoidingView>
    )
}

export default AuthScreen

const styles = StyleSheet.create({
    img_back:{
        resizeMode:'cover',
        zIndex:-1,
        width:'100%',
    },
    container:{
        width:"100%",
        height:"100%",
        position:'absolute',

    },
    group:{
        position:'absolute',
        width:'100%',
        bottom:70,
    },
    title:{
        paddingHorizontal:61,
        marginBottom:55
    },
    title_top:{
        fontFamily:Font.iCielSamsungSharpSansBold_SMCPS,
        fontSize:36,
        fontWeight:'700',
        lineHeight:54,
        letterSpacing:0.2,
        color:'#FFFFFF',
        textAlign:'center'
    },
    title_bot:{
        fontFamily:Font.BeVietnamProRegular,
        fontSize:12,
        fontWeight:'400',
        lineHeight:20,
        color:'#FFFFFF',
        textAlign:'center'
    },
    btn_group:{
        paddingHorizontal:90
    },
    btn_login:{
        width:'100%',
        height:40,
        borderRadius:24,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:20,
        backgroundColor:'#3C61EA',
        shadowColor: '#0000001F',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    btn_register:{
        width:'100%',
        height:40,
        borderRadius:24,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
        shadowColor: '#0000001F',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    btn_style:{
        fontFamily:Font.BeVietnamProBold,
        fontWeight:'700',
        fontSize:13,
        lineHeight:22
    },
    slidingPanelLayoutStyle: {
        backgroundColor: '#FFFFFF', 
        justifyContent: 'center', 
        alignItems: 'center',
        width:360,
        height:300,
        zIndex:10,
    },
})