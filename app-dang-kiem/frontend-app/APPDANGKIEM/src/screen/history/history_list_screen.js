import { StyleSheet, Text, View ,Image,ScrollView} from 'react-native'
import React from 'react'
import Header from '../../component/layout/Header'
import Loading from '../../component/shared/Loading'
import {useSelector} from 'react-redux'
import CarService from '../../services/api/car/CarService'
import SelectDropdown from 'react-native-select-dropdown'
import {converLicensePlate} from '../../services/utils'
import config from '../../config'
import {Font} from '../../assets/styles/Index'
import RegisterHistoryBox from '../../component/shared/RegisterHistoryBox'
import ManagerService from '../../services/api/manager/ManagerService'
import {convertAlert} from '../../component/shared/ConvertAlert'
import {TextStyle} from '../../assets/styles/TextStyle'
import CheckNullData from '../../component/shared/CheckNullData'

const HistoryListScreen = ({navigation,route}) => {
    const [isLoading,setIsLoading] = React.useState(true)
    const [loadingOnRegister,setLoadingOnRegister] = React.useState(true)
    const [listCar,setListCar] = React.useState()
    const [car,setCar] = React.useState()
    const {token} = useSelector(state => state.auth)
    const [data,setData] = React.useState()
    React.useEffect(() =>{
        if(token){
            setIsLoading(true);
            CarService.get_list_cus_car({})
            .then((res) =>{
                if (res.status==1){
                    setCar(res.data.rows[0])
                    setListCar(res.data.rows)
                    setIsLoading(false);
                }else throw new Error(res.message)
            })
            .catch((err) =>{
                convertAlert('Thông báo',err.message);
                setIsLoading(false);
            })
        }
    },[token])
    React.useEffect(()=>{
        if(car){
            setLoadingOnRegister(true)
            ManagerService.get_hitory_register(car.license_plates)
                .then((res)=>{
                    if (res.status==1){
                        setData(res.data)
                        setLoadingOnRegister(false)
                    }else throw new Error(res.message)
                })
                .catch((err) =>{
                    convertAlert('Thông báo',err.message);
                    setLoadingOnRegister(false)
                })
        }
    },[car])
    return (
        <View style={{flex:1,backgroundColor:'#FFFFFF'}}>
            <Header onGoBack={()=>navigation.pop()} title='Lịch sử đăng kiểm xe'/>
            {
                isLoading ? (
                    <Loading />
                ):(
                    <CheckNullData data={listCar}>
                        <View style={{
                            backgroundColor:'#F7FAFF',
                            padding:15,
                            borderBottomColor:'#E1E9F6',
                            borderBottomWidth:5,
                        }}>
                            <SelectDropdown
                                // defaultValueByIndex={defaultValueByIndex}
                                defaultValue={car}
                                data={listCar}
                                onSelect={(selectedItem, index) => {
                                    setCar(selectedItem)
                                }}
                                renderCustomizedButtonChild={(selectedItem, index)=>{
                                    if (selectedItem)
                                    return(
                                        <View style={styles.buttonStyle}>
                                            {
                                                selectedItem.display_image ? 
                                                (
                                                    <Image 
                                                        source={{uri:(config.API_BASE_URL+'/'+selectedItem?.display_image)}}
                                                        style={styles.buttonStyle_img}
                                                    />
                                                ):(
                                                    <View style={{
                                                        width:44,
                                                        height:44,
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        borderRadius:4,
                                                        borderWidth:1,
                                                        borderColor:'#394B6A',
                                                        marginRight:12,
                                                    }}>
                                                        <Text style={{
                                                            textAlign:'center',
                                                            fontFamily:Font.BeVietnamProRegular,
                                                            fontSize:9
                                                        }}>Chưa thêm ảnh</Text>
                                                    </View>
                                                )
                                            }
                                            <Text  style={[styles.buttonStyle_text,{
                                            }]}>{converLicensePlate(selectedItem?.license_plates)}</Text>
                                        </View>
                                    )
                                    return (
                                        <Text>Chọn xe cần xem</Text>
                                    )
                                }}
                                buttonStyle={{
                                    width:'100%',
                                    height:'auto',
                                    backgroundColor:'#F7FAFF',
                                }}
                                dropdownStyle={styles.dropdownStyle}
                                rowStyle={styles.rowStyle}
                                defaultButtonText="-Chọn-"
                                renderCustomizedRowChild={(selectedItem, index)=>{
                                    return(
                                        <View style={styles.buttonStyle}>
                                            {
                                                selectedItem.display_image ? 
                                                (
                                                    <Image 
                                                        source={{uri:(config.API_BASE_URL+'/'+selectedItem?.display_image)}}
                                                        style={styles.buttonStyle_img}
                                                    />
                                                ):(
                                                    <View style={{
                                                        width:44,
                                                        height:44,
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        borderRadius:4,
                                                        borderWidth:1,
                                                        borderColor:'#394B6A',
                                                        marginRight:12,
                                                    }}>
                                                        <Text style={{
                                                            textAlign:'center',
                                                            fontFamily:Font.BeVietnamProRegular,
                                                            fontSize:9
                                                        }}>Chưa thêm ảnh</Text>
                                                    </View>
                                                )
                                            }
                                            <Text  style={[styles.buttonStyle_text,{
                                                color: car == selectedItem ? '#FF0000' : '#394B6A'
                                            }]}>{converLicensePlate(selectedItem?.license_plates)}</Text>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        {
                            loadingOnRegister ?
                            (
                                <Loading />
                            ):(
                                <ScrollView style={styles.scrollView}>
                                     <CheckNullData data={data}>
                                        {
                                            data?.length == 0 ? (
                                                <Text style={TextStyle.null_data}>Xe chưa có lịch sử đăng kiểm</Text>
                                            ):(
                                                <>
                                                    {
                                                        data?.map(history=>(
                                                            <RegisterHistoryBox 
                                                                data={history}
                                                                key={history.id}
                                                                onPress={()=>navigation.navigate('History/Detail',{registryId:history.id,car:car})}
                                                            />
                                                        ))
                                                    }
                                                </>
                                            )
                                        }
                                    </CheckNullData>
                                </ScrollView>
                            )
                        }
                    </CheckNullData>
                )
            }
        </View>
    )
}

export default HistoryListScreen

const styles = StyleSheet.create({
    buttonStyle:{
        justifyContent:'center',
        flexDirection:'row',
        alignItems:'center',
        alignSelf:'flex-start',
    },
    buttonStyle_img:{
        width:44,
        height:44,
        resizeMode:'cover',
        borderRadius:3,
        marginRight:12
    },
    buttonStyle_text:{
        fontFamily:Font.BeVietnamProSemiBold,
        fontSize:16,
        lineHeight:24,
        color:'#394B6A',
        fontWeight:'600',
        flex:1,
    },
    dropdownStyle:{
        borderRadius:6,
        height:300,
    },
    rowStyle:{
        paddingHorizontal:30,
        height:null,
        paddingVertical:15
    },
    scrollView:{
        backgroundColor:'#FFFFFF',
        flex:1,
    }
})