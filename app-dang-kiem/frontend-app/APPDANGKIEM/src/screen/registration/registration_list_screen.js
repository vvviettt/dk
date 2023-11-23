import { StyleSheet, Text, View ,ScrollView} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import RegistryBox from '../../component/shared/RegistryBox'
import {Font} from '../../assets/styles/Index'
import Footer from '../../component/layout/Footer'
import {useSelector} from 'react-redux'
import ManagerService from '../../services/api/manager/ManagerService'
import Loading from '../../component/shared/Loading'
import {formatDate} from '../../services/utils'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'


const RegistrationListScreen = ({
    navigation
}) => {
    const {token} = useSelector(state => state.auth)
    const [isLoading,setIsLoading] = React.useState(true)
    const [data,setData] = React.useState()
    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            ManagerService.get_list_regis({})
            .then((res) =>{
                if (res.status == 1) {
                    setData(res.data.rows)
                    setIsLoading(false);
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[token])
    return (
        <View style={{flex:1}}>
            <Header onGoBack={()=>navigation.pop()} title='Danh sách đăng ký đăng kiểm'/>
            <ScrollView 
                style={styles.scroll_view}
            >
                {
                    isLoading == true ? 
                    (
                        <Loading />
                    ):
                    (
                        <>
                            <CheckNullData data={data}>
                                {
                                    data?.map((e,index)=>(
                                        <View style={styles.group} key={index}>
                                            <Text style={styles.data_time}>{formatDate(e.date)}</Text>
                                            <View>
                                                {
                                                    e.list_registration.map((registration)=>
                                                        <RegistryBox 
                                                            key={registration.id} 
                                                            data={registration} 
                                                            style={styles.box_style}
                                                            onPress={()=>navigation.navigate('Registration/Detail',{registryId:registration.id})}
                                                        />
                                                    )
                                                }
                                            </View>
                                        </View>
                                    ))
                                }
                            </CheckNullData>
                        </>
                    )
                }
            </ScrollView>
            <Footer 
                buttonOkContent={'Tạo đăng kí mới'}
                onClickButtonOk={()=>navigation.navigate('Registration/Add',{})}
                disabled={false}
            />
        </View>
    )
}

export default RegistrationListScreen

const styles = StyleSheet.create({
    scroll_view:{
        width:'100%',
        flex:1,
        paddingHorizontal:15,
        backgroundColor:'#eef2ff',
        paddingBottom:20
    },
    box_style:{
        marginTop:10
    },
    group:{
        marginTop:20
    },
    data_time:{
        fontFamily:Font.BeVietnamProBold,
        fontWeight:'700',
        fontSize:12,
        lineHeight:18,
        color:'#394B6A',
    },
    footer:{
        height:76,
        width:'100%',
        backgroundColor:'#eef2ff',
        paddingTop:8,
        paddingHorizontal:15,
    },
    footer_btn:{
        width:'100%',
        height:44,
        borderRadius:6,
        backgroundColor:'#0F6AA9',
        alignItems:'center',
        justifyContent:'center'
    },
    footer_text:{
        fontFamily:Font.BeVietnamProBold,
        fontSize:13,
        lineHeight:22,
        color:'#FFFFFF',
        textTransform:'uppercase'
    }
})