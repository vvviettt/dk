import { StyleSheet, Text, View,Image ,ScrollView} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import {converLicensePlate} from '../../services/utils'
import Footer from '../../component/layout/Footer'
import {Font} from '../../assets/styles/Index'
import WModal from '../../element/WModal'
import CarService from '../../services/api/car/CarService'
import {useSelector} from 'react-redux'
import config from '../../config'
import {useToast} from 'react-native-toast-notifications'
import WToast from '../../element/WToast'
import {convertAlert} from '../../component/shared/ConvertAlert'
import CheckNullData from '../../component/shared/CheckNullData'
import { CommonActions } from '@react-navigation/native';

const CarDetailScreen = ({navigation,route}) => {
    const {carId} = route.params
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    const [isLoading,setIsLoading] = React.useState(true)
    const [visible,setVisible] = React.useState(false);
    const [loadingSubmit,setLoadingSubmit] = React.useState(false)
    const toast = useToast();
    console.log(data);
    const closeModal = () =>{
        setVisible(false);
    }
    const handleDelete = () =>{
        setLoadingSubmit(true);
            CarService.delete_car_byId(carId)
            .then((res) =>{
                if (res.status == 1 ){
                    toast.hideAll();
                    toast.show(
                        <WToast 
                            content={res.message} 
                            showTouch={false}
                            icon={require('../../assets/icons/SuccessIcon.png')}
                            iconStyle={{
                                width:24,
                                height:24,
                                marginRight:15,
                                marginTop:5
                            }}
                        />
                        ,{
                        type:'custom_type'
                    });
                    navigation.dispatch(
                        CommonActions.reset({
                          index: 1,
                          routes: [
                            { name: 'BottomNavigation' },
                            {
                              name: 'Car/List',
                            },
                          ],
                        })
                    );
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                setVisible(false);
                convertAlert('Thông báo',err.message);
                setLoadingSubmit(false);
        })
    }
    React.useEffect(()=>{
        if(token){
            setIsLoading(true);
            CarService.get_carInfor_byId(carId)
            .then((res) =>{
                if (res.status==1){
                    setData(res.data)
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
            <Header onGoBack={()=>navigation.goBack()} title='Xem thông tin xe'/>
            {
                isLoading ?
                (
                    <Loading />
                ):(
                    <>
                        <ScrollView style={styles.scroll_view}>
                            <CheckNullData data={data}>
                                <View style={styles.group}>
                                    <Text style={styles.group_title}>Biển số xe</Text>
                                    <Text style={styles.group_content}>{converLicensePlate(data?.license_plates)}</Text>
                                </View>
                                <View style={styles.group}>
                                    <Text style={styles.group_title}>Chủng loại phương tiện</Text>
                                    <Text style={styles.group_content}>{data?.category.name}</Text>
                                </View>
                                <View style={styles.group}>
                                    <Text style={styles.group_title}>Loại phương tiện</Text>
                                    <Text style={styles.group_content}>{data?.type.name}</Text>
                                </View>
                                <View style={styles.group}>
                                    <Text style={styles.group_title}>Năm sản xuất</Text>
                                    <Text style={styles.group_content}>{data?.manufacture_at}</Text>
                                </View>
                                <View style={styles.photo}>
                                    <Text style={styles.photo_title}>Hình ảnh</Text>
                                    <View style={styles.photo_group}>
                                        {
                                            data?.display_images.map((image,index)=>(
                                                <Image 
                                                    key={index}
                                                    source={{uri:(config.API_BASE_URL+'/'+image.url)}}
                                                    style={{
                                                        width:45,
                                                        height:45,
                                                        resizeMode:'cover',
                                                        marginRight:15,
                                                        marginBottom:15,
                                                        borderRadius:3,
                                                        borderWidth:0.5,
                                                        borderColor:'#2C3442',
                                                    }}
                                                />
                                            ))
                                        }
                                    </View>
                                </View>
                            </CheckNullData>
                        </ScrollView>
                        <Footer 
                            buttonOkContent={'Cập nhật'}
                            onClickButtonOk={()=>navigation.navigate('Car/Update',{
                                carId:carId
                            })}
                            // onClickButtonOk={()=>{}}
                            onClickButtonCancle={()=>setVisible(true)}
                            disabled={loadingSubmit}
                            loading={loadingSubmit}
                            buttonCancleContent='XÓA'
                            haveButtonCancel={true}
                            footer_style={{
                                backgroundColor:'#FFFFFF'
                            }}
                        />
                    </>
                )
            }
            <WModal 
                modalVisible={visible}
                closeModal={closeModal}
                handleConfirm={handleDelete}
                modalContent='Bạn có chắc muốn xóa không?'
            />
        </View>
    )
}

export default CarDetailScreen

const styles = StyleSheet.create({
    scroll_view:{
        flex:1,
        backgroundColor:'#FFFFFF'
    },
    group:{
        paddingHorizontal:15,
        marginTop:30,
    },
    group_title:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase'
    },
    group_content:{
        paddingVertical:10,
        borderBottomColor:'#E1E9F6',
        borderBottomWidth:1,
        borderStyle:'solid',
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:14,
        fontWeight:'600',
        color:'#2C3442'
    },
    photo:{
        paddingLeft:15,
        marginTop:30,
        marginBottom:50,
    },
    photo_title:{
        fontFamily:Font.BeVietnamProSemiBold,
        color:'#394B6A',
        fontSize:11,
        lineHeight:16,
        fontWeight:'600',
        textTransform:'uppercase'
    },
    photo_group:{
        marginTop:10,
        flexDirection:'row',
        flexWrap:'wrap',
    }
})